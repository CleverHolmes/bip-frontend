import { useTranslation } from 'next-i18next';

import IconButton from 'components/new/IconButton';
import InputField from 'components/new/InputField';
import type { InputFieldProps } from 'components/new/InputField/InputField';

type SearchBarProps = {
  openSearch: boolean;
  setOpenSearch: (arg: boolean) => void;
  searchQuery?: string;
  setSearchQuery: (arg: string) => void;
};

const SearchBar = ({
  openSearch,
  setOpenSearch,
  searchQuery,
  setSearchQuery,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const OnChange: InputFieldProps['onChange'] = (e) =>
    setSearchQuery(e.target.value);

  return (
    <>
      {!openSearch && (
        <IconButton
          className="ml-24"
          size="md"
          iconName="Search"
          onClick={() => setOpenSearch(true)}
        />
      )}
      {openSearch && (
        <InputField
          label={t('deal-status.search-a-deal')}
          leftIcon="Search"
          className="mt-16 sm:mt-0 sm:ml-24 text-grayN100 w-full w-full md:w-[20rem]"
          helperText=""
          rightIcon="Close"
          fullWidth
          value={searchQuery}
          onChange={OnChange}
          rightIconClick={() => {
            setSearchQuery('');
            setOpenSearch(false);
          }}
        />
      )}
    </>
  );
};
export default SearchBar;
