import Image from 'next/image';
import React, { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

Transition.displayName = 'Transition';

const callAll =
  (...fns: any) =>
  (...args: any) =>
    fns.forEach((fn: any) => fn && fn(...args));

type ModalContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface WithChildren {
  children: React.ReactElement;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

function Modal(props: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(false);

  return <ModalContext.Provider value={{ isOpen, setIsOpen }} {...props} />;
}

export function useModalContext(): ModalContextType {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error('useModalContext must be used within <Modal />');
  }
  return context;
}

const ModalDismissButton = ({ children: child }: WithChildren) => {
  const { setIsOpen } = useModalContext();

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props?.onClick),
  });
};

export function ModalDismissAsyncButton({ children: child }: WithChildren) {
  const { setIsOpen } = useModalContext();
  return React.cloneElement(child, {
    onClick: callAll(() =>
      child.props
        .onClick()
        .then(
          (res: any) =>
            res &&
            (res.status === 201 || res.status === 200 || res === 201
              ? setIsOpen(false)
              : null)
        )
    ),
  });
}

function ModalOpenButton({ children: child }: WithChildren) {
  const { setIsOpen } = useModalContext();

  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props?.onClick),
  });
}

function ModalContentsBase(props: any) {
  const { isOpen, setIsOpen } = useModalContext();
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      onClose={() => setIsOpen(false)}
      {...props}
      style={{ minWidth: '90%', maxWidth: '100%' }}
    >
      {props.children}
    </Dialog>
  );
}

interface Props {
  children?: ReactNode;
  // any props that come into the component
  modalNoPadding?: boolean;
  pencil?: boolean;
}

function ModalContents({ children, modalNoPadding, pencil, ...props }: Props) {
  return (
    <ModalContentsBase {...props}>
      <div
        className={
          modalNoPadding
            ? 'pt-16'
            : 'z-50 px-5 pb-6 sm:px-10 sm:pb-8 md:px-16 md:pb-16 pt-80'
        }
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ModalDismissButton>
            <i
              style={{
                position: 'absolute',
                top: '10px',
                right: '20px',
                cursor: 'pointer',
                fontWeight: 300,
                fontFamily: 'sans-serif',
                fontStyle: 'normal',
                color: '#7C8B9E',
                zIndex: 100,
              }}
              className="text-[#7C8B9E] hover:text-button text-3xl lg:text-5xl"
            >
              x
            </i>
          </ModalDismissButton>
        </div>
        <div className="invisible lg:visible absolute top-[-200px] left-0 z-0 w-full h-full">
          <Image
            src="/images/Modal/Background.svg"
            alt="modal-colors"
            width={829}
            layout="fill"
          />
        </div>
        {pencil && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[50px] mx-auto z-0 w-40 h-40">
            <Image
              src="/images/Modal/Pencil.svg"
              alt="pencil"
              width={165}
              layout="fill"
            />
          </div>
        )}
        <div style={{ zIndex: 10, position: 'relative' }}>{children}</div>
      </div>
    </ModalContentsBase>
  );
}

export { Modal, ModalDismissButton, ModalOpenButton, ModalContents };
