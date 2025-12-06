import {
  ChevronUp,
  ChevronDown,
  Edit2,
  Eye,
  RefreshCw,
  Trash,
  Trash2,
} from "lucide-react";

const ItemCard = ({
  items,
  fields,
  onEdit,
  onDelete,
  onForceDelete,
  onRestore,
  onView,
  onMoveUp,
  onMoveDown,
  extraActions,
}) => {
  const displayedItems = Array.isArray(items) ? items : [];
  const safeFields = Array.isArray(fields) ? fields : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-3 bg-white border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Items List</h3>
        <div className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200">
          <span className="font-semibold text-gray-700">
            {displayedItems.length}
          </span>
          items
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {safeFields
                .filter((f) => f.type !== "file")
                .map((field) => (
                  <th
                    key={field.name}
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {field.label}
                  </th>
                ))}

              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide w-48">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {displayedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={fields.filter((f) => f.type !== "file").length + 2}
                  className="px-4 py-12 text-center text-gray-500">
                  <p className="text-lg font-medium">No items found</p>
                </td>
              </tr>
            ) : (
              displayedItems.map((item, index) => {
                const isExpired =
                  item.end_date && new Date(item.end_date) < new Date();

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      item.deleted_at
                        ? "hover:bg-red-100"
                        : isExpired
                        ? "bg-red-50 text-red-800"
                        : ""
                    }`}>
                    {safeFields
                      .filter((f) => f.type !== "file")
                      .map((field) => {
                        let value = item[field.name];

                        if (
                          (field.type === "date" ||
                            field.name.includes("date")) &&
                          value
                        ) {
                          value = value.split(" ")[0]; 
                        }

                        return (
                          <td key={field.name} className="px-3 py-2">
                            {field.render ? (
                              field.render(item)
                            ) : typeof value === "object" ? (
                              <span className="text-gray-400 italic">
                                [Object]
                              </span>
                            ) : value ? (
                              <span className="text-sm text-gray-800">
                                {value}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}

                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {onMoveUp && onMoveDown && !item.deleted_at && (
                          <div className="flex gap-0.5 mr-1 border-r pr-1">
                            <button
                              onClick={() => onMoveUp(item.id)}
                              disabled={index === 0}
                              className={`p-1.5 rounded ${
                                index === 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                              title="Move Up">
                              <ChevronUp size={16} />
                            </button>

                            <button
                              onClick={() => onMoveDown(item.id)}
                              disabled={index === displayedItems.length - 1}
                              className={`p-1.5 rounded ${
                                index === displayedItems.length - 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                              title="Move Down">
                              <ChevronDown size={16} />
                            </button>
                          </div>
                        )}

                        {!item.deleted_at ? (
                          <>
                            {onView && (
                              <button
                                onClick={() => onView(item)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="View">
                                <Eye size={16} />
                              </button>
                            )}

                            {onEdit && (
                              <button
                                onClick={() => onEdit(item)}
                                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Edit">
                                <Edit2 size={16} />
                              </button>
                            )}

                            {onDelete && (
                              <button
                                onClick={() => onDelete(item.id)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Delete">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {onRestore && (
                              <button
                                onClick={() => onRestore(item.id)}
                                className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Restore">
                                <RefreshCw size={16} />
                              </button>
                            )}

                            {onForceDelete && (
                              <button
                                onClick={() => onForceDelete(item.id)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Delete Permanently">
                                <Trash size={16} />
                              </button>
                            )}
                          </>
                        )}

                        {extraActions && typeof extraActions === "function" && (
                          <div className="flex gap-1 mt-1 w-full justify-center">
                            {extraActions(item)}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemCard;
