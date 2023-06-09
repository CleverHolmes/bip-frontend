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
  dispatch: () => {},
  selectedId: null,
  selectId: () => {},
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
    <li className="cursor-pointer select-none relative pl-16">
      <MotionConfig
        transition={{
          ease: [0.164, 0.84, 0.43, 1],
          duration: 0.25,
        }}
      >
        <div
          className={clsx(
            "flex items-center justify-between font-mono font-medium pr-16 h-14",
            selectedId === id
              ? "bg-slate-200 border-blueN300 border-r-4"
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
              <div className="flex gap-1 items-center justify-center">
                {isOpen ? (
                  <Icon
                    name="Folder"
                    size="md"
                    color="blueN300"
                    className="shrink-0 grow-0"
                  />
                ) : (
                  <Icon
                    name="Folder"
                    size="md"
                    color="grayN100"
                    className="shrink-0 grow-0"
                  />
                )}
                <span className="whitespace-nowrap overflow-hidden text-sm font-bold">
                  {name}
                </span>
              </div>
              {isOpen ? (
                <Icon
                  name="FolderArrow"
                  viewBox="0 0 10 10"
                  size="sm"
                  className="shrink-0 grow-0"
                />
              ) : (
                <Icon
                  name="FolderArrow"
                  viewBox="0 0 10 10"
                  size="sm"
                  color="grayN100"
                  className="shrink-0 grow-0 rotate-180"
                />
              )}
            </>
          ) : (
            <>
              <div className="flex gap-2 items-center justify-center">
                <Icon
                  name="Folder"
                  size="md"
                  color="grayN100"
                  className="shrink-0 grow-0"
                />
                <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {name}
                </span>
              </div>
              <div></div>
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
              className="border-y-1 border-grayN50"
            >
              {children.map((node) => (
                <div key={node.id}>
                  {/*node.children?.length && */ <Node node={node} />}
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
