import { X, Trash2 } from "lucide-react";

const ViewModal = ({ item, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Category Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {item.image && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Image
              </label>
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `${API_URL}/storage/${item.image}`
                }
                alt={item.name}
                className="max-w-full max-h-64 rounded-lg border border-gray-200"
              />
            </div>
          )}
          {item.name && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Name
              </label>
              <p className="text-gray-900 font-semibold text-xl">{item.name}</p>
            </div>
          )}

          {item.description && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Description
              </label>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                {item.description}
              </p>
            </div>
          )}

          {item.price && (
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Price
              </label>
              <p className="text-gray-900 font-semibold text-lg">
                ${item.price}
              </p>
            </div>
          )}

          {item.deleted_at && (
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-red-900">Deleted Item</p>
                  <p className="text-sm text-red-700">
                    This category has been moved to trash
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
