import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import CheckBoxes from 'components/CheckBoxesWithOther';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { paymentNotificationsFrequency } from 'public/helpers/data';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  defaultValue: any;
  refreshUser: () => void;
}

const PaymentReminderDays: React.FC<Props> = ({
  defaultValue,
  refreshUser,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const copy = _.cloneDeep(defaultValue);
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [stateCheckBox, setStateCheckBox] = useState<{
    selections: number[];
  }>({
    selections: copy,
  });

  function handleCheckboxChange(key: number) {
    let sel = stateCheckBox.selections;
    let find = sel.indexOf(key);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(key);
    }

    setStateCheckBox({
      selections: sel,
    });
  }

  const patch = () => {
    setIsDisabled(true);
    const user: any = {
      payment_reminder_days_ahead: stateCheckBox.selections,
      user_uuid: companyRepresented ? companyRepresented : userUUID,
    };

    return patchUser(user)
      .then((res) => {
        if (refreshUser) {
          refreshUser();
        }
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
      <CheckBoxes
        selections={stateCheckBox.selections}
        checkList={paymentNotificationsFrequency}
        onChange={handleCheckboxChange}
        label="payment-reminder-days"
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

export default PaymentReminderDays;
