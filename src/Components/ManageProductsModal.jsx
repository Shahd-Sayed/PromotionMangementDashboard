import{ useState, useEffect } from "react";
import { Package, Search, Plus, Trash2, Check, ArrowLeft } from "lucide-react";

const ManageProductsPage = ({
  promotion,
  products,
  onBack,
  onAttach,
  onDetach,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(promotion);
  const [searchAttached, setSearchAttached] = useState("");
  const [searchAvailable, setSearchAvailable] = useState("");

  useEffect(() => {
    setCurrentPromotion(promotion);
  }, [promotion]);

  const attachedProducts = currentPromotion.products || [];
  const attachedIds = attachedProducts.map((p) => p.id);
  const availableProducts = products.filter((p) => !attachedIds.includes(p.id));

  const filteredAttached = attachedProducts.filter((p) =>
    p.name.toLowerCase().includes(searchAttached.toLowerCase())
  );

  const filteredAvailable = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(searchAvailable.toLowerCase())
  );

  const handleAttach = async (productId) => {
    setLoading(true);
    const res = await onAttach(currentPromotion.id, productId);
    if (res?.data) {
      setCurrentPromotion(res.data);
    }
    setLoading(false);
  };

  const handleDetach = async (productId) => {
    setLoading(true);
    const res = await onDetach(currentPromotion.id, productId);
    if (res?.data) {
      setCurrentPromotion(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-">
        <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 text-white rounded-3xl shadow-2xl p-6 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Promotions</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Package size={32} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Manage Products</h1>
              <p className="text-blue-100 text-lg font-medium">
                {currentPromotion.name}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-lg font-semibold shadow-md">
                {attachedProducts.length}
              </div>
              Attached Products
            </h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search attached..."
                value={searchAttached}
                onChange={(e) => setSearchAttached(e.target.value)}
                className="pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all w-64"
              />
            </div>
          </div>

          {filteredAttached.length === 0 ? (
            <div className="text-center py-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium text-lg">
                {searchAttached
                  ? "No products found"
                  : "No products attached yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAttached.map((p) => (
                <div
                  key={p.id}
                  className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform ">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white p-2.5 rounded-lg">
                        <Check size={20} strokeWidth={3} />
                      </div>
                      <span className="font-semibold text-gray-800 text-lg">
                        {p.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDetach(p.id)}
                    disabled={loading}
                    className="w-full bg-linear-to-r from-red-500 to-pink-600 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                    <Trash2 size={18} />
                    Detach Product
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-lg font-semibold shadow-md">
                {availableProducts.length}
              </div>
              Available Products
            </h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search available..."
                value={searchAvailable}
                onChange={(e) => setSearchAvailable(e.target.value)}
                className="pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-64"
              />
            </div>
          </div>

          {filteredAvailable.length === 0 ? (
            <div className="text-center py-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-medium text-lg">
                {searchAvailable
                  ? "No products found"
                  : "All products are attached!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map((p) => (
                <div
                  key={p.id}
                  className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white p-2.5 rounded-lg">
                        <Package size={20} strokeWidth={2} />
                      </div>
                      <span className="font-semibold text-gray-800 text-lg">
                        {p.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAttach(p.id)}
                    disabled={loading}
                    className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                    <Plus size={18} strokeWidth={2.5} />
                    Attach Product
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProductsPage;