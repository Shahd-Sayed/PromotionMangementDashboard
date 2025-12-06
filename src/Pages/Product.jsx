import React, { useState, useEffect } from "react";
import FormPanel from "../Components/FormPanel";
import ItemCard from "../Components/ItemCard";
import ViewModal from "../Components/ViewModal";
import Loader from "../Components/Loader";
import ToastAlert from "../Components/ToastAlert";
import ListControls from "../Components/ListControls";
import PaginationButtons from "../Components/PaginationButtons";
import { useCRUD } from "../hooks/useCrud";
import { useUtils } from "../utils/useUtils";
import axiosClient from "../api/axiosClient";

const Product = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    items,
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
    fetchItems,
    handleAdd,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleForceDelete,
    handleRestore,
    currentPage,
    totalPages,
    setPage,
  } = useCRUD(`${API_URL}/api/admin/products`, 9);

  const { toast, showToast, hideToast } = useUtils();

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    axiosClient.get(`${API_URL}/api/admin/categories`).then(({ data }) => {
      if (Array.isArray(data?.data?.data)) setCategories(data.data.data);
    });
  }, []);

  const formFields = [
    {
      name: "category_id",
      label: "Category",
      type: "select",
      options: categories.map((cat) => ({ value: cat.id, label: cat.name })),
      required: true,
    },
    { name: "name", label: "Product Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "price", label: "Price", type: "number", required: true },
    {
      name: "image",
      label: "Product Image",
      type: "file",
      onChange: (e) => {
        const file = e.target.files[0];
        if (file) {
          setFormData({ ...formData, image: file });
          setImagePreview(URL.createObjectURL(file));
        }
      },
    },
  ];

  const displayFields = [
    { name: "category_name", label: "Category" },
    { name: "name", label: "Product Name" },
    { name: "description", label: "Description" },
    { name: "price", label: "Price" },
  ];

  const displayedItems = items.map((item) => ({
    ...item,
    category_name: item.category?.name || "N/A",
  }));

  return (
    <div className="min-h-screen">
      {toast && (
        <ToastAlert type={toast.type} message={toast.message} onClose={hideToast} />
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Products Management</h1>

        <ListControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showTrashed={showTrashed}
          setShowTrashed={setShowTrashed}
          loading={loading}
          onAdd={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({});
            setImagePreview(null);
          }}
        />

        {loading && <Loader />}

        {(isAdding || editingId) && (
          <FormPanel
            fields={formFields}
            formData={formData}
            setFormData={setFormData}
            mode={editingId ? "edit" : "add"}
            onSave={async () => {
              const res = editingId ? await handleSaveEdit() : await handleAdd();
              if (res?.success) {
                showToast(editingId ? "Product updated successfully" : "Product added successfully");
              } else showToast("Operation failed", "error");
              setImagePreview(null);
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditingId(null);
              setFormData({});
              setImagePreview(null);
            }}
          >
            {imagePreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-contain border rounded-md"
                />
              </div>
            )}
          </FormPanel>
        )}

        {!loading && !isAdding && !editingId && (
          <>
            <ItemCard
              items={displayedItems}
              fields={displayFields}
              onEdit={handleEdit}
              onView={setViewingItem}
              onDelete={async (id) => {
                const res = await handleDelete(id);
                if (res?.success) showToast("Product deleted successfully");
                else showToast(res?.message || "Delete failed", "error");
              }}
              onForceDelete={async (id) => {
                const res = await handleForceDelete(id);
                if (res?.success) {
                  showToast("Product permanently deleted");
                  await fetchItems(currentPage);
                } else {
                  showToast(res?.message || "Force delete failed", "error");
                }
              }}
              onRestore={async (id) => {
                const res = await handleRestore(id);
                if (res?.success) {
                  showToast("Product restored successfully");
                  await fetchItems(currentPage); 
                } else {
                  showToast(res?.message || "Restore failed", "error");
                }
              }}
            />

            <PaginationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={setPage}
            />
          </>
        )}

        {viewingItem && <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />}
      </div>
    </div>
  );
};

export default Product;
