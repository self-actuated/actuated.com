import { useState, useEffect } from "react";

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

const plans = [
  {
    name: "Basic",
    description: "Small team (5-10)",
    concurrency: "5x",
    price: 5*50,
    serverLimit: 1,
    orgLimit: 1,
  },
  {
    name: "Pro",
    description: "Average team (10-20)",
    concurrency: "10x",
    price: 10*50,
    serverLimit: 2,
    orgLimit: 2,
  },
  {
    name: "Pro Plus",
    description: "Average+ team (20-30)",
    concurrency: "15x",
    price: 15*50,
    serverLimit: 3,
    orgLimit: 2,
  },
  {
    name: "Team",
    description: "Scale-up (30-40)",
    concurrency: "20x",
    price: 20*50,
    serverLimit:  4,
    orgLimit: 3,
  },
  {
    name: "Team Plus",
    description: "Expanding team (40+)",
    concurrency: "35x",
    price: 35*50,
      serverLimit: 5,
    orgLimit: 5,
  },
  {
    name: "Multi Team",
    description: "Large organisation (50+)",
    concurrency: "50x",
    price: 50*50,
    serverLimit: 10,
    orgLimit: 10,
  },
  {
    name: "Enterprise",
    description: "Built for central IT / DevOps teams",
    concurrency: "Custom",
    price: 0, // Custom pricing
    serverLimit: "Unlimited",
    orgLimit: "Unlimited",
    isEnterprise: true,
    enterpriseFeatures: [
      "Low management, self-service onboarding for internal teams",
      "Gain visibility and control over all CI/CD jobs",
      "Egress filtering for HTTPS and DNS",
      "Private peering for agents",
      "Fine-grained access GitHub API",
      "Support via email & Slack"
    ],
    enterpriseOptional: [
      "Dedicated Actuated control-plane",
    ],
  },
];

