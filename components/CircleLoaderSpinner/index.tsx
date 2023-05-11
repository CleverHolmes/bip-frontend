import CircleLoader from 'react-spinners/CircleLoader';

interface Props {
  className?: string;
  size: number;
}

const CircleLoaderSpinner: React.FC<Props> = ({ className, size }) => {
  const spinnerSizeSmaller = size > 300 ? size / 3 : size / 2;
  return (
    <div className={'grid h-max place-items-center ' + className}>
      <div className="hidden md:flex">
        <CircleLoader color="rgba(74,167,202,1)" loading size={size} />
      </div>
      <div className="flex md:hidden">
        <CircleLoader
          color="rgba(74,167,202,1)"
          loading
          size={spinnerSizeSmaller}
        />
      </div>
    </div>
  );
};

export default CircleLoaderSpinner;
