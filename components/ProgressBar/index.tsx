interface Props {
  progress: string;
  className: string;
}

const ProgressBar: React.FC<Props> = ({ progress, className }) => {
  return (
    <div
      className={
        'w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ' + className
      }
    >
      <div
        className="bg-gradient-to-r from-gradientProgress1 to-gradientProgress2 h-2.5 rounded-full"
        style={{ width: progress }}
      ></div>
    </div>
  );
};

export default ProgressBar;
