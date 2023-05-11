import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

import {
  ITEM_TYPE,
  REACT_PDF_PPI,
  DOCUSIGN_TAB_HEIGHT,
  ARROW_MARGIN_BOTTOM,
} from '../constants';
import SignTab, { DragObject } from './SignTab';
import {
  ContractTabDataItem,
  SignTabEnum,
} from 'models/contract/saveContractTabData';

type Props = {
  tabs: ContractTabDataItem[];
  partySignerName?: string;
  counterpartySignerName?: string;
  onDrop: (position: ContractTabDataItem) => void;
  onRemoveTab?: (index: number) => void;
};

const DropArea: React.FC<Props> = ({
  tabs,
  partySignerName,
  counterpartySignerName,
  onDrop,
  onRemoveTab,
}) => {
  const wrapper = useRef(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: (item: DragObject, monitor) => {
        const clientOffset = monitor.getClientOffset();

        if (wrapper.current && clientOffset) {
          const siOffset = monitor.getInitialSourceClientOffset();
          const piOffset = monitor.getInitialClientOffset();
          const idx = (piOffset?.x ?? 0) - (siOffset?.x ?? 0);
          const idy = (piOffset?.y ?? 0) - (siOffset?.y ?? 0);
          const offset = monitor.getClientOffset();
          const targetRect = (
            wrapper.current as HTMLElement
          ).getBoundingClientRect();
          const x = (offset?.x ?? 0) - (targetRect?.left ?? 0) - idx * 1;
          const y = (offset?.y ?? 0) - (targetRect?.top ?? 0) - idy * 1;
          const xInch = +(x / REACT_PDF_PPI).toFixed(3);
          const yInch = +(
            (y + (DOCUSIGN_TAB_HEIGHT - ARROW_MARGIN_BOTTOM)) /
            REACT_PDF_PPI
          ).toFixed(3);

          onDrop({
            x: xInch,
            y: yInch,
            name: item.name,
          });
        }
      },
      collect: (monitor: any) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [onDrop]
  );
  return (
    <div
      ref={wrapper}
      className={`w-full h-full absolute left-0 top-0 z-10 outline outline-2 ${
        isOver ? 'outline-blue-400' : ''
      }`}
    >
      <div ref={drop} className="w-full h-full">
        {tabs?.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="absolute"
            style={{
              left: item.x * REACT_PDF_PPI,
              top:
                item.y * REACT_PDF_PPI -
                (DOCUSIGN_TAB_HEIGHT - ARROW_MARGIN_BOTTOM),
            }}
          >
            <SignTab
              name={item.name}
              index={index}
              draggable={false}
              removable={true}
              onRemove={onRemoveTab}
              signerName={
                item.name === SignTabEnum.PARTY
                  ? partySignerName
                  : counterpartySignerName
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropArea;
