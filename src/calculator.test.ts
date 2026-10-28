import type Decimal from "decimal.js";
import fc from "fast-check";
import { describe as group, expect, it } from "vitest";
import { calculate, describe, rounded, type Inputs, type Label, type Scenario } from "./calculator";

/** Ticket 01 common inputs: €45/h, €10 running, €720 setup over 12 months (= €70 a month), all labelled demo. */
function demo(cases: number, minutes: number, overrides: Partial<Inputs> = {}): Inputs {
  return {
    cases: { value: { low: cases, expected: cases, high: cases }, label: "demo" },
    netMinutes: { value: { low: minutes, expected: minutes, high: minutes }, label: "demo" },
    hourlyCost: { value: 45, label: "demo" },
    runningCost: { value: 10, label: "demo" },
    setupCost: { value: 720, label: "demo" },
    paybackMonths: { value: 12, label: "demo" },
    ...overrides,
  };
}

const broker = { one: "enquiry", many: "enquiries" };

function expected(inputs: Inputs) {
  const result = calculate(inputs);
  if (!result.ok) throw new Error(`unexpected errors: ${JSON.stringify(result.errors)}`);
  return result.expected;
}

group("acceptance examples", () => {
  it("E1 expected scenario (worked example)", () => {
    const s = expected(demo(120, 5));
    expect(s.valuePerCase.toString()).toBe("3.75");
    expect(s.paysOff).toBe(true);
    expect(s.label).toBe("demo");
    const r = rounded(s);
    expect(r.monthlyCost.toString()).toBe("70");
    expect(r.breakEven?.toString()).toBe("19");
    expect(r.hoursFreed.toFixed(1)).toBe("10.0");
    expect(r.staffTimeValue.toString()).toBe("450");
    expect(r.switchingMinutes?.toFixed(1)).toBe("0.8");
    const text = describe(s, broker);
    expect(text.monthlyCost).toBe("Costs €70 a month (running cost plus setup spread over 12 months)");
    expect(text.breakEven).toBe("Pays off from 19 enquiries a month");
    expect(text.hours).toBe("Frees 10.0 hours a month");
    expect(text.staffTime).toBe("€450 of staff time a month (not cash saved)");
    expect(text.switching).toBe("Still pays off as long as it saves at least 0.8 minutes per enquiry");
  });

  it("E2 and E3: low pairs with low, high with high (demo ranges 80/120/160 cases, 3/5/7 min)", () => {
    const result = calculate({
      ...demo(0, 0),
      cases: { value: { low: 80, expected: 120, high: 160 }, label: "demo" },
      netMinutes: { value: { low: 3, expected: 5, high: 7 }, label: "demo" },
    });
    if (!result.ok) throw new Error("unexpected errors");
    const low = rounded(result.low);
    expect(low.breakEven?.toString()).toBe("32");
    expect(result.low.paysOff).toBe(true);
    expect(low.hoursFreed.toFixed(1)).toBe("4.0");
    expect(low.staffTimeValue.toString()).toBe("180");
    expect(low.switchingMinutes?.toFixed(1)).toBe("1.2");
    expect(rounded(result.expected).breakEven?.toString()).toBe("19");
    const high = rounded(result.high);
    expect(high.breakEven?.toString()).toBe("14");
    expect(result.high.paysOff).toBe(true);
    expect(result.high.hoursFreed.toFixed(2)).toBe("18.67");
    expect(high.hoursFreed.toFixed(1)).toBe("18.6");
    expect(high.staffTimeValue.toString()).toBe("840");
    expect(high.switchingMinutes?.toFixed(1)).toBe("0.6");
  });

  it("E4 no net saving never pays off", () => {
    const s = expected(demo(120, 0));
    expect(s.paysOff).toBe(false);
    const r = rounded(s);
    expect(r.breakEven).toBeNull();
    expect(r.hoursFreed.toFixed(1)).toBe("0.0");
    expect(r.staffTimeValue.toFixed(0)).toBe("0");
    expect(r.switchingMinutes?.toFixed(1)).toBe("0.8");
    expect(describe(s, broker).breakEven).toBe("Never pays off at these inputs");
    expect(describe(s, broker).paysOff).toBe("Does not pay off at 120 enquiries a month");
  });

  it("E5 the new way is slower: adds work, never pays off, keeps the weakest label", () => {
    const s = expected(demo(120, -2, { netMinutes: { value: { low: -2, expected: -2, high: -2 }, label: "measured" } }));
    expect(s.paysOff).toBe(false);
    expect(rounded(s).breakEven).toBeNull();
    expect(s.label).toBe("demo");
    const text = describe(s, broker);
    expect(text.breakEven).toBe("Never pays off at these inputs");
    expect(text.hours).toBe("Adds 4.0 hours of work a month");
    expect(text.staffTime).toBe("€180 of staff time a month (not cash saved)");
  });

  it("E6 no costs pays off from the first enquiry", () => {
    const s = expected(demo(120, 5, { runningCost: { value: 0, label: "demo" }, setupCost: { value: 0, label: "demo" } }));
    expect(s.paysOff).toBe(true);
    const r = rounded(s);
    expect(r.breakEven?.toString()).toBe("0");
    expect(r.switchingMinutes?.toFixed(1)).toBe("0.0");
    expect(r.hoursFreed.toFixed(1)).toBe("10.0");
    expect(describe(s, broker).breakEven).toBe("Pays off from the first enquiry");
    expect(describe(s, broker).switching).toBe("Any net saving pays off");
    expect(describe(s, broker).paysOff).toBe("Pays off at 120 enquiries a month");
  });

  it("E7 no cases: break-even stands, no switching value", () => {
    const s = expected(demo(0, 5));
    expect(s.paysOff).toBe(false);
    const r = rounded(s);
    expect(r.breakEven?.toString()).toBe("19");
    expect(r.hoursFreed.toFixed(1)).toBe("0.0");
    expect(r.staffTimeValue.toFixed(0)).toBe("0");
    expect(r.switchingMinutes).toBeNull();
    expect(describe(s, broker).switching).toBe("No switching value: no enquiries");
    expect(describe(s, broker).paysOff).toBe("Does not pay off at 0 enquiries a month");
  });
  it("E8 label inheritance: the default payback is an assumption until the company supplies it", () => {
    const supplied = (value: number) => ({ value, label: "company-supplied" as const });
    const inputs: Inputs = {
      cases: { value: { low: 80, expected: 120, high: 160 }, label: "company-supplied" },
      netMinutes: { value: { low: 3, expected: 5, high: 7 }, label: "measured" },
      hourlyCost: supplied(45),
      runningCost: supplied(10),
      setupCost: supplied(720),
    };
    const byDefault = calculate(inputs);
    if (!byDefault.ok) throw new Error("unexpected errors");
    expect(byDefault.label).toBe("assumption");
    expect([byDefault.low.label, byDefault.expected.label, byDefault.high.label]).toEqual(["assumption", "assumption", "assumption"]);
    expect(byDefault.expected.paybackMonths.toString()).toBe("12");
    const withPayback = calculate({ ...inputs, paybackMonths: supplied(12) });
    if (!withPayback.ok) throw new Error("unexpected errors");
    expect(withPayback.label).toBe("company-supplied");
    expect(withPayback.expected.label).toBe("company-supplied");
  });

  it("E9 exactness: no float drift, rounding only for display", () => {
    const s = expected(
      demo(100, 7, {
        hourlyCost: { value: 33.33, label: "demo" },
        runningCost: { value: 0, label: "demo" },
        setupCost: { value: 0, label: "demo" },
      }),
    );
    expect(s.valuePerCase.toString()).toBe("3.8885");
    expect(s.staffTimeValue.toString()).toBe("388.85");
    expect(s.hoursFreed.toFixed(6)).toBe("11.666667");
    const r = rounded(s);
    expect(r.hoursFreed.toFixed(1)).toBe("11.6");
    expect(r.staffTimeValue.toString()).toBe("388");
  });
});

