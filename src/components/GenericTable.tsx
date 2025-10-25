import React from 'react';
import { Button, Tooltip } from '@material-tailwind/react';

interface Action {
  name: string;
  label?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: string[];
  actions?: Action[];
  onAction?: (name: string, item: T) => void | Promise<void>;
}

const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  onAction,
}: GenericTableProps<T>) => {
  const handleAction = (name: string, item: T) => {
    if (onAction) onAction(name, item);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {(item as any)[col]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  {actions.map((action) => (
                    <Tooltip
                      key={action.name}
                      content={action.label || action.name}
                    >
                        
                      <span className="inline-block">
                        <Button
                          size="sm"
                          color={action.name === 'delete' ? 'red' : 'blue'}
                          onClick={() => handleAction(action.name, item)}
                          className="!px-2 !py-1"
                          {...({} as any)}
                        >
                          {action.name === 'edit' ? (
                            <svg
                            color='black'
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="lucide lucide-file-pen-line-icon lucide-file-pen-line"
                            >
                              <path d="m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" />
                              <path d="M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                              <path d="M8 18h1" />
                            </svg>
                          ) : action.name === 'delete' ? (
                            <svg
                            color='red'
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="lucide lucide-trash-icon lucide-trash"
                            >
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                              <path d="M3 6h18" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          ) : (
                            action.label
                          )}
                        </Button>
                      </span>
                    </Tooltip>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
