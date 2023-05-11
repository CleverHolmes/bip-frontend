import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import NonNegotiableToggle from 'components/NonNegotiableToggle';
import SliderInput from 'components/SliderInput';
import { step20marks } from 'public/helpers/data';
import { patchItem } from 'api/item/patchItem';

interface Props {
  defaultValue: number;
  defaultValueToggle: string[];
  refreshProperties: () => void;
  uuid: string;
  displayToggle: boolean;
}

const Royalty: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
  defaultValueToggle,
  displayToggle,
}) => {
  const { t } = useTranslation();
  const copy = _.cloneDeep(defaultValue);

  const [state, setState] = useState<number>(copy);
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
    const user = {
      royalty_percent: state,
      uuid,
      non_negotiable_terms: nonNegotionableTerms,
    };

    return patchItem(user)
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
      <SliderInput
        marks={step20marks}
        label="add-product.set-royalty-percent"
        sliderValue={state}
        setSliderValue={setState}
        storeProperty="royalty_percent"
        smaller
      />
      {displayToggle && (
        <NonNegotiableToggle
          onChange={() => handleToggle('royalty_percent')}
          toggleValue="royalty_percent"
          toggleID="royalty_percent"
          checked={nonNegotionableTerms.includes('royalty_percent')}
        />
      )}
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

export default Royalty;
