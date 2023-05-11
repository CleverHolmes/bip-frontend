import { useTranslation } from 'next-i18next';
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Button from 'components/Buttons/Button';
import Input from 'components/Input';
import validations from 'utils/validations';
import { createAuthorizedUser } from 'api/user/createAuthorizedUser';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  setRefreshAuthorizedUsers: (refresh: boolean) => void;
}

type FormType = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
};

const ConfirmAgreement: React.FC<Props> = ({
  isOpen,
  closeModal,
  setRefreshAuthorizedUsers,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const validationSchema = Yup.object().shape({
    firstName: validations.firstName,
    lastName: validations.lastName,
    email: validations.email,
    confirmEmail: validations.confirmEmail,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const isValid = !Object.keys(errors).length;

  const onSubmit = async (data: FormType) => {
    setIsSubmitting(true);

    try {
      await createAuthorizedUser({
        nameFirst: data.firstName,
        nameLast: data.lastName,
        email: data.email,
      });
      setIsSubmitting(false);
      setRefreshAuthorizedUsers(true);
      closeModal();
    } finally {
      setIsSubmitting(false);
      reset({
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
      });
    }
  };

  const handleClose = () => {
    closeModal();
    if (isSent) {
      setIsSent(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 max-w-5xl mx-auto overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full max-w-full max-h-full px-6 pt-20 pb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl lg:p-20 rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-3xl md:text-5xl font-bold font-custom1 text-primary`"
                >
                  {t('settings.add-authorized-users')}
                </Dialog.Title>
                {!isSubmitting && !isSent && (
                  <div>
                    <div className="pb-5 mt-10 mb-16">
                      <div className="mb-8">
                        <div className="mt-10 mb-2">
                          <Input
                            type="text"
                            register={register}
                            label="whats-users-name"
                            name="firstName"
                            placeholder={t('settings.enter-users-first-name')}
                            required={true}
                            smaller={true}
                            errorText={t(errors.firstName?.message || '')}
                          />
                        </div>
                        <Input
                          type="text"
                          register={register}
                          name="lastName"
                          placeholder={t('settings.enter-users-last-name')}
                          required={true}
                          smaller={true}
                          errorText={t(errors.lastName?.message || '')}
                        />
                      </div>
                      <div className="mb-8">
                        <Input
                          type="email"
                          register={register}
                          label="whats-users-email"
                          name="email"
                          placeholder={t('settings.enter-signer-email')}
                          required={true}
                          smaller={true}
                          errorText={t(errors.email?.message || '')}
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          register={register}
                          label="confirm-users-email"
                          name="confirmEmail"
                          placeholder={t('settings.enter-signer-email')}
                          required={true}
                          smaller={true}
                          disablePaste={true}
                          errorText={t(errors.confirmEmail?.message || '')}
                        />
                      </div>
                    </div>

                    <div
                      className={
                        '!z-50 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]'
                      }
                    >
                      <div className="flex items-center justify-end px-4 pt-5 pb-5 sm:px-10 lg:container lg:mx-auto">
                        <Button
                          onClick={() => handleSubmit(onSubmit)()}
                          disabled={!isValid}
                          className="my-2 mr-2"
                        >
                          {t('confirm-and-send-button')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {isSent && (
                  <div className="flex flex-col items-center">
                    <div className="px-4 py-2 mt-20 mb-10 mr-5 text-lg text-primary font-custom1">
                      {t('deal.you-have-successfully-confirm-the-agreement')}
                    </div>
                    <Button onClick={handleClose} className="text-center">
                      {t('close')}
                    </Button>
                  </div>
                )}
                {isSubmitting && (
                  <CircleLoaderSpinner size={250} className="mt-10" />
                )}
                <i
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '20px',
                    cursor: 'pointer',
                    fontWeight: 300,
                    fontFamily: 'sans-serif',
                    fontStyle: 'normal',
                    zIndex: 100,
                  }}
                  onClick={handleClose}
                  className="text-[#7C8B9E] hover:text-button text-3xl lg:text-5xl"
                >
                  x
                </i>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmAgreement;
