import { InRangeEnum } from '../types';

const options = [
  {
    value: InRangeEnum.All,
    label: 'All',
    desc: 'Show every result',
  },
  {
    value: InRangeEnum.In,
    label: 'In Range',
    desc: 'All hormone values are within target range.',
  },
  {
    value: InRangeEnum.Out,
    label: 'Out of range',
    desc: 'One or more hormones outside target range.',
  },
];

export default function Filters({
  selected,
  onChange,
}: {
  selected: InRangeEnum;
  onChange: (value: InRangeEnum) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm text-left font-semibold text-gray-900">Filter by status</legend>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 cursor-pointer">
        {options.map((option) => (
          <label
            key={option.value}
            aria-label={option.label}
            className="group relative flex cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-sm has-checked:border-indigo-700 has-checked:bg-indigo-100 has-checked:shadow-sm has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-indigo-600"
          >
            <input
              value={option.value}
              checked={selected === option.value}
              onChange={(e) => {
                onChange(e.target.value as InRangeEnum);
              }}
              name="options"
              type="radio"
              className="absolute inset-0 cursor-pointer appearance-none focus:outline-none"
            />
            <div className="flex-1">
              <span className="block cursor-pointer text-sm font-medium text-gray-900">
                {option.label}
              </span>
              <span className="mt-0.5 block cursor-pointer text-xs text-gray-500">
                {option.desc}
              </span>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