function Slider({ value, onChange, steps, labels }) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="range"
          min="0"
          max={steps.length - 1}
          value={value}
          onChange={(e) => onChange(steps[parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-200 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-gray-200"
          style={{
            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
              (value / (steps.length - 1)) * 100
            }%, #e5e7eb ${(value / (steps.length - 1)) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 px-1">
          {labels.map((label, index) => (
            <button
              key={index}
              onClick={() => onChange(steps[index])}
              className="text-xs text-gray-500 hover:text-gray-900 cursor-pointer"
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
      <p className="flex flex-col">
        <span className="text-sm/6 font-semibold text-gray-900">
          Select an Actuated plan
        </span>
        <span className="text-sm text-gray-500">
          Select the concurrency level for your actuated plan.
        </span>
      </p>
      <div className="mt-4">
        <Slider
          value={selectedIndex}
          onChange={handleChange}
          steps={plans}
          labels={plans.map((plan) => plan.concurrency)}
        />
      </div>
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
  const dailyPrice = summary.plan.isEnterprise ? 0 : (summary.price / 30).toFixed(2);

  return (
    <div className="rounded-2xl bg-gray-50 py-6 px-6 ring-1 ring-inset ring-gray-900/5">
      <div className="max-w-xs">
        <p className="text-base font-semibold text-indigo-600">
          Actuated {summary.plan.name}
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
                  {summary.plan.concurrency} concurrent jobs
                </li>
                <li className="text-sm text-gray-600">Unmetered build minutes</li>
                <li className="text-sm text-gray-600">Add up to {summary.servers} VM host(s)</li>
                {summary.plan.orgLimit == 1 && <li className="text-sm text-gray-600">Single GitHub organization</li>}
                {summary.plan.orgLimit >1 && <li className="text-sm text-gray-600">GitHub organizations: {summary.plan.orgLimit}</li>}
                <li className="text-sm text-gray-600">Reports across organisation, repos, & users</li>
                <li className="text-sm text-gray-600">Debug jobs via SSH</li>
                <li className="text-sm text-gray-600">Expert support via Slack</li>
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
              <p className="mt-1 text-sm text-gray-500">${dailyPrice} USD / day</p>
            </>
          )}
          {summary.costPerMinute > 0 && !summary.plan.isEnterprise && (
            <p className="mt-2 text-xs text-gray-500">
              or <span className="font-bold">{summary.costPerMinute}</span> USD
              per minute for your current usage
            </p>
          )}
          <div className="mt-6">
            <a
              href="https://forms.gle/8XmpTTWXbZwWkfqT6"
              className="inline-block w-48 rounded-md bg-indigo-600 px-6 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

function Calculator({ onChange }) {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [jobs, setJobs] = useState(undefined);
  const [minutes, setMinutes] = useState(undefined);
  const [minutesTotal, setMinutesTotal] = useState(30000);

  const [summary, setSummary] = useState({
    plan: selectedPlan,
    orgLimit: 1,
    servers: 1,
    jobs: 100,
    minutes: 50,
    costPerMinute: 0,
    price: 5*50,
  });

  useEffect(() => {
    let costPerMinute = 0;

    if (jobs && jobs != 0 && minutes && minutes != 0 && !selectedPlan.isEnterprise) {
      costPerMinute = (selectedPlan.price / (jobs * minutes)).toFixed(3);
    }

    setSummary({
      orgLimit: selectedPlan.orgLimit,
      servers: selectedPlan.serverLimit,
      plan: selectedPlan,
      jobs: jobs,
      minutes: minutes,
      costPerMinute: costPerMinute,
      price: selectedPlan.price,
    });
  }, [selectedPlan, jobs, minutes]);

  useEffect(() => {
    let costPerMinute = 0;

    if (minutesTotal != 0 && !selectedPlan.isEnterprise) {
      costPerMinute = (selectedPlan.price / minutesTotal).toFixed(3);
    }

    setSummary({
      orgLimit: selectedPlan.orgLimit,
      servers: selectedPlan.serverLimit,
      plan: selectedPlan,
      jobs: jobs,
      minutes: minutes,
      costPerMinute: costPerMinute,
      price: selectedPlan.price,
    });

    onChange &&
      onChange({
        plan: selectedPlan,
        minutesTotal: minutesTotal,
        numJobs: jobs,
        avgJobMinutes: minutes,
      });
  }, [minutesTotal, selectedPlan]);

  useEffect(() => {
    if (minutes && minutes != 0 && jobs && jobs != 0) {
      setMinutesTotal(minutes * jobs);
    }
  }, [jobs, minutes]);

  return (
    <Card>
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="lg:max-w-xl">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">
            {selectedPlan.isEnterprise ? "Enterprise Plan" : "Pricing comparison"}
          </h3>
          <p className="mt-1 text-base leading-7 text-gray-600">
            {selectedPlan.isEnterprise 
              ? "Enterprise-grade security and scalability with custom pricing."
              : "Compare actuated pricing with GitHub Actions."
            }
          </p>
          <div className="mt-4 pb-2 border-b border-gray-100">
            <PlanSelection plans={plans} onSelect={setSelectedPlan} />
          </div>

          {!selectedPlan.isEnterprise && (
            <div className="mt-4 space-y-3">
              <div>
                <div className="max-w-xs">
                  <Input
                    id="minutes-total"
                    label="Build minutes per month"
                    trailingAddon="min"
                    value={minutesTotal}
                    onChange={setMinutesTotal}
                    disabled={jobs && minutes}
                  />
                </div>
              </div>

              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">or</span>
                </div>
              </div>

              <div>
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
              </div>
              <p className="text-sm text-gray-500 mt-4 pt-4 max-w-lg">
                Get a detailed report of your total usage with {" "}
                <a
                  href="https://github.com/self-actuated/actions-usage"
                  className="text-indigo-600 hover:text-indigo-500 underline decoration-1 hover:decoration-2"
                >
                  our free actions-usage tool
                </a>{" "}
                or view only paid minutes for {" "}
                <a
                  href="https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/viewing-github-actions-metrics-for-your-organization"
                  className="text-indigo-600 hover:text-indigo-500 underline decoration-1 hover:decoration-2"
                >
                  your organisation on GitHub
                </a>
              </p>
            </div>
          )}
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

function PriceCalculator() {
  const [runnerPricing, setRunnerPrices] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (data && data.minutesTotal != 0 && !data.plan.isEnterprise) {
      setRunnerPrices(
        calculateRunnerPricing(data.minutesTotal, data.plan.price)
      );
    } else {
      setRunnerPrices(null);
    }
  }, [data]);

  return (
    <div>
      <Calculator onChange={setData} />
      {runnerPricing && !data?.plan?.isEnterprise && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <PricingCard
              title="Self-hosted with actuated"
              borderStyle="highlight"
              prices={runnerPricing.map((price) => {
                return {
                  runnerSize: price.runnerSize,
                  costPerMinute: price.actuated.costPerMinute,
                  costPerMonth: price.actuated.costPerMonth,
                  highlight: price.actuated.highlight,
                };
              })}
              logo={<ActuatedLogo />}
            />
          </div>
          <div className="flex-1">
            <PricingCard
              title="GitHub Actions hosted runners"
              prices={runnerPricing.map((price) => {
                return {
                  runnerSize: price.runnerSize,
                  costPerMinute: price.github.costPerMinute,
                  costPerMonth: price.github.costPerMonth,
                };
              })}
              logo={<GitHubLogo />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceCalculator;
