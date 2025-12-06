import React, { useState } from "react";
import FormPanel from "../Components/FormPanel";
import ItemCard from "../Components/ItemCard";
import ViewModal from "../Components/ViewModal";
import Loader from "../Components/Loader";
import ToastAlert from "../Components/ToastAlert";
import ListControls from "../Components/ListControls";
import { useCRUD } from "../hooks/useCrud";
import { useUtils } from "../utils/useUtils";

const Category = () => {
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
    handleAdd,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleForceDelete,
    handleRestore,
  } = useCRUD(`${API_URL}/api/admin/categories`);

  const { toast, showToast} = useUtils(items);

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter Name",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter Description",
    },
  ];

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
        <h1 className="text-3xl font-bold mb-6">Categories Management</h1>

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
          }}
        />

        {loading && <Loader />}

        {(isAdding || editingId) && (
          <FormPanel
            fields={fields}
            formData={formData}
            setFormData={setFormData}
            mode={editingId ? "edit" : "add"}
            onSave={async () => {
              const res = editingId
                ? await handleSaveEdit()
                : await handleAdd();
              res?.success
                ? showToast(
                    editingId
                      ? "Category updated successfully"
                      : "Category added successfully"
                  )
                : showToast("Operation failed", "error");
            }}
            onCancel={() => {
              setIsAdding(false);
              setEditingId(null);
              setFormData({});
            }}
          />
        )}

        {!loading && !isAdding && !editingId && (
          <ItemCard
            items={items}
            fields={fields}
            onEdit={handleEdit}
            onView={(item) => setViewingItem(item)}
            onDelete={async (id) => {
              const res = await handleDelete(id);
              res?.success
                ? showToast("Category deleted")
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
                ? showToast("Category restored")
                : showToast("Restore failed", "error");
            }}
           
          />
        )}

        {viewingItem && (
          <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
        )}

      </div>
    </div>
  );
};

export default Category;
