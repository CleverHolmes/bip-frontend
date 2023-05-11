import Icon from 'components/Icon';

const InfoRow = ({
  title,
  description,
  locked,
}: {
  title: string;
  description: string;
  locked?: boolean;
}) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center justify-start w-40 text-xs uppercase sm:w-64 lg:w-40 text-inputGray font-custom1">
        {title}
        {locked && (
          <Icon
            name="Lock"
            className="ml-1 fill-button"
            viewBox="0 0 18 18"
            size="14"
          />
        )}
      </div>
      <div className="pl-4 text-base font-bold text-right break-words text-primary font-custom1">
        {description}
      </div>
    </div>
  );
};

export default InfoRow;
