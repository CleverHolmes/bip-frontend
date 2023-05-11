import Icon from 'components/Icon';

interface Props {
  onClick?: () => void;
}

const ForwardButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center p-3 mb-2 rounded-full cursor-pointer bg-button md:p-5 ring-buttonOpactiy ring-4"
    >
      <Icon
        name="ForwardIcon"
        className="mt-1 ml-1 fill-white"
        viewBox="0 0 24 24"
        size="24"
      />
    </button>
  );
};

export default ForwardButton;
