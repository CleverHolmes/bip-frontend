/* eslint-disable import/order */
/* eslint-disable object-shorthand */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import clsx from "clsx";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import Icon from "components/new/Icon";

export type TreeViewState = Map<string, boolean>;

export enum TreeViewActionTypes {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
}

export type TreeViewActions =
  | {
    type: TreeViewActionTypes.OPEN;
    id: string;
  }
  | {
    type: TreeViewActionTypes.CLOSE;
    id: string;
  };

export function treeviewReducer(
  state: TreeViewState,
  action: TreeViewActions
): TreeViewState {
  switch (action.type) {
    case TreeViewActionTypes.OPEN:
      return new Map(state).set(action.id, true);

    case TreeViewActionTypes.CLOSE:
      return new Map(state).set(action.id, false);

    default:
      throw new Error("Tree Reducer received an unknown action");
  }
}

export type TreeViewContextType = {
  open: TreeViewState;
  dispatch: Dispatch<TreeViewActions>;
  selectedId: string | null;
  selectId: (id: string) => void;
};

export const TreeViewContext = createContext<TreeViewContextType>({
  open: new Map<string, boolean>(),
  dispatch: () => { },
  selectedId: null,
  selectId: () => { },
});

type RootProps = {
  children: ReactNode | ReactNode[];
  className?: string;
  value: string | null;
  onChange: (id: string) => void;
};

export function Root({ children, className, value, onChange }: RootProps) {
  const [open, dispatch] = useReducer(
    treeviewReducer,
    new Map<string, boolean>()
  );

  return (
    <TreeViewContext.Provider
      value={{
        open,
        dispatch,
        selectedId: value,
        selectId: onChange,
      }}
    >
      <ul className={clsx("flex flex-col overflow-auto", className)}>
        {children}
      </ul>
    </TreeViewContext.Provider>
  );
}

export type TreeNodeType = {
  id: string;
  name: string;
  children?: TreeNodeType[];
  icon?: ReactNode;
};

type NodeProps = {
  node: TreeNodeType;
};

export const Node = function TreeNode({
  node: { id, name, children },
}: NodeProps) {
  const { open, dispatch, selectId, selectedId } = useContext(TreeViewContext);
  const isOpen = open.get(id);
  return (
    <li className="flex flex-col cursor-pointer select-none relative">
      <MotionConfig
        transition={{
          ease: [0.164, 0.84, 0.43, 1],
          duration: 0.25,
        }}
      >
        <div
          className={clsx(
            "flex items-center justify-between space-x-2 font-mono font-medium px-1 h-14",
            selectedId === id
              ? "bg-slate-200 border-r-4 border-blueN300"
              : "bg-transparent"
          )}
          onClick={() => {
            isOpen
              ? dispatch({
                id: id,
                type: TreeViewActionTypes.CLOSE,
              })
              : dispatch({
                id: id,
                type: TreeViewActionTypes.OPEN,
              });
            selectId(id);
          }}
        >
          {children?.length ? (
            <>
              {isOpen ? (
                <Icon
                  name="Folder"
                  viewBox="-10 -10 32 38"
                  size="xl"
                  color="blueN300"
                  className="shrink-0 grow-0"
                />
              ) : (
                <Icon
                  name="Folder"
                  viewBox="-10 -10 32 38"
                  size="xl"
                  color="grayN100"
                  className="shrink-0 grow-0"
                />
              )}
              <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                {name}
              </span>
              {isOpen ? (
                <Icon
                  name="FolderArrow"
                  viewBox="-10 -10 32 38"
                  size="xl"
                  className="shrink-0 grow-0"
                />
              ) : (
                <Icon
                  name="FolderArrow"
                  viewBox="-10 -10 32 38"
                  size="xl"
                  color="grayN100"
                  className="shrink-0 grow-0 rotate-180"
                />
              )}
            </>
          ) :
            (
              <>
                <Icon
                  name="Folder"
                  viewBox="-10 -10 32 38"
                  size="xl"
                  color="grayN100"
                  className="shrink-0 grow-0"
                />
                <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {name}
                </span>
              </>
            )}

        </div>
        <AnimatePresence initial={false}>
          {children?.length && isOpen && (
            <motion.ul
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.25,
                  },
                  opacity: {
                    duration: 0.2,
                    delay: 0.05,
                  },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: 0.25,
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              }}
              key={"ul"}
              role="group"
              className="pl-5 border-y-1 border-grayN50"
            >
              {children.map((node) => (
                <div key={node.id}>
                  {/*node.children?.length && */<Node node={node} />}
                </div>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </MotionConfig>
    </li>
  );
};

export const Treeview = { Root, Node };