group("E11 display noun", () => {
  it("(a) defaults to cases, (b) takes any noun, with the same numbers", () => {
    const s = expected(demo(120, 5));
    const plain = describe(s);
    const booking = describe(s, { one: "booking", many: "bookings" });
    expect(plain.breakEven).toBe("Pays off from 19 cases a month");
    expect(plain.switching).toBe("Still pays off as long as it saves at least 0.8 minutes per case");
    expect(booking.breakEven).toBe("Pays off from 19 bookings a month");
    expect(booking.switching).toBe("Still pays off as long as it saves at least 0.8 minutes per booking");
    expect(booking.paysOff).toBe("Pays off at 120 bookings a month");
    const numbers = (text: Record<string, string>) => Object.values(text).map((line) => line.match(/[\d.]+/g));
    expect(numbers(booking)).toEqual(numbers(plain));
  });

  it("(c) a count of exactly 1 is singular", () => {
    const s = expected(
      demo(1, 5, {
        runningCost: { value: 0, label: "demo" },
        setupCost: { value: 3, label: "demo" },
        paybackMonths: { value: 1, label: "demo" },
      }),
    );
    const text = describe(s, broker);
    expect(rounded(s).breakEven?.toString()).toBe("1");
    expect(text.breakEven).toBe("Pays off from 1 enquiry a month");
    expect(text.paysOff).toBe("Pays off at 1 enquiry a month");
    expect(text.switching).toBe("Still pays off as long as it saves at least 4.0 minutes per enquiry");
  });
});

