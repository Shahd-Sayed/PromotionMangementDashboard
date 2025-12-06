import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const useCRUD = (baseUrl, defaultPerPage = 10) => {
  const [items, setItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [showTrashed, setShowTrashed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchItems = async (page = 1) => {
    try {
      setLoading(true);
      const url = showTrashed ? `${baseUrl}/trashed` : baseUrl;
      const params = {
        page,
        per_page: perPage,
      };
      if (searchTerm) params.search = searchTerm;

      const { data } = await axiosClient.get(url, { params });

      const fetchedItems = Array.isArray(data?.data?.data) ? data.data.data : [];
      setItems(fetchedItems);

      const pagination = data?.data?.meta?.pagination;
      if (pagination) {
        setCurrentPage(pagination.current_page || 1);
        setTotalPages(pagination.total_pages || 1);
        setPerPage(pagination.per_page || defaultPerPage);
        setTotalItems(pagination.total || fetchedItems.length);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage, searchTerm, showTrashed]);

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAdd = async () => {
    try {
      setLoading(true);
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formPayload.append(key, formData[key]);
        }
      });

      const res = await axiosClient.post(baseUrl, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchItems(currentPage);
      setFormData({});
      setIsAdding(false);

      return res.data;
    } catch (error) {
      console.log(error.response?.data);
      return { success: false, message: "Add failed" };
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      ...item,
      category_id: item.category?.id || "",
      start_date: item.start_date?.split(" ")[0] || "",
      end_date: item.end_date?.split(" ")[0] || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const formPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === "image") {
            if (typeof formData.image !== "string") {
              formPayload.append(key, formData[key]);
            }
          } else {
            formPayload.append(key, formData[key]);
          }
        }
      });

      const res = await axiosClient.post(
        `${baseUrl}/${editingId}?_method=PUT`,
        formPayload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      await fetchItems(currentPage);
      setEditingId(null);
      setFormData({});

      return res.data;
    } catch (error) {
      console.log(error.response?.data);
      return { success: false, message: "Update failed" };
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await axiosClient.delete(`${baseUrl}/${id}`);
      await fetchItems(currentPage);
      return res.data;
    } catch (error) {
      return { success: false, message: "Delete failed" };
    } finally {
      setLoading(false);
    }
  };

  const handleForceDelete = async (id) => {
    try {
      setLoading(true);
      const res = await axiosClient.delete(`${baseUrl}/${id}/forceDelete`);
      await fetchItems(currentPage);
      return res.data;
    } catch (error) {
      return { success: false, message: "Force delete failed" };
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setLoading(true);
      const res = await axiosClient.post(`${baseUrl}/${id}/restore`);
      await fetchItems(currentPage);
      return res.data;
    } catch (error) {
      return { success: false, message: "Restore failed" };
    } finally {
      setLoading(false);
    }
  };

  const attachProduct = async (promotionId, productId) => {
    try {
      setLoading(true);
      const res = await axiosClient.post(
        `${baseUrl}/${promotionId}/attach-product`,
        { product_id: productId }
      );

      const updatedPromotion = res?.data?.data;
      setItems((prev) =>
        prev.map((p) => (p.id === promotionId ? updatedPromotion : p))
      );

      return res.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "Attach failed" };
    } finally {
      setLoading(false);
    }
  };

  const detachProduct = async (promotionId, productId) => {
    try {
      setLoading(true);
      const res = await axiosClient.post(
        `${baseUrl}/${promotionId}/detach-product`,
        { product_id: productId }
      );

      const updatedPromotion = res?.data?.data;
      setItems((prev) =>
        prev.map((p) => (p.id === promotionId ? updatedPromotion : p))
      );

      return res.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: "Detach failed" };
    } finally {
      setLoading(false);
    }
  };

  return {
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
    fetchItems,
    handleAdd,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleForceDelete,
    handleRestore,
    attachProduct,
    detachProduct,
    currentPage,
    totalPages,
    perPage,
    totalItems,
    setPage: setCurrentPage,
  };
};
