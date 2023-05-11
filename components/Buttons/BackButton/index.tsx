import { useTranslation } from 'next-i18next';

import Icon from 'components/Icon';

interface Props {
  onClick?: () => void;
}

const BackButton: React.FC<Props> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-8 py-3 mr-5 text-lg bg-white rounded-full cursor-pointer drop-shadow-md font-custom2 text-primary hover:text-button"
    >
      <Icon name="Back" className="mt-1 mr-2 fill-primary hover:fill-button" />
      {t('back')}
    </button>
  );
};

export default BackButton;