group("E10 invalid input is rejected with the field named, and no output", () => {
  const range = (low: number | string, expected: number | string, high: number | string) => ({
    value: { low, expected, high },
    label: "demo" as const,
  });
  const single = (value: number | string) => ({ value, label: "demo" as const });
  it.each<[string, Partial<Inputs>, keyof Inputs]>([
    ["cases low > expected", { cases: range(130, 120, 160) }, "cases"],
    ["cases expected > high", { cases: range(80, 170, 160) }, "cases"],
    ["minutes low > expected", { netMinutes: range(6, 5, 7) }, "netMinutes"],
    ["minutes expected > high", { netMinutes: range(3, 8, 7) }, "netMinutes"],
    ["hourly €0", { hourlyCost: single(0) }, "hourlyCost"],
    ["hourly negative", { hourlyCost: single(-45) }, "hourlyCost"],
    ["running −€1", { runningCost: single(-1) }, "runningCost"],
    ["setup −€1", { setupCost: single(-1) }, "setupCost"],
    ["payback 0", { paybackMonths: single(0) }, "paybackMonths"],
    ["payback 1.5", { paybackMonths: single(1.5) }, "paybackMonths"],
    ["cases 12.5", { cases: range(12.5, 120, 160) }, "cases"],
    ["cases negative", { cases: range(-1, 120, 160) }, "cases"],
    ["NaN cases", { cases: range(80, Number.NaN, 160) }, "cases"],
    ["NaN minutes", { netMinutes: range(3, 5, Number.NaN) }, "netMinutes"],
    ["NaN hourly", { hourlyCost: single(Number.NaN) }, "hourlyCost"],
    ["NaN running", { runningCost: single(Number.NaN) }, "runningCost"],
    ["NaN setup", { setupCost: single(Number.NaN) }, "setupCost"],
    ["NaN payback", { paybackMonths: single(Number.NaN) }, "paybackMonths"],
    ["Infinity hourly", { hourlyCost: single(Number.POSITIVE_INFINITY) }, "hourlyCost"],
    ["text that is not a number", { setupCost: single("720 EUR") }, "setupCost"],
    ["empty text", { runningCost: single("") }, "runningCost"],
    ["hex text", { setupCost: single("0x2D0") }, "setupCost"],
    ["unknown label", { hourlyCost: { value: 45, label: "guess" as never } }, "hourlyCost"],
    ["a list instead of a number", { hourlyCost: single(["45"] as never) }, "hourlyCost"],
    ["more than 4 decimal places", { hourlyCost: single("45.00001") }, "hourlyCost"],
    ["one range value with more than 4 decimal places", { netMinutes: range("3", "5.00001", "7") }, "netMinutes"],
    ["float noise (0.1 + 0.2)", { runningCost: single(0.1 + 0.2) }, "runningCost"],
    ["a trillion cases", { cases: range(80, 120, "1000000000000") }, "cases"],
    ["a trillion negative minutes", { netMinutes: range(-1e12, 5, 7) }, "netMinutes"],
  ])("%s", (_case, override, field) => {
    const result = calculate(demo(120, 5, override));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.map((e) => e.field)).toEqual([field]);
    expect(result.errors[0].message).not.toBe("");
    expect(result).not.toHaveProperty("expected");
  });

  it("reports every invalid field at once", () => {
    const result = calculate(demo(120, 5, { hourlyCost: single(0), runningCost: single(-1) }));
    expect(result.ok ? [] : result.errors.map((e) => e.field)).toEqual(["hourlyCost", "runningCost"]);
  });

  it("accepts numbers given as text, negative minutes, and values at the limits", () => {
    const text = calculate(demo(120, -2, { cases: range("80", "120", "160"), hourlyCost: single("33.3333") }));
    expect(text.ok).toBe(true);
    const limits = calculate(demo(120, 5, { cases: range(0, 120, "999999999999"), setupCost: single("999999999999.9999") }));
    expect(limits.ok).toBe(true);
  });
});

