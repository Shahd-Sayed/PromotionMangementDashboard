import { useState } from "react";
export const useUtils = (items = [], moveItem = null, saveOrder = null) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    if (!message) return;
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const hideToast = () => setToast(null);

  const moveUp = (id) => {
    if (!moveItem) return;
    const index = items.findIndex((item) => item.id === id);
    if (index > 0) moveItem(index, index - 1);
  };

  const moveDown = (id) => {
    if (!moveItem) return;
    const index = items.findIndex((item) => item.id === id);
    if (index < items.length - 1) moveItem(index, index + 1);
  };

  const handleSaveOrder = async () => {
    if (!saveOrder) {
      showToast("Save order not supported here", "error");
      return { success: false };
    }

    const res = await saveOrder();

    res?.success
      ? showToast("Order saved successfully")
      : showToast("Order save failed", "error");

    return res;
  };

  return { toast, showToast, hideToast, moveUp, moveDown, handleSaveOrder };
};
