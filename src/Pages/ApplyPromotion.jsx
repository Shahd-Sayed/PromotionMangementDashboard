import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ToastAlert from "../Components/ToastAlert";

const ApplyPromotion = () => {
  const { promotionId } = useParams();
  const [logs, setLogs] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [applyingId, setApplyingId] = useState(null); 

  useEffect(() => {
    fetchAvailableProducts();
    fetchLogs();
  }, []);

  const fetchAvailableProducts = async () => {
    try {
      const res = await axiosClient.get(
        `/admin/promotion/${promotionId}/products`
      );
      setAllProducts(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch available products", err);
      setAllProducts([]);
      setToast({
        type: "error",
        message: "Failed to load available products",
      });
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axiosClient.get(
        `/admin/promotions/${promotionId}/logs`
      );
      setLogs(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLogs([]);
    }
  };

  const availableProducts = allProducts.filter((product) => {
    return !logs.some((log) => log.product_id === product.id);
  });

  const handleApply = async (productId) => {
    if (!promotionId || !productId) {
      setToast({ type: "error", message: "Missing promotion or product ID" });
      return;
    }

    setApplyingId(productId); 

    try {
      const res = await axiosClient.post("/admin/promotions/apply", {
        promotion_id: Number(promotionId),
        product_id: Number(productId),
      });

      if (res.data.success) {
        setToast({
          type: "success",
          message: res.data.message || "Promotion applied successfully",
        });

        setAllProducts((prev) => prev.filter((p) => p.id !== productId));

        await fetchLogs();
      } else {
        setToast({
          type: "error",
          message: res.data.message || "Apply failed",
        });
      }
    } catch (err) {
      console.error("Apply failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Apply failed. Check console for details.";
      setToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className=" min-h-screen max-w-7xl mx-auto">
      {toast && (
        <ToastAlert
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-bold mb-6">Apply Promotion</h1>

      {availableProducts.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            {allProducts.length === 0
              ? "No products available. Please attach products to this promotion first."
              : "All products have been applied to this promotion."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {availableProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition"
            >
              <div>
                {product.image && (
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL || "http://capitalagro.test"
                    }/storage/${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <h3 className="font-semibold text-lg">{product.name}</h3>

                {product.description && (
                  <div
                    className="text-gray-500 text-sm mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                <p className="text-green-600 font-bold mt-2">
                  ${product.price}
                </p>
              </div>

              <button
                onClick={() => handleApply(product.id)}
                disabled={
                  applyingId === product.id ||
                  logs.some((log) => log.product_id === product.id)
                }
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applyingId === product.id ? "Applying..." : "Apply Promotion"}
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Promotion Usage Logs</h2>
      {logs.length === 0 ? (
        <p className="text-gray-500">No promotion applied yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Product</th>
                <th className="border p-2">Promotion</th>
                <th className="border p-2">Applied At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {log.product?.name || log.product_id}
                  </td>
                  <td className="border p-2">
                    {log.promotion?.name || log.promotion_id}
                  </td>
                  <td className="border p-2">
                    {new Date(log.used_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplyPromotion;