// Properties. Inputs are generated as integers (cases, months, and minutes and euros in units of 0.0001) so an
// independent oracle can compute every exact value as a BigInt fraction, without decimal.js.
const RANK: Record<Label, number> = { demo: 0, assumption: 1, "company-supplied": 2, measured: 3 };
const UNIT = 10_000n; // minutes and euros are generated in units of 1 / UNIT, i.e. 4 decimal places
const sorted3 = (arb: fc.Arbitrary<bigint>) =>
  fc.tuple(arb, arb, arb).map((xs) => [...xs].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));
const labels = fc.tuple(...Array.from({ length: 6 }, () => fc.constantFrom<Label>(...(Object.keys(RANK) as Label[]))));
const cents = (min: number, max: number) => fc.integer({ min, max }).map((c) => BigInt(c) * (UNIT / 100n));

/** Realistic inputs: up to 5,000 cases, ±10 minutes, €500 an hour, cents only. */
const raw = fc.record({
  e: sorted3(fc.integer({ min: 0, max: 5000 }).map(BigInt)),
  m: sorted3(cents(-1000, 1000)),
  h: cents(1, 50_000),
  r: cents(0, 1_000_000),
  s: cents(0, 10_000_000),
  p: fc.option(fc.integer({ min: 1, max: 120 }).map(BigInt), { nil: undefined }), // undefined: the default 12
  labels,
});
/** Inputs anywhere up to the validation limits: below 10^12, 4 decimal places. */
const below = 10n ** 12n;
const limits = fc.record({
  e: sorted3(fc.bigInt({ min: 0n, max: below - 1n })),
  m: sorted3(fc.bigInt({ min: -(below * UNIT) + 1n, max: below * UNIT - 1n })),
  h: fc.bigInt({ min: 1n, max: below * UNIT - 1n }),
  r: fc.bigInt({ min: 0n, max: below * UNIT - 1n }),
  s: fc.bigInt({ min: 0n, max: below * UNIT - 1n }),
  p: fc.option(fc.bigInt({ min: 1n, max: below - 1n }), { nil: undefined }),
  labels,
});
type Raw = typeof raw extends fc.Arbitrary<infer T> ? T : never;

/** n / UNIT as plain decimal text, e.g. -20500n → "-2.0500". */
const scaled = (n: bigint) => {
  const digits = (n < 0n ? -n : n).toString().padStart(5, "0");
  return `${n < 0n ? "-" : ""}${digits.slice(0, -4)}.${digits.slice(-4)}`;
};

