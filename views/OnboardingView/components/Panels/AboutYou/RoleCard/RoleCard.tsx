import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import resolveConfig from 'tailwindcss/resolveConfig';

import Icon from 'components/new/Icon';
import { IconNames } from 'components/new/Icon/icons';
import Radio from 'components/new/Radio';
import { UserRoles } from 'models/user/user';
import type { AboutYouFormProperties } from '../AboutYou';
import tailwindConfig from 'tailwind.config';
import Card from 'components/new/Card';

type RoleCardProperties = {
  role: UserRoles;
  iconName: IconNames;
  label: string;
};

const fullConfig = resolveConfig(tailwindConfig);

const RoleCard: React.FC<RoleCardProperties> = ({ iconName, label, role }) => {
  const words = label.split(' ');
  const { control, setValue, getValues, watch } =
    useFormContext<AboutYouFormProperties>();

  const roles = watch('roles');
  const selected = roles.includes(role);

  const isAgencyDisabled = roles.some(
    (r) => r === UserRoles.LICENSEE || r === UserRoles.LICENSOR
  );
  const isLicensorOrLicenseeDisabled = roles.includes(UserRoles.AGENCY);

  const handleClick = () => {
    if (role === UserRoles.AGENCY && isAgencyDisabled) {
      return;
    }

    if (
      [UserRoles.LICENSEE, UserRoles.LICENSOR].includes(role) &&
      isLicensorOrLicenseeDisabled
    ) {
      return;
    }

    const includesRole = roles.includes(role);

    if (includesRole) {
      setValue(
        'roles',
        roles.filter((r) => r !== role)
      );
    } else {
      setValue('roles', [...roles, role]);
    }
  };

  const backgroundColor = () => {
    if (role === UserRoles.AGENCY && isAgencyDisabled) {
      return fullConfig.theme.colors.grayN25;
    } else if (
      (role === UserRoles.LICENSEE || role === UserRoles.LICENSOR) &&
      isLicensorOrLicenseeDisabled
    ) {
      return fullConfig.theme.colors.grayN25;
    }
    return fullConfig.theme.colors.white;
  };

  return (
    <Card
      style={{ backgroundColor: backgroundColor() }}
      className={`p-6 cursor-pointer min-w-[18.75rem] md:min-w-[12rem] relative sm:w-full md:w-auto transition-all duration-100 ${
        selected ? '!shadow-[0px_0px_0px_2px] !shadow-blueN300' : ''
      }`}
      onClick={handleClick}
      selectNone
    >
      <Controller
        name="roles"
        control={control}
        render={({ field }) => (
          <Radio
            selected={field.value.includes(role)}
            className="absolute top-12 left-12"
          />
        )}
      />

      <div className="flex flex-row justify-center mb-5">
        <Icon name={iconName} size="lg" />
      </div>

      <p className="text-center font-bodyText">
        {words.slice(0, words.length - 1).join(' ')}{' '}
        <span className="md:block font-bold text-center">
          {words.slice(-1)[0]}
        </span>
      </p>
    </Card>
  );
};

export default RoleCard;
