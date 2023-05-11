import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import BubbleListAndInput from 'components/BubbleLists/BubbleListAndInput';
import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import NonNegotiableToggle from 'components/NonNegotiableToggle';
import { channelsOfDist, channelsOfDistValue } from 'public/helpers/data';
import { patchItem } from 'api/item/patchItem';

interface Props {
  defaultValue: string[];
  defaultValueToggle: string[];
  refreshProperties: () => void;
  uuid: string;
}

const PropertyChannels: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
  defaultValueToggle,
}) => {
  const { t } = useTranslation();
  const copy = _.cloneDeep(defaultValue);

  const { register, getValues, setValue } = useForm();

  const [state, setState] = useState<{ selections: string[] }>({
    selections: copy || [],
  });
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
    let item = getValues('distribution_channels');
    let sel = state.selections;
    if (!sel.includes(item) && item) {
      sel.push(item);
    }

    setIsDisabled(true);
    const user = {
      distribution_channels: state.selections,
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
      <BubbleListAndInput
        checkList={channelsOfDist}
        checkList2={channelsOfDistValue}
        label="onboarding.choose-channels-of-distribution"
        bubbleName="distribution_channels"
        state={state}
        setState={setState}
        defaultValue={[]}
        smaller
        register={register}
        getValues={getValues}
        setValue={setValue}
      />
      <NonNegotiableToggle
        onChange={() => handleToggle('distribution_channels')}
        toggleValue="distribution_channels"
        toggleID="distribution_channels"
        checked={nonNegotionableTerms.includes('distribution_channels')}
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

export default PropertyChannels;
