// Temporary test page for the calculator (ticket 01): browser-default styling, nothing stored. Replaced by the
// designed screens once the design track has run.
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { calculate, describe, type Inputs, type Label, type Range } from "./calculator";

const LABELS: Label[] = ["demo", "assumption", "company-supplied", "measured"];
const BROKER = { one: "enquiry", many: "enquiries" };
const SCENARIOS = ["low", "expected", "high"] as const;

/** The fictional broker's demo inputs (spec Q7): every number is labelled demo, payback is Proofloop's default. */
const DEMO: Required<Inputs> = {
  cases: { value: { low: "80", expected: "120", high: "160" }, label: "demo" },
  netMinutes: { value: { low: "3", expected: "5", high: "7" }, label: "demo" },
  hourlyCost: { value: "45", label: "demo" },
  runningCost: { value: "10", label: "demo" },
  setupCost: { value: "720", label: "demo" },
  paybackMonths: { value: "12", label: "assumption" },
};

const FIELDS: [key: keyof Inputs, name: string][] = [
  ["cases", "Enquiries per month"],
  ["netMinutes", "Net minutes saved per enquiry (after review and corrections)"],
  ["hourlyCost", "Hourly staff cost (€)"],
  ["runningCost", "Running cost per month (€)"],
  ["setupCost", "Setup cost (€)"],
  ["paybackMonths", "Payback period (months)"],
];
const NAMES = Object.fromEntries(FIELDS) as Record<keyof Inputs, string>;

function App() {
  const [inputs, setInputs] = useState(DEMO);
  const update = (key: keyof Inputs, patch: object) =>
    setInputs((all) => ({ ...all, [key]: { ...all[key], ...patch } }));
  const result = calculate(inputs);

  return (
    <main>
      <p>
        <strong>Temporary page, design comes later.</strong> All starting numbers are demo data for a fictional
        broker. Nothing you type is stored.
      </p>
      <h1>Does it pay off?</h1>

      <table>
        <thead>
          <tr>
            <th scope="col">Input</th>
            <th scope="col">Value (low / expected / high)</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {FIELDS.map(([key, name]) => {
            const input = inputs[key];
            const value = input.value;
            return (
              <tr key={key}>
                <th scope="row">{name}</th>
                <td>
                  {typeof value === "object" ? (
                    SCENARIOS.map((at) => (
                      <input
                        key={at}
                        aria-label={`${name}, ${at}`}
                        inputMode="decimal"
                        size={6}
                        value={value[at]}
                        onChange={(e) => update(key, { value: { ...value, [at]: e.target.value } as Range })}
                      />
                    ))
                  ) : (
                    <input
                      aria-label={name}
                      inputMode="decimal"
                      size={6}
                      value={value}
                      onChange={(e) => update(key, { value: e.target.value })}
                    />
                  )}
                </td>
                <td>
                  <select aria-label={`${name}, source`} value={input.label} onChange={(e) => update(key, { label: e.target.value })}>
                    {LABELS.map((label) => (
                      <option key={label}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {result.ok ? (
        <>
          <p>Source of every result: {result.label} (the weakest source among the inputs).</p>
          {SCENARIOS.map((at) => {
            const text = describe(result[at], BROKER);
            return (
              <section key={at}>
                <h2>{at[0].toUpperCase() + at.slice(1)}</h2>
                <p>
                  <strong>{text.breakEven}</strong>
                </p>
                <ul>
                  <li>{text.paysOff}</li>
                  <li>{text.hours}</li>
                  <li>{text.staffTime}</li>
                  <li>{text.monthlyCost}</li>
                  <li>{text.switching}</li>
                </ul>
              </section>
            );
          })}
        </>
      ) : (
        <section role="alert">
          <h2>No result: fix these inputs</h2>
          <ul>
            {result.errors.map((error) => (
              <li key={error.field + error.message}>
                {NAMES[error.field]}: {error.message}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