function toInputs(x: Raw): Inputs {
  const [le, lm, lh, lr, ls, lp] = x.labels;
  return {
    cases: { value: { low: x.e[0].toString(), expected: x.e[1].toString(), high: x.e[2].toString() }, label: le },
    netMinutes: { value: { low: scaled(x.m[0]), expected: scaled(x.m[1]), high: scaled(x.m[2]) }, label: lm },
    hourlyCost: { value: scaled(x.h), label: lh },
    runningCost: { value: scaled(x.r), label: lr },
    setupCost: { value: scaled(x.s), label: ls },
    ...(x.p === undefined ? {} : { paybackMonths: { value: x.p.toString(), label: lp } }),
  };
}

function scenarios(x: Raw): Scenario[] {
  const result = calculate(toInputs(x));
  if (!result.ok) throw new Error(`valid input rejected: ${JSON.stringify(result.errors)}`);
  return [result.low, result.expected, result.high];
}

type Fraction = [num: bigint, den: bigint]; // den > 0

/** Exact values of scenario i, from the formulas in the ticket (m, h, r, s are in units of 1 / UNIT). */
function oracle(x: Raw, i: number) {
  const [e, m, h, r, s, p] = [x.e[i], x.m[i], x.h, x.r, x.s, x.p ?? 12n];
  const costTimesPayback = r * p + s; // monthly cost × payback, in units of 1 / UNIT
  return {
    monthlyCost: [costTimesPayback, UNIT * p] as Fraction,
    breakEven: m * h > 0n ? ([costTimesPayback * 60n * UNIT, p * m * h] as Fraction) : null,
    paysOff: m * h > 0n && e * p * m * h >= costTimesPayback * 60n * UNIT,
    hoursFreed: [e * m, 60n * UNIT] as Fraction,
    staffTimeValue: [e * m * h, 60n * UNIT * UNIT] as Fraction,
    switchingMinutes: e > 0n ? ([costTimesPayback * 60n, p * e * h] as Fraction) : null,
  };
}

/** sign(d − n/den), exactly. */
function compare(d: Decimal, [n, den]: Fraction): number {
  const [int, frac = ""] = d.toFixed().split(".");
  const diff = BigInt(int + frac) * den - n * 10n ** BigInt(frac.length);
  return diff > 0n ? 1 : diff < 0n ? -1 : 0;
}
const plus = ([n, den]: Fraction, step: Fraction): Fraction => [n * step[1] + step[0] * den, den * step[1]];
const minus = (q: Fraction, [sn, sd]: Fraction) => plus(q, [-sn, sd]);

/** Rounded down by less than one step: exact − step < d ≤ exact. */
function roundedDown(d: Decimal, exact: Fraction, step: Fraction) {
  expect(compare(d, exact)).toBeLessThanOrEqual(0);
  expect(compare(d, minus(exact, step))).toBe(1);
}
/** Rounded up by less than one step: exact ≤ d < exact + step. */
function roundedUp(d: Decimal, exact: Fraction, step: Fraction) {
  expect(compare(d, exact)).toBeGreaterThanOrEqual(0);
  expect(compare(d, plus(exact, step))).toBe(-1);
}

const breakEvenRank = (s: Scenario) => rounded(s).breakEven?.toNumber() ?? Number.POSITIVE_INFINITY;

