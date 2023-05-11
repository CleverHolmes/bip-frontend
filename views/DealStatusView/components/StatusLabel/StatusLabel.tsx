type StatusLabelProps = {
  status: string;
  className?: string;
};
const StatusLabel = ({ status, className }: StatusLabelProps) => {
  const statusClasses = () => {
    switch (status?.toLocaleLowerCase()) {
      case 'in progress':
        return 'bg-blueN75';
      case 'accepted':
        return 'bg-greenN75';
      case 'rejected':
        return 'bg-redN75';
      case 'proposed':
        return 'bg-accentN300';
      case 'draft':
        return 'bg-grayN75';
      default:
        return 'bg-redN75';
    }
  };

  return (
    <span
      className={`${
        className || ''
      } ${statusClasses()} text-sm font-bold text-white capitalize px-8 py-4 rounded whitespace-nowrap`}
    >
      {status}
    </span>
  );
};
export default StatusLabel;
