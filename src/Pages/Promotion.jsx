import React, { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import FormPanel from "../Components/FormPanel";
import ItemCard from "../Components/ItemCard";
import ViewModal from "../Components/ViewModal";
import Loader from "../Components/Loader";
import ToastAlert from "../Components/ToastAlert";
import ListControls from "../Components/ListControls";
import { useCRUD } from "../hooks/useCrud";
import { useUtils } from "../utils/useUtils";
import axiosClient from "../api/axiosClient";
import ManageProductsPage from "../Components/ManageProductsModal";

const Promotion = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    items,
    setItems,
    isAdding,
    setIsAdding,
    editingId,
    setEditingId,
    viewingItem,
    setViewingItem,
    showTrashed,
    setShowTrashed,
    formData,
    setFormData,
    loading,
    searchTerm,
    setSearchTerm,
    handleAdd,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleForceDelete,
    handleRestore,
    attachProduct,
    detachProduct,
  } = useCRUD(`${API_URL}/api/admin/promotion`);

  const { toast, showToast } = useUtils(items);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  useEffect(() => {
    axiosClient.get(`${API_URL}/api/admin/products`).then(({ data }) => {
      if (Array.isArray(data?.data?.data)) setProducts(data.data.data);
    });

    axiosClient.get(`${API_URL}/api/admin/categories`).then(({ data }) => {
      if (Array.isArray(data?.data?.data)) setCategories(data.data.data);
    });
  }, []);

  const formFields = [
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categories.map((c) => ({ label: c.name, value: c.id })),
      placeholder: "Select a category",
      required: true,
    },
    {
      name: "name",
      label: "Promotion Name",
      type: "text",
      placeholder: "Enter promotion name",
      required: true,
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      placeholder: "Select start date",
      required: true,
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
      placeholder: "Select end date",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
    },
    {
      name: "discount_type",
      label: "Discount Type",
      type: "select",
      options: [
        { label: "Percentage", value: "percentage" },
        { label: "Fixed", value: "fixed" },
      ],
      placeholder: "Select discount type",
      required: true,
    },
    {
      name: "discount_value",
      label: "Discount Value",
      type: "number",
      placeholder: "Enter discount value",
      required: true,
    },
  ];

  const displayFields = [
    { name: "name", label: "Promotion Name" },
    { name: "start_date", label: "Start Date" },
    { name: "end_date", label: "End Date" },
    {
      name: "status",
      label: "Status",
      render: (item) => {
        const statusColor = item.status === "active" ? "green" : "red"; 
        return (
          <span
            className={`px-2 py-1 rounded-full text-white text-xs font-semibold bg-${statusColor}-500`}>
            {item.status || "-"}
          </span>
        );
      },
    },
    { name: "discount_type", label: "Discount Type" },
    { name: "discount_value", label: "Discount Value" },
    {
      name: "products",
      label: "Products",
      render: (item) => `${item.products?.length || 0} product(s)`,
    },
    {
      name: "category",
      label: "Category",
      render: (item) => item.category?.name || "-",
    },
  ];
  const defaultFormData = {
    category_id: "",
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    discount_type: "percentage",
    discount_value: 0,
  };
  if (selectedPromotion) {
    return (
      <ManageProductsPage
        promotion={selectedPromotion}
        products={products}
        onBack={() => setSelectedPromotion(null)}
        onAttach={async (promotionId, productId) => {
          const res = await attachProduct(promotionId, productId);
          if (res?.success) {
            showToast("Product attached successfully");
            if (res.data) setSelectedPromotion(res.data);
          } else {
            showToast("Attach failed", "error");
          }
          return res;
        }}
        onDetach={async (promotionId, productId) => {
          const res = await detachProduct(promotionId, productId);
          if (res?.success) {
            showToast("Product detached successfully");
            if (res.data) setSelectedPromotion(res.data);
          } else {
            showToast("Detach failed", "error");
          }
          return res;
        }}
      />
    );
  }

  const handleAddPromotion = async () => {
    try {
      const res = await axiosClient.post(
        `${API_URL}/api/admin/promotion`,
        formData
      );
      if (res.data.success) {
        showToast("Promotion added successfully");

        const promosRes = await axiosClient.get(
          `${API_URL}/api/admin/promotion`
        );
        setItems(promosRes.data.data.data);

        setIsAdding(false);
        setFormData({});
      } else {
        showToast("Failed to add promotion", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Operation failed", "error");
    }
  };

  return (
    <div className="min-h-screen">
      {toast && (
        <ToastAlert
          type={toast.type}
          message={toast.message}
          onClose={() => showToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Promotions Management</h1>

        <ListControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showTrashed={showTrashed}
          setShowTrashed={setShowTrashed}
          loading={loading}
          onAdd={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData(defaultFormData);
          }}
        />

        {loading && <Loader />}

        {(isAdding || editingId) && (
          <FormPanel
            fields={formFields}
            formData={formData}
            setFormData={setFormData}
            mode={editingId ? "edit" : "add"}
            onSave={editingId ? handleSaveEdit : handleAddPromotion}
            onCancel={() => {
              setIsAdding(false);
              setEditingId(null);
              setFormData(defaultFormData);
            }}
          />
        )}

        {!loading && !isAdding && !editingId && (
          <ItemCard
            items={items}
            fields={displayFields}
            onEdit={handleEdit}
            onView={(item) => setViewingItem(item)}
            onDelete={async (id) => {
              const res = await handleDelete(id);
              res?.success
                ? showToast("Promotion deleted")
                : showToast("Delete failed", "error");
            }}
            onForceDelete={async (id) => {
              const res = await handleForceDelete(id);
              res?.success
                ? showToast("Deleted forever")
                : showToast("Force delete failed", "error");
            }}
            onRestore={async (id) => {
              const res = await handleRestore(id);
              res?.success
                ? showToast("Promotion restored")
                : showToast("Restore failed", "error");
            }}
            extraActions={(item) => (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPromotion(item)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm">
                  <Package size={16} />
                  Manage Products
                </button>
                <Link
                  to={`/dashboard/applyPromotion/${item.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm">
                  <Package size={16} />
                  Apply Promotion
                </Link>
              </div>
            )}
          />
        )}

        {viewingItem && (
          <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
        )}
      </div>
    </div>
  );
};

export default Promotion;
