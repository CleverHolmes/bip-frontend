type SlideControlProperties = {
  classNames?: string;
  children?: React.ReactNode;
  title?: React.ReactNode;
  button?: React.ReactNode;
  rightSide?: React.ReactNode;
};

const Slide: React.FC<SlideControlProperties> = ({
  classNames,
  children,
  rightSide,
}) => {
  const commonClasses = 'w-full relative h-full ';

  return (
    <div className={commonClasses + classNames}>
      {children}
      {rightSide && rightSide}
    </div>
  );
};

export default Slide;
