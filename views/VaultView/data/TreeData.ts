import { v4 as uuid } from 'uuid'

import { TreeNodeType } from "../components/TreeView/TreeView";

export const data: TreeNodeType[] = [
    {
        id: uuid(),
        name: 'Quarterly Reports',
        children: [
            {
                id: uuid(),
                name: 'Subfolder 1',
            },
            {
                id: uuid(),
                name: 'Subfolder 2',
            }, {
                id: uuid(),
                name: 'Subfolder 3',
            },
        ],
    },
    {
        id: uuid(),
        name: 'Finantial Statements',
        children: [
            {
                id: uuid(),
                name: 'treeview',
                children: [
                    {
                        id: uuid(),
                        name: 'index.ts',
                    },
                    {
                        id: uuid(),
                        name: 'initialValue.ts',
                    },
                    {
                        id: uuid(),
                        name: 'tree-state.tsx',
                    },
                    {
                        id: uuid(),
                        name: 'useTreeNode.tsx',
                    },
                ],
            },
            {
                id: uuid(),
                name: 'utils',
                children: [
                    {
                        id: uuid(),
                        name: 'chainable-map.ts',
                    },
                    {
                        id: uuid(),
                        name: 'index.ts',
                    },
                ],
            },
        ],
    },
    {
        id: uuid(),
        name: 'Deal Demos',
       
    },
    {
        id: uuid(),
        name: 'All Other Contracts',
       
    },

]
