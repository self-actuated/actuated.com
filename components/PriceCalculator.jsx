import { useState, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

function Card({ children, borderStyle = "default" }) {
  let borderClass = "ring-1 ring-gray-200";

  switch (borderStyle) {
    case "default":
      borderClass = "ring-1 ring-gray-200";
      break;
    case "highlight":
      borderClass = "ring-2 ring-indigo-600";
      break;
  }

  return (
    <div
      className={`mx-auto mt-4 max-w-2xl rounded-xl ${borderClass} lg:mx-0 lg:flex lg:max-w-none`}
    >
      <div className="px-8 sm:px-10 py-8 lg:flex-auto">{children}</div>
    </div>
  );
}

function PricingTable({ prices }) {
  return (
    <table className="mt-2 w-full whitespace-nowrap text-left text-sm/6">
      <colgroup>
        <col className="w-full" />
        <col />
        <col />
        <col />
      </colgroup>
      <thead className="border-b border-gray-200 text-gray-900">
        <tr>
          <th scope="col" className="px-0 py-3 font-semibold">
            Runner size
          </th>
          <th
            scope="col"
            className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell"
          >
            Cost per minute
          </th>
          <th scope="col" className="py-3 pl-8 pr-0 text-right font-semibold">
            Cost per month
          </th>
        </tr>
      </thead>
      <tbody>
        {prices.map((price) => (
          <tr key={price.runnerSize} className="border-b border-gray-100">
            <td className="max-w-0 px-0 py-2 align-top">
              <div className="truncate font-medium text-gray-900">
                {price.runnerSize}
              </div>
            </td>
            <td className="hidden py-2 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
              <span
                className={`px-2 py-1 ${
                  price.highlight
                    ? "font-semibold text-indigo-600 bg-indigo-50 rounded"
                    : ""
                }`}
              >
                ${price.costPerMinute}
              </span>
            </td>
            <td className="py-2 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
              <span
                className={`px-2 py-1 ${
                  price.highlight
                    ? "font-semibold text-indigo-600 bg-indigo-50 rounded"
                    : ""
                }`}
              >
                ${price.costPerMonth}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Input({
  name,
  label,
  value,
  onChange,
  leadingAddon,
  trailingAddon,
  disabled,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <div
          className={
            "flex items-center rounded-md  px-3 outline outline-1 -outline-offset-1  focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600" +
            (disabled
              ? " cursor-not-allowed bg-gray-50 text-gray-500 outline-gray-200"
              : "bg-white outline-gray-300")
          }
        >
          {leadingAddon && (
            <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
              {leadingAddon}
            </div>
          )}
          <input
            id={name}
            name={name}
            value={value}
            type="number"
            inputMode="numeric"
            placeholder="0"
            aria-describedby={leadingAddon ? `${name}-addon` : undefined}
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0  disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:outline-gray-200 sm:text-sm/6"
            onChange={onChange && ((e) => onChange(e.target.value))}
            disabled={disabled}
          />
          {trailingAddon && (
            <div
              id={`${name}-addon`}
              className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"
            >
              {trailingAddon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FIRST_SERVER_PRICE = 150;
const ADDITIONAL_SERVER_PRICE = 125;
const CHECKOUT_URL =
  "https://subscribe.openfaas.com/checkout/buy/126e705d-7956-430d-a865-78f4696ac715";

function calcPrice(servers) {
  return FIRST_SERVER_PRICE + (servers - 1) * ADDITIONAL_SERVER_PRICE;
}

const plans = [
  ...Array.from({ length: 10 }, (_, i) => {
    const servers = i + 1;
    return {
      name: `${servers} server${servers > 1 ? "s" : ""}`,
      servers,
      sliderLabel: String(servers),
      price: calcPrice(servers),
    };
  }),
  {
    name: "Custom",
    description: "Larger fleets or bespoke requirements",
    servers: "Custom",
    sliderLabel: "Custom",
    price: 0,
    isEnterprise: true,
    enterpriseFeatures: [
      "Unlimited servers across multiple GitHub organizations",
      "Gain visibility and control over all CI/CD jobs",
      "Egress filtering for HTTPS and DNS",
      "Private peering for agents",
      "Fine-grained access to the GitHub API",
      "Support via email & Slack",
    ],
    enterpriseOptional: [
      "Dedicated Actuated control-plane",
    ],
  },
];

function Slider({ value, onChange, steps, labels }) {
  const max = steps.length - 1;
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(steps[parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-200 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-gray-200"
          style={{
            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
              (value / max) * 100
            }%, #e5e7eb ${(value / max) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="relative h-5 mt-2">
          {labels.map((label, index) => (
            <button
              key={index}
              onClick={() => onChange(steps[index])}
              className="absolute -translate-x-1/2 text-xs text-gray-500 hover:text-gray-900 cursor-pointer whitespace-nowrap"
              style={{ left: `${(index / max) * 100}%` }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanSelection({ plans, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (plan) => {
    const index = plans.findIndex((p) => p.name === plan.name);
    setSelectedIndex(index);
    onSelect && onSelect(plan);
  };

  return (
    <div>
      <p className="text-sm/6 font-semibold text-gray-900">How many servers?</p>
      <div className="mt-3">
        <Slider
          value={selectedIndex}
          onChange={handleChange}
          steps={plans}
          labels={plans.map((plan) => plan.sliderLabel)}
        />
      </div>
    </div>
  );
}

const globalPerks = [
  "Unlimited build minutes",
  "Unlimited RAM/CPUs",
  "Unlimited concurrency",
];

function TrulyUnlimited() {
  return (
    <div>
      <p className="text-sm/6 font-semibold text-gray-900">Truly unlimited</p>
      <ul className="mt-2 space-y-1">
        {globalPerks.map((perk) => (
          <li
            key={perk}
            className="flex items-center gap-x-2 text-sm text-gray-600"
          >
            <CheckIcon
              className="h-4 w-4 flex-none text-indigo-400"
              aria-hidden="true"
            />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActuatedLogo() {
  return <img src="/images/actuated.png" alt="Actuated Logo" />;
}

function GitHubLogo() {
  return <img src="/images/github-mark.png" alt="GitHub Logo" />;
}

function PricingSummary({ summary }) {
  return (
    <div className="rounded-2xl bg-gray-50 py-6 px-6 ring-1 ring-inset ring-gray-900/5">
      <div className="max-w-xs">
        <p className="text-base font-semibold text-indigo-600">
          {summary.plan.isEnterprise ? "Actuated Custom" : "Actuated Self-Service"}
        </p>
        <div className="mt-4">
          <ul className="list-disc pl-5 space-y-2">
            {summary.plan.description && (
              <li className="text-sm text-gray-600">
                {summary.plan.description}
              </li>
            )}
            {!summary.plan.isEnterprise && (
              <>
                <li className="text-sm text-gray-600">
                  {summary.plan.servers}x Server
                  {summary.plan.servers > 1 ? "s" : ""}
                </li>
                <li className="text-sm text-gray-600">
                  Reports across organisation, repos, & users
                </li>
                <li className="text-sm text-gray-600">Debug jobs via SSH</li>
                <li className="text-sm text-gray-600">
                  Prometheus metrics for servers and jobs
                </li>
                <li className="text-sm text-gray-600">
                  Community support, best-effort via email
                </li>
              </>
            )}
            {summary.plan.isEnterprise && summary.plan.enterpriseFeatures && (
              <>
                {summary.plan.enterpriseFeatures.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 font-medium">
                    {feature}
                  </li>
                ))}
              </>
            )}
          </ul>
            
          {summary.plan.isEnterprise && summary.plan.enterpriseOptional && (
            <>
            <p className="text-sm text-gray-600 mt-4 mb-2">Additional options</p>

            <ul className="list-disc pl-5 space-y-2">
              {summary.plan.enterpriseOptional.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 font-medium">
                  {feature}
                </li>
              ))}
              </ul>
            </>
          )}

        </div>
        <div className="mt-3 border-t border-gray-200 pt-3">
          <p className="text-sm font-medium text-gray-900">Total</p>
          {summary.plan.isEnterprise ? (
            <div className="mt-2">
              <p className="text-2xl font-bold tracking-tight text-gray-900">
                Custom pricing
              </p>
              <p className="text-sm text-gray-600">Paid annually</p>
            </div>
          ) : (
            <>
              <p className="mt-2 flex items-baseline gap-x-2">
                <span className="text-3xl font-bold tracking-tight text-gray-900">
                  ${summary.price}
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                  USD
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                  {" "}
                  / month
                </span>
              </p>
            </>
          )}
          <div className="mt-6 flex items-baseline gap-x-2">
            {!summary.plan.isEnterprise && (
              <a
                href={`${CHECKOUT_URL}?quantity=${summary.plan.servers}`}
                className="inline w-48 mr-8 rounded-md bg-indigo-600 px-6 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Checkout
              </a>
            )}
            <a
              href="https://forms.gle/8XmpTTWXbZwWkfqT6"
              className={
                summary.plan.isEnterprise
                  ? "inline w-48 rounded-md bg-indigo-600 px-6 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  : "inline-block w-48 text-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8"
              }
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const githuActionPrices = [
  {
    name: "2-core",
    costPerMinute: 0.008,
  },
  {
    name: "4-core",
    costPerMinute: 0.016,
  },
  {
    name: "8-core",
    costPerMinute: 0.032,
  },
  {
    name: "16-core",
    costPerMinute: 0.064,
  },
  {
    name: "32-core",
    costPerMinute: 0.128,
  },
];

function isWithinPercentageCeiling(val, ref, percentage) {
  const tolerance = ref * (percentage / 100);
  const upperBound = ref + tolerance;

  return val <= upperBound;
}

function calculateRunnerPricing(minutesTotal, actuatedPlanPrice) {
  const actuatedPerMinuteCost = actuatedPlanPrice / minutesTotal;

  return githuActionPrices.map((price) => {
    return {
      runnerSize: price.name,
      github: {
        costPerMinute: price.costPerMinute.toFixed(3),
        costPerMonth: (price.costPerMinute * minutesTotal).toFixed(0),
      },
      actuated: {
        costPerMinute: actuatedPerMinuteCost.toFixed(3),
        costPerMonth: actuatedPlanPrice.toFixed(0),
        highlight: isWithinPercentageCeiling(
          actuatedPerMinuteCost,
          price.costPerMinute,
          20
        ),
      },
    };
  });
}

function PlanCard({ plans, selectedPlan, onSelectPlan, summary }) {
  const heading = selectedPlan.isEnterprise ? "Enterprise Plan" : "Self-Service Plan";
  const tagline = selectedPlan.isEnterprise
    ? "Enterprise-grade security and scalability with custom pricing."
    : "Flat rate per server: $150 for the first, $125 for each additional.";
  return (
    <Card>
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="lg:max-w-xl">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">
            {heading}
          </h3>
          <p className="mt-1 text-base leading-7 text-gray-600">{tagline}</p>
          <div className="mt-4">
            <TrulyUnlimited />
          </div>
          <div className="mt-4">
            <PlanSelection plans={plans} onSelect={onSelectPlan} />
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 flex-1">
          <PricingSummary summary={summary} />
        </div>
      </div>
    </Card>
  );
}

function PricingCard({ title, prices, logo, borderStyle = "default" }) {
  return (
    <Card borderStyle={borderStyle}>
      <div className="flex flex-col lg:flex-row gap-2 items-center">
        <div className="w-6 h-6">{logo}</div>
        <h3 className="text-xl font-semibold tracking-tight text-gray-900">
          {title}
        </h3>
      </div>
      <PricingTable prices={prices} />
    </Card>
  );
}

function ComparisonSection({
  servers,
  jobs,
  setJobs,
  minutes,
  setMinutes,
  minutesTotal,
  setMinutesTotal,
  runnerPricing,
}) {
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <h3 className="text-xl font-semibold tracking-tight text-gray-900">
          How does this compare to GitHub's Hosted Runners?
        </h3>
        <p className="mt-1 text-base leading-7 text-gray-600">
          Most teams know roughly how often CI runs and how long their builds
          take. Tweak the numbers to match your workload.
        </p>
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="job-num"
              label="Number of jobs"
              trailingAddon="/month"
              value={jobs}
              onChange={setJobs}
            />
            <Input
              id="job-duration"
              label="Average job duration"
              trailingAddon="min"
              value={minutes}
              onChange={setMinutes}
            />
          </div>

          <div className="max-w-xs">
            <Input
              id="minutes-total"
              label="Build minutes per month"
              trailingAddon="min"
              value={minutesTotal}
              onChange={(value) => {
                setMinutesTotal(value);
                setJobs(undefined);
                setMinutes(undefined);
              }}
            />
            {(!jobs || !minutes) && (
              <p className="mt-1 text-xs text-gray-500">
                Set both jobs and duration above to use the estimator instead.
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500 max-w-lg">
            Get your exact number with{" "}
            <a
              href="https://github.com/self-actuated/actions-usage"
              className="text-indigo-600 hover:text-indigo-500 underline decoration-1 hover:decoration-2"
            >
              our free actions-usage tool
            </a>{" "}
            — takes 30 seconds.
          </p>
        </div>
      </Card>

      {runnerPricing && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <PricingCard
              title={`Self-hosted with ${servers}x actuated server${servers > 1 ? "s" : ""}`}
              borderStyle="highlight"
              prices={runnerPricing.map((price) => ({
                runnerSize: price.runnerSize,
                costPerMinute: price.actuated.costPerMinute,
                costPerMonth: price.actuated.costPerMonth,
                highlight: price.actuated.highlight,
              }))}
              logo={<ActuatedLogo />}
            />
          </div>
          <div className="flex-1">
            <PricingCard
              title="GitHub Actions hosted runners"
              prices={runnerPricing.map((price) => ({
                runnerSize: price.runnerSize,
                costPerMinute: price.github.costPerMinute,
                costPerMonth: price.github.costPerMonth,
              }))}
              logo={<GitHubLogo />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_JOBS = 3000;
const DEFAULT_AVG_MINUTES = 10;

function PriceCalculator() {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [jobs, setJobs] = useState(DEFAULT_JOBS);
  const [minutes, setMinutes] = useState(DEFAULT_AVG_MINUTES);
  const [minutesTotal, setMinutesTotal] = useState(
    DEFAULT_JOBS * DEFAULT_AVG_MINUTES
  );

  useEffect(() => {
    if (minutes && minutes != 0 && jobs && jobs != 0) {
      setMinutesTotal(minutes * jobs);
    }
  }, [jobs, minutes]);

  let costPerMinute = 0;
  if (minutesTotal && minutesTotal != 0 && !selectedPlan.isEnterprise) {
    costPerMinute = (selectedPlan.price / minutesTotal).toFixed(3);
  }

  const summary = {
    servers: selectedPlan.servers,
    plan: selectedPlan,
    jobs,
    minutes,
    costPerMinute,
    price: selectedPlan.price,
  };

  const runnerPricing =
    minutesTotal && minutesTotal != 0 && !selectedPlan.isEnterprise
      ? calculateRunnerPricing(minutesTotal, selectedPlan.price)
      : null;

  return (
    <div>
      <PlanCard
        plans={plans}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        summary={summary}
      />
      {!selectedPlan.isEnterprise && (
        <ComparisonSection
          servers={selectedPlan.servers}
          jobs={jobs}
          setJobs={setJobs}
          minutes={minutes}
          setMinutes={setMinutes}
          minutesTotal={minutesTotal}
          setMinutesTotal={setMinutesTotal}
          runnerPricing={runnerPricing}
        />
      )}
    </div>
  );
}

export default PriceCalculator;
