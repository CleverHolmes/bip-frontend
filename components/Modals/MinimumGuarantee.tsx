import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import InputDoubleNoRegister from 'components/InputDoubleNoRegister';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import NonNegotiableToggle from 'components/NonNegotiableToggle';
import { patchItem } from 'api/item/patchItem';

interface Props {
  defaultValue1: number;
  defaultValue2: number;
  defaultValueToggle: string[];
  refreshProperties: () => void;
  uuid: string;
  displayToggle: boolean;
}

const MinimumGuarantee: React.FC<Props> = ({
  defaultValue1,
  defaultValue2,
  refreshProperties,
  uuid,
  defaultValueToggle,
  displayToggle,
}) => {
  const { t } = useTranslation();
  const copy1 = _.cloneDeep(defaultValue1);
  const copy2 = _.cloneDeep(defaultValue2);

  const [minimumGuaranteeAmount, setMinimumGuaranteeAmount] = useState(
    copy1.toString()
  );
  const [minimumGuaranteePercent, setMinimumGuaranteePercent] = useState(
    copy2.toString()
  );
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
      minimum_guarantee_percent: minimumGuaranteePercent
        ? parseFloat(minimumGuaranteePercent.replace(/,/g, ''))
        : undefined,
      minimum_guarantee_amount: minimumGuaranteeAmount
        ? parseFloat(minimumGuaranteeAmount.replace(/,/g, ''))
        : undefined,
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
      <InputDoubleNoRegister
        name="property_minimum_guarantee"
        onChange1={(event: any) =>
          setMinimumGuaranteePercent(event.target.value)
        }
        onChange2={(event: any) =>
          setMinimumGuaranteeAmount(event.target.value)
        }
        defaultValue1={copy1}
        defaultValue2={copy2}
        placeholder={t('onboarding.set-minimum')}
        label="add-product.minimum-guarantee"
        label1="%"
        label2="$"
        type="number"
        smaller
      />
      {displayToggle && (
        <NonNegotiableToggle
          onChange={() => handleToggle('minimum_guarantee')}
          toggleValue="minimum_guarantee"
          toggleID="minimum_guarantee"
          checked={nonNegotionableTerms.includes('minimum_guarantee')}
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

export default MinimumGuarantee;
