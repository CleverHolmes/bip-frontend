import React from 'react';
import { Trans } from 'react-i18next';

interface Props {
  label: string;
}

const HeaderSplitPrimaryButton: React.FC<Props> = ({ label }) => {
  return (
    <div className="inline-block whitespace-pre-wrap">
      <Trans
        i18nKey={label}
        components={{
          primary: <span className="text-primary" />,
          secondary: <span className="text-button" />,
        }}
      />
    </div>
  );
};

export default HeaderSplitPrimaryButton;
