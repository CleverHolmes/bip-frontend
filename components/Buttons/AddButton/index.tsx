import Icon from 'components/Icon';

interface Props {
  onClick?: () => void;
}

const AddButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center p-2 mb-2 rounded-full cursor-pointer bg-button md:p-5 ring-buttonOpactiy ring-4"
    >
      <Icon
        name="Plus"
        className="mt-1 ml-1 fill-white"
        viewBox="0 0 20 20"
        size="24"
      />
    </button>
  );
};

export default AddButton;
