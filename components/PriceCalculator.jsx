import { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

function Card({ children }) {
  return (
    <div className="mx-auto mt-4 max-w-2xl rounded-xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
      <div className="px-8 sm:px-10 py-8 lg:flex-auto">{children}</div>
    </div>
  );
}

const runnerPrices = [
  {
    runnerSize: "2-core",
    costPerMinute: "$0.008",
    costPerMonth: "$240",
  },
  {
    runnerSize: "4-core",
    costPerMinute: "$0.008",
    costPerMonth: "$240",
  },
  {
    runnerSize: "8-core",
    costPerMinute: "$0.008",
    costPerMonth: "$240",
  },
  {
    runnerSize: "16-core",
    costPerMinute: "$0.008",
    costPerMonth: "$240",
  },
  {
    runnerSize: "32-core",
    costPerMinute: "$0.008",
    costPerMonth: "$240",
  },
];

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
              ${price.costPerMinute}
            </td>
            <td className="py-2 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
              ${price.costPerMonth}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Input({ name, label, value, onChange, leadingAddon, trailingAddon }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white px-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
          {leadingAddon && (
            <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
              {leadingAddon}
            </div>
          )}
          <input
            id={name}
            name={name}
            value={value}
            type="text"
            placeholder="0.00"
            aria-describedby={leadingAddon ? `${name}-addon` : undefined}
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
            onChange={(e) => onChange(e.target.value)}
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
  { name: "Basic", concurrency: "5x", price: 500 },
  { name: "Pro", concurrency: "10x", price: 1000 },
  { name: "Pro Plus", concurrency: "15x", price: 1500 },
];

function PlanSelection({ plans, onSelectPlan }) {
  return (
    <fieldset>
      <legend className="text-sm/6 font-semibold text-gray-900">
        Select an Actuated plan
      </legend>
      {/* <p className="mt-1 text-sm/6 text-gray-600">
        Actuated plans are billed at a fixed monthly price.
      </p> */}
      <div className="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
        {plans.map((plan) => (
          <div key={plan.name} className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                defaultChecked={plan.name === "Basic"}
                id={plan.name}
                name="plan"
                type="radio"
                aria-describedby={`${plan.name}-description`}
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                onChange={onSelectPlan && (() => onSelectPlan(plan))}
              />
            </div>
            <div className="ml-3 text-sm/6">
              <label htmlFor={plan.name} className="font-medium text-gray-900">
                {plan.name}
              </label>
              <p id={`${plan.name}-description`} className="text-gray-500">
                {plan.concurrency} concurrency
              </p>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function PricingSummary({summary}) {
  return (
    <div className="rounded-2xl bg-gray-50 py-6 px-6 ring-1 ring-inset ring-gray-900/5">
      <div className="max-w-xs">
        <p className="text-base font-semibold text-indigo-600">
          Actuated {summary.plan}
        </p>
        {summary.jobs > 0 && summary.minutes > 0 && <div className="mt-4">
          <p className="mb-2 text-sm text-gray-600">
            <span className="font-bold">{summary.jobs}</span> jobs/month of <span className="font-bold">{summary.minutes}</span> minutes
          </p>
          <p className="text-sm text-gray-600">
            <span>{summary.costPerMinute}</span> USD per minute
          </p>
        </div>
        }
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-900">Total</p>
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
          <p className="mt-2 text-xs text-gray-500">
            Unlimited minutes included in fixed monthly price
          </p>
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
]

function calculateGitHubRunnerPrices(jobs, minutes) {
  return githuActionPrices.map((price) => {
    return {
      runnerSize: price.name,
      costPerMinute: price.costPerMinute.toFixed(3),
      costPerMonth: (price.costPerMinute * jobs * minutes).toFixed(0)
    }
  })
}

function calculateActuatedRunnerPrices(jobs, minutes, planPrice) {
  const totalMinutes = jobs * minutes;
  const costPerMinute = planPrice / totalMinutes;

  return githuActionPrices.map((price) => {
    return {
      runnerSize: price.name,
      costPerMinute: costPerMinute.toFixed(3),
      costPerMonth: planPrice.toFixed(0)
    }
  })
}

function Calculator({ onMinutesChange, onJobsChange, onPlanChange }) {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [jobs, setJobs] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const [summary, setSummary] = useState({
    plan: "Actuated Basic Plan",
    jobs: 100,
    minutes: 50,
    costPerMinute: 0,
    price: 500,
  });

  useEffect(() => {
    let costPerMinute = 0;
    if (jobs != 0 && minutes != 0) {
      costPerMinute = (selectedPlan.price / (jobs * minutes)).toFixed(3);  
    }

    setSummary({
      plan: selectedPlan.name,
      jobs: jobs,
      minutes: minutes,
      costPerMinute: costPerMinute,
      price: selectedPlan.price,
    })
  }, [selectedPlan, jobs, minutes])

  useEffect(() => {
    onMinutesChange && onMinutesChange(minutes);
  }, [minutes])

  useEffect(() => {
    onJobsChange && onJobsChange(jobs);
  }, [jobs])

  useEffect(() => {
    onPlanChange && onPlanChange(selectedPlan);
  }, [selectedPlan])

  return (
    <Card>
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">
            Pricing calculator
          </h3>
          <p className="mt-2 text-base leading-7 text-gray-600">
            Calculate the per minute cost for your usage.
          </p>
          <div className="mt-4 border-b border-gray-100">
            <PlanSelection plans={plans} onSelectPlan={setSelectedPlan} />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Input id="job-num" label="Number of jobs" trailingAddon="/month" value={jobs} onChange={setJobs} />
            <Input
              id="job-duration"
              label="Average job duration"
              trailingAddon="min"
              value={minutes}
              onChange={setMinutes}
            />
          </div>
        </div>
        <div className="mt-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 flex-1">
          <PricingSummary summary={summary} />
        </div>
      </div>
    </Card>
  );
}

function PricingCard({ title, prices }) {
  return (
    <Card>
      <h3 className="text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h3>
      <PricingTable prices={prices} />
    </Card>
  );
}

function PriceCalculator() {
  const [githubRunnerPrices, setGitHubRunnerPrices] = useState(null);
  const [actuatedRunnerPrices, setActuatedRunnerPrices] = useState(null);
  const [jobs, setJobs] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  useEffect(() => {
    if (jobs != 0 && minutes != 0) {
      setGitHubRunnerPrices(calculateGitHubRunnerPrices(jobs, minutes));
      setActuatedRunnerPrices(calculateActuatedRunnerPrices(jobs, minutes, selectedPlan.price));
    }
  }, [jobs, minutes, selectedPlan]);

  return (
    <div>
      <Calculator onJobsChange={setJobs} onMinutesChange={setMinutes} onPlanChange={setSelectedPlan} />
      {githubRunnerPrices && actuatedRunnerPrices && <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <PricingCard
            title="GitHub Actions hosted runners"
            prices={githubRunnerPrices}
          />
        </div>
        <div className="flex-1">
          <PricingCard
            title="Self-hosted with actuated"
            prices={actuatedRunnerPrices}
          />
        </div>
      </div>
      }
    </div>
  );
}

export default PriceCalculator;
