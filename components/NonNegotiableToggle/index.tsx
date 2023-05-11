import { useTranslation } from 'next-i18next';

const NonNegotiableToggle = ({
  onChange,
  toggleValue,
  toggleID,
  checked,
}: any) => {
  const { t } = useTranslation();
  return (
    <label className="inline-flex items-center mt-10 mr-5 cursor-pointer">
      <span className="mr-3 text-xs font-medium uppercase text-inputGray font-custom2 dark:text-gray-300">
        Non Negotiable Terms
      </span>
      <div className="relative">
        <input
          type="checkbox"
          value={toggleValue}
          id={toggleID}
          className="cursor-pointer sr-only peer"
          onChange={onChange}
          checked={checked}
        />
        <div className="w-9 h-5 bg-inputGray rounded-full peer peer-focus:ring-4 peer-focus:ring-button dark:peer-focus:ring-button dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-button"></div>
      </div>
    </label>
  );
};

export default NonNegotiableToggle;
