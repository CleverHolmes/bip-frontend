import React, { useRef } from 'react';
import Image from 'next/image';
import { DragSourceMonitor, useDrag } from 'react-dnd';

import SignTabImg from 'public/images/sign-tab.png';
import { ITEM_TYPE } from '../constants';
import { SignTabEnum } from 'models/contract/saveContractTabData';
import customImageLoader from 'utils/image-loader';

export type DragObject = {
  name: SignTabEnum;
  type: string;
};

type Props = {
  name: SignTabEnum;
  signerName?: string;
  index?: number;
  draggable?: boolean;
  removable?: boolean;
  onRemove?: (index: number) => void;
};

const SignTab: React.FC<Props> = ({
  name,
  signerName,
  index,
  draggable = true,
  removable = false,
  onRemove,
}) => {
  const wrapper = useRef(null);
  const width = 80;
  const height = 77;
  const finalSignerName =
    signerName || (name === SignTabEnum.PARTY ? 'Party' : 'Counterparty');

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { name, type: ITEM_TYPE },
      canDrag: () => draggable,
      collect: (monitor: DragSourceMonitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    []
  );

  return (
    <div
      ref={wrapper}
      style={{ width, height, opacity: isDragging ? 0.4 : 1 }}
      className="relative cursor-pointer mb-5 z-20 bg-[#ffcc4e] rounded font-bold bg-opacity-80"
    >
      <div ref={drag} className="relative h-full">
        {removable && onRemove && (
          <span
            className="absolute top-0 z-10 text-xs right-1"
            onClick={() => onRemove(index || 0)}
          >
            X
          </span>
        )}
        <div
          className={`flex flex-col h-full justify-between items-center pb-1.5`}
        >
          <div className="p-2 pb-0 text-xs text-center line-clamp-2">
            {finalSignerName}
          </div>
          <Image
            loader={customImageLoader}
            width={39}
            height={36}
            alt={finalSignerName}
            src={SignTabImg}
            layout="fixed"
            objectFit="cover"
            objectPosition="center"
          />
        </div>
      </div>
    </div>
  );
};

export default SignTab;
