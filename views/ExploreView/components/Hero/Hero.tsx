type HeroProperties = {
  children: React.ReactNode;
  isFullPage?: boolean;
};

const Hero: React.FC<HeroProperties> = ({ children, isFullPage = false }) => {
  const commonClasses =
    'flex flex-col mx-auto md:px-24 ' +
    (isFullPage ? ' max-w-full ' : ' max-w-screen-xl ');
  return (
    <div className={commonClasses}>
      <main className="flex-1 w-full container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Hero;
