import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import InputDate from 'components/InputDate';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import NonNegotiableToggle from 'components/NonNegotiableToggle';
import { patchItem } from 'api/item/patchItem';

interface Props {
  defaultValue: Date;
  defaultValueToggle: string[];
  refreshProperties: () => void;
  uuid: string;
}

const OfferDeadline: React.FC<Props> = ({
  defaultValue,
  defaultValueToggle,
  refreshProperties,
  uuid,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState<Date>(new Date(defaultValue));
  const [error, setError] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const copyNonNeg = _.cloneDeep(defaultValueToggle);

  const [nonNegotionableTerms, setNonNegotionableTerms] =
    useState<string[]>(copyNonNeg);

  const handleToggle = (item: string) => {
    if (nonNegotionableTerms.includes(item)) {
      setNonNegotionableTerms(nonNegotionableTerms.filter((i) => item !== i));
    } else {
      setNonNegotionableTerms([...nonNegotionableTerms, item]);
    }
  };

  const patch = () => {
    setIsDisabled(true);
    const item = {
      offer_deadline: state,
      uuid,
      non_negotiable_terms: nonNegotionableTerms,
    };

    return patchItem(item)
      .then((res) => {
        refreshProperties();
        setIsDisabled(false);
        return res;
      })
      .catch((err) => {
        setIsDisabled(false);
        setError(JSON.parse(err.request.response).message);
      });
  };

  return (
    <>
      {state && (
        <InputDate
          label="add-product.expiration-date"
          name="offerDeadline"
          startDate={state}
          setStartDate={setState}
        />
      )}
      <NonNegotiableToggle
        onChange={() => handleToggle('offer_deadline')}
        toggleValue="offer_deadline"
        toggleID="offer_deadline"
        checked={nonNegotionableTerms.includes('offer_deadline')}
      />
      <div className="h-4 mt-2 ml-4 text-sm text-red-400 font-custom2">
        {error && error}
      </div>
      <div className="flex items-center justify-center my-10">
        <ModalDismissAsyncButton>
          <Button disabled={isDisabled} onClick={patch}>
            {t('submit')}
          </Button>
        </ModalDismissAsyncButton>
      </div>
    </>
  );
};

export default OfferDeadline;
