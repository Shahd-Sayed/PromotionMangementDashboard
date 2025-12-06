import { Plus, Search, Trash } from "lucide-react";

const ListControls = ({
  searchTerm,
  setSearchTerm,
  showTrashed,
  setShowTrashed,
  loading,
  onAdd,
}) => {
  return (
    <div className="bg-linear-to-r from-white to-gray-50 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <button
          className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          onClick={onAdd}
          disabled={loading}>
          <Plus size={20} strokeWidth={2.5} />
          Add Item
        </button>

        <div className="flex gap-3 items-center">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm min-w-[280px] bg-white hover:border-gray-300"
            />
          </div>
          <button
            onClick={() => setShowTrashed(!showTrashed)}
            className={`px-5 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 ${
              showTrashed
                ? "bg-linear-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700"
                : "bg-linear-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400"
            }`}>
            <Trash size={20} />
            {showTrashed ? "Show Active" : "Show Deleted"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListControls;