group("properties", () => {
  it("break-even never rises when net minutes rise, everything else fixed", () => {
    fc.assert(
      fc.property(raw, cents(-1000, 1000), cents(0, 2000), (x, m, more) => {
        const at = (minutes: bigint) => scenarios({ ...x, m: [minutes, minutes, minutes] })[1];
        const [before, after] = [at(m), at(m + more)];
        expect(breakEvenRank(after)).toBeLessThanOrEqual(breakEvenRank(before));
        if (before.breakEven && after.breakEven) expect(after.breakEven.lte(before.breakEven)).toBe(true);
      }),
    );
  });

  it("hours freed never fall when cases rise (net minutes > 0)", () => {
    fc.assert(
      fc.property(raw, fc.bigInt({ min: 0n, max: 5000n }), fc.bigInt({ min: 0n, max: 5000n }), cents(1, 1000), (x, e, more, m) => {
        const at = (cases: bigint) => scenarios({ ...x, e: [cases, cases, cases], m: [m, m, m] })[1];
        const [before, after] = [at(e), at(e + more)];
        expect(after.hoursFreed.gte(before.hoursFreed)).toBe(true);
        expect(rounded(after).hoursFreed.gte(rounded(before).hoursFreed)).toBe(true);
      }),
    );
  });

  it("the result label is always the weakest input label", () => {
    fc.assert(
      fc.property(raw, (x) => {
        const result = calculate(toInputs(x));
        if (!result.ok) throw new Error("valid input rejected");
        const inputLabels: Label[] = [...x.labels.slice(0, 5), x.p === undefined ? "assumption" : x.labels[5]];
        const weakest = Math.min(...inputLabels.map((l) => RANK[l]));
        for (const label of [result.label, result.low.label, result.expected.label, result.high.label]) {
          expect(RANK[label]).toBe(weakest);
        }
      }),
    );
  });

  it.each([
    ["realistic inputs", raw],
    ["inputs up to the validation limits", limits],
  ])("displayed benefits never exceed the exact value; displayed costs and thresholds never fall below it (%s)", (_name, arb) => {
    fc.assert(
      fc.property(arb, (x) => {
        scenarios(x).forEach((s, i) => {
          const exact = oracle(x, i);
          const r = rounded(s);
          expect(s.paysOff).toBe(exact.paysOff);
          roundedUp(r.monthlyCost, exact.monthlyCost, [1n, 1n]);
          roundedDown(r.hoursFreed, exact.hoursFreed, [1n, 10n]);
          roundedDown(r.staffTimeValue, exact.staffTimeValue, [1n, 1n]);
          expect(r.breakEven === null).toBe(exact.breakEven === null);
          if (r.breakEven && exact.breakEven) roundedUp(r.breakEven, exact.breakEven, [1n, 1n]);
          expect(r.switchingMinutes === null).toBe(exact.switchingMinutes === null);
          if (r.switchingMinutes && exact.switchingMinutes) roundedUp(r.switchingMinutes, exact.switchingMinutes, [1n, 10n]);
        });
      }),
    );
  });

  it("for any two nouns, describe contains the same numbers and differs only in the noun words", () => {
    const word = fc.stringMatching(/^[a-z]{1,12}$/);
    const noun = fc.record({ one: word, many: word });
    // Sentinels mark where each noun goes; any noun must fill exactly those slots and change nothing else.
    const slots = { one: "\u0001", many: "\u0002" };
    fc.assert(
      fc.property(raw, noun, noun, (x, a, b) => {
        for (const s of scenarios(x)) {
          const [template, forA, forB] = [describe(s, slots), describe(s, a), describe(s, b)];
          for (const key of Object.keys(template) as (keyof typeof template)[]) {
            expect(forA[key]).toBe(template[key].replaceAll(slots.one, a.one).replaceAll(slots.many, a.many));
            expect(forB[key].match(/\d+(\.\d+)?/g)).toEqual(template[key].match(/\d+(\.\d+)?/g));
          }
        }
      }),
    );
  });

  it.each([
    ["realistic inputs", raw],
    ["inputs up to the validation limits", limits],
  ])("no output is NaN or Infinity (%s)", (_name, arb) => {
    fc.assert(
      fc.property(arb, (x) => {
        for (const s of scenarios(x)) {
          const numbers = [...Object.values(s), ...Object.values(rounded(s))].filter((v): v is Decimal => typeof v === "object" && v !== null);
          for (const n of numbers) expect(n.isFinite()).toBe(true);
          for (const text of Object.values(describe(s, broker))) expect(text).not.toMatch(/NaN|Infinity|undefined|null/);
        }
      }),
    );
  });
});
