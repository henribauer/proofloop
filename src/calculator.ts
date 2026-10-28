import Decimal from "decimal.js";

// Inputs are bounded (below 10^12, at most 4 decimal places), so every product of three inputs fits in 48 digits and
// stays exact at 60; each output is one correctly rounded division of exact values, and display rounding is exact.
const D = Decimal.clone({ precision: 60 });
const LIMIT = new D("1e12");
const MAX_DECIMALS = 4;

/** Provenance of a number, weakest first. A result takes the weakest label among its inputs. */
export type Label = "demo" | "assumption" | "company-supplied" | "measured";
export type Value = number | string;
export type Labelled<T> = { value: T; label: Label };
export type Range = { low: Value; expected: Value; high: Value };

export interface Inputs {
  cases: Labelled<Range>;
  /** Net minutes saved per case, after review and corrections. May be negative. */
  netMinutes: Labelled<Range>;
  hourlyCost: Labelled<Value>;
  runningCost: Labelled<Value>;
  setupCost: Labelled<Value>;
  /** Months to spread the setup cost over. Defaults to 12, labelled assumption. */
  paybackMonths?: Labelled<Value>;
}

/** Exact values for one scenario. Round only through `rounded` / `describe`. */
export interface Scenario {
  cases: Decimal;
  netMinutes: Decimal;
  paybackMonths: Decimal;
  monthlyCost: Decimal;
  valuePerCase: Decimal;
  /** Cases a month at which it pays off; null when it never does (value per case ≤ 0). */
  breakEven: Decimal | null;
  paysOff: boolean;
  hoursFreed: Decimal;
  staffTimeValue: Decimal;
  /** Least net minutes per case at which it still pays off; null without cases. */
  switchingMinutes: Decimal | null;
  label: Label;
}

export type FieldError = { field: keyof Inputs; message: string };
export type Result =
  | { ok: true; low: Scenario; expected: Scenario; high: Scenario; label: Label }
  | { ok: false; errors: FieldError[] };

const LABELS: readonly Label[] = ["demo", "assumption", "company-supplied", "measured"];
const DEFAULT_PAYBACK: Labelled<Value> = { value: 12, label: "assumption" };

const RULES: Record<keyof Inputs, [ok: (d: Decimal) => boolean, message: string]> = {
  cases: [(d) => d.isInteger() && d.gte(0), "must be whole numbers of 0 or more"],
  netMinutes: [() => true, ""],
  hourlyCost: [(d) => d.gt(0), "must be more than 0"],
  runningCost: [(d) => d.gte(0), "must be 0 or more"],
  setupCost: [(d) => d.gte(0), "must be 0 or more"],
  paybackMonths: [(d) => d.isInteger() && d.gte(1), "must be a whole number of months, at least 1"],
};

/** Validates every input first: any error means no scenario at all, never a partial result. */
export function calculate(inputs: Inputs): Result {
  const all = { ...inputs, paybackMonths: inputs.paybackMonths ?? DEFAULT_PAYBACK };
  const errors: FieldError[] = [];
  const read = (field: keyof Inputs, values: Value[]): Decimal[] => {
    const fail = (message: string) => (errors.push({ field, message }), []);
    const [ok, message] = RULES[field];
    if (!LABELS.includes(all[field].label)) return fail(`has an unknown label "${all[field].label}"`);
    const parsed = values.map(parse);
    if (parsed.some((d) => d === null)) return fail("must be a number");
    const ds = parsed as Decimal[];
    if (ds.some((d) => d.decimalPlaces() > MAX_DECIMALS)) return fail(`must have at most ${MAX_DECIMALS} decimal places`);
    if (ds.some((d) => d.abs().gte(LIMIT))) return fail("must be below 1,000,000,000,000");
    if (!ds.every(ok)) return fail(message);
    if (ds.some((d, i) => i > 0 && ds[i - 1].gt(d))) return fail("needs low ≤ expected ≤ high");
    return ds;
  };
  const range = (field: "cases" | "netMinutes") => {
    const { low, expected, high } = all[field].value;
    return read(field, [low, expected, high]);
  };
  const cases = range("cases");
  const minutes = range("netMinutes");
  const [[hourly], [running], [setup], [payback]] = (
    ["hourlyCost", "runningCost", "setupCost", "paybackMonths"] as const
  ).map((field) => read(field, [all[field].value]));
  if (errors.length > 0) return { ok: false, errors };

  const label = LABELS[Math.min(...Object.values(all).map((input) => LABELS.indexOf(input.label)))];
  const at = (i: number) => scenario(cases[i], minutes[i], hourly, running, setup, payback, label);
  return { ok: true, low: at(0), expected: at(1), high: at(2), label };
}

