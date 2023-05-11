import React, { FC } from 'react';
import Image from 'next/image';

import { CheckIcon } from 'components/Icon/CheckIcon';
import UncheckCircleIcon from 'components/Icon/Icons/uncheck-cirlce.svg';

type Props = {
  type?: 'error' | 'success';
  message: string;
};

const Toast: FC<Props> = ({ type = 'success', message }) => {
  const isError = type === 'error';
  const isSuccess = type === 'success';
  return (
    <div className="flex items-center py-2">
      {isSuccess && <CheckIcon className="w-6 h-6" />}
      {isError && <Image alt="Error" src={UncheckCircleIcon} />}
      <div className="w-full ml-4">{message}</div>
    </div>
  );
};

export default Toast;
