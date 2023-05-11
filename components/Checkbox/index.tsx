import Link from 'next/link';
import { FieldValues } from 'react-hook-form/dist/types/fields';
import { UseFormRegister } from 'react-hook-form/dist/types/form';

interface InputProps {
  name: string;
  label?: string;
  label2?: string;
  register: any;
  required?: boolean;
  link?: string;
}

const Checkbox: React.FC<InputProps> = ({
  name,
  label,
  label2,
  register,
  required,
  link,
  ...rest
}) => {
  return (
    <div className="relative flex font-bold font-custom1">
      {label && (
        <label
          htmlFor={name}
          className="block mr-4 text-lg md:text-xl lg:text-2xl"
        >
          <span className="text-primary">{label}</span>
          {!!link && (
            <Link href={link}>
              <a target="_blank">
                <span className="underline cursor-pointer underline-offset-8 hover:text-button">
                  {label2}
                </span>
              </a>
            </Link>
          )}
        </label>
      )}
      <input
        {...(register && register(name, required))}
        type="checkbox"
        name={name}
        id={name}
        className="w-8 h-8 border cursor-pointer border-inputGray accent-button hover:bg-inputGray"
      />
    </div>
  );
};

export default Checkbox;