/** A finite decimal, or null. Text must be a plain decimal ("12", "-2.5"): decimal.js alone also takes "0x1F". */
function parse(v: Value): Decimal | null {
  const plain = typeof v === "number" || (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v));
  if (!plain) return null;
  const d = new D(v);
  return d.isFinite() ? d : null;
}

function scenario(
  cases: Decimal,
  netMinutes: Decimal,
  hourly: Decimal,
  running: Decimal,
  setup: Decimal,
  payback: Decimal,
  label: Label,
): Scenario {
  // Multiply first, divide last: each output is a single division of exact products.
  const costOverPayback = running.times(payback).plus(setup); // monthly cost × payback months
  const valueTimes60 = netMinutes.times(hourly); // value per case × 60
  const breakEven = valueTimes60.gt(0) ? costOverPayback.times(60).div(payback.times(valueTimes60)) : null;
  return {
    cases,
    netMinutes,
    paybackMonths: payback,
    monthlyCost: costOverPayback.div(payback),
    valuePerCase: valueTimes60.div(60),
    breakEven,
    paysOff: breakEven !== null && cases.gte(breakEven),
    hoursFreed: cases.times(netMinutes).div(60),
    staffTimeValue: cases.times(valueTimes60).div(60),
    switchingMinutes: cases.gt(0) ? costOverPayback.times(60).div(payback.times(cases).times(hourly)) : null,
    label,
  };
}

/** Display values, rounded against the recommendation: benefits down, costs and thresholds up. */
export function rounded(s: Scenario) {
  return {
    monthlyCost: s.monthlyCost.toDecimalPlaces(0, D.ROUND_CEIL),
    breakEven: s.breakEven?.toDecimalPlaces(0, D.ROUND_CEIL) ?? null,
    hoursFreed: s.hoursFreed.toDecimalPlaces(1, D.ROUND_FLOOR),
    staffTimeValue: s.staffTimeValue.toDecimalPlaces(0, D.ROUND_FLOOR),
    switchingMinutes: s.switchingMinutes?.toDecimalPlaces(1, D.ROUND_CEIL) ?? null,
  };
}

/** The noun a process counts in, e.g. { one: "enquiry", many: "enquiries" }. Wording only, never a number. */
export type Noun = { one: string; many: string };

/** The sentences the page shows. Staff-time value never appears without "not cash saved". */
export function describe(s: Scenario, noun: Noun = { one: "case", many: "cases" }) {
  const r = rounded(s);
  const count = (n: Decimal) => `${n} ${n.eq(1) ? noun.one : noun.many}`;
  // abs(): negative hours are shown as added work, and -0 must not print as "-0.0".
  const hours = r.hoursFreed.abs().toFixed(1);
  return {
    monthlyCost: `Costs €${r.monthlyCost} a month (running cost plus setup spread over ${s.paybackMonths} months)`,
    breakEven:
      r.breakEven === null
        ? "Never pays off at these inputs"
        : r.breakEven.isZero()
          ? `Pays off from the first ${noun.one}`
          : `Pays off from ${count(r.breakEven)} a month`,
    paysOff: `${s.paysOff ? "Pays off" : "Does not pay off"} at ${count(s.cases)} a month`,
    hours: r.hoursFreed.lt(0) ? `Adds ${hours} hours of work a month` : `Frees ${hours} hours a month`,
    staffTime: `€${r.staffTimeValue.abs().toFixed(0)} of staff time a month (not cash saved)`,
    switching:
      r.switchingMinutes === null
        ? `No switching value: no ${noun.many}`
        : r.switchingMinutes.isZero()
          ? "Any net saving pays off"
          : `Still pays off as long as it saves at least ${r.switchingMinutes.toFixed(1)} minutes per ${noun.one}`,
  };
}
