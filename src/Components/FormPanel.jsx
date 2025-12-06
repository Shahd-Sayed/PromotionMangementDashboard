import React, { useState, useEffect, useRef } from "react";
import { Plus, Save, X } from "lucide-react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Start typing...",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ font: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["link"],
              [{ color: [] }, { background: [] }],
              ["clean"],
            ],
          },
        },
      });
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      quillRef.current.on("text-change", () => {
        const html = quillRef.current.root.innerHTML;
        onChange(html);
      });
    }
  }, []);
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return <div ref={editorRef} style={{ minHeight: "200px" }} />;
};

const FormPanel = ({
  fields,
  formData,
  setFormData,
  onSave,
  onCancel,
  mode = "add",
  rowFields = [],
}) => {
  const [previewImages, setPreviewImages] = useState({});
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("blob:")) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/^storage\//, "");
    return `${API_BASE_URL}/storage/${cleanPath}`;
  };

  useEffect(() => {
    const previews = {};

    fields.forEach((field) => {
      if (field.type === "file") {
        const value = formData[field.name];

        if (field.name === "gallery" && Array.isArray(value)) {
          const gallery = value.map((img) => {
            if (img.url) {
              return img;
            } else if (typeof img === "string") {
              return { url: buildImageUrl(img), file: null };
            } else if (img.file) {
              return { url: URL.createObjectURL(img.file), file: img.file };
            }
            return img;
          });
          setGalleryPreviews(gallery);
        } else if (value) {
          if (typeof value === "string") {
            previews[field.name] = buildImageUrl(value);
          } else if (value instanceof File) {
            previews[field.name] = URL.createObjectURL(value);
          }
        }
      }
    });

    setPreviewImages(previews);
  }, [fields, formData]);

  const handleFileChange = (name, file) => {
    if (name === "gallery") {
      const newItem = { file, url: URL.createObjectURL(file) };
      const updatedGallery = [...galleryPreviews, newItem];
      setGalleryPreviews(updatedGallery);
      setFormData((prev) => ({ ...prev, gallery: updatedGallery }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages({ ...previewImages, [name]: previewUrl });
    }
  };

  const handleChange = (name, value, field) => {
    if (field?.onChange) {
      field.onChange(value, formData, setFormData);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeGalleryImage = (index) => {
    const updated = galleryPreviews.filter((_, i) => i !== index);
    setGalleryPreviews(updated);
    setFormData({ ...formData, gallery: updated });
  };

  const rows = [];
  let tempRow = [];
  fields.forEach((field) => {
    if (rowFields.includes(field.name)) {
      tempRow.push(field);
      if (tempRow.length === 2) {
        rows.push(tempRow);
        tempRow = [];
      }
    } else {
      if (tempRow.length > 0) {
        rows.push(tempRow);
        tempRow = [];
      }
      rows.push([field]);
    }
  });
  if (tempRow.length > 0) rows.push(tempRow);

  return (
    <form
      className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}>
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {mode === "add" ? "Add New Item" : "Edit Item"}
      </h3>

      <div className="space-y-4">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={`flex gap-4 ${
              row.length > 1 ? "flex-row" : "flex-col"
            }`}>
            {row.map((field) => (
              <div key={field.name} className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {field.name === "social_links" ? (
                  <div>
                    {formData.social_links?.map((link, index) => (
                      <div key={index} className="flex gap-2 mb-2 items-center">
                        <select
                          className="border rounded px-2 py-1"
                          value={link.platform}
                          onChange={(e) => {
                            const updated = [...formData.social_links];
                            updated[index].platform = e.target.value;
                            setFormData({ ...formData, social_links: updated });
                          }}>
                          <option value="">Select Platform</option>
                          <option value="facebook">Facebook</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="instagram">Instagram</option>
                        </select>
                        <input
                          type="url"
                          placeholder="URL"
                          className="border rounded px-2 py-1 flex-1"
                          value={link.url}
                          onChange={(e) => {
                            const updated = [...formData.social_links];
                            updated[index].url = e.target.value;
                            setFormData({ ...formData, social_links: updated });
                          }}
                        />
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            const updated = formData.social_links.filter(
                              (_, i) => i !== index
                            );
                            setFormData({ ...formData, social_links: updated });
                          }}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          social_links: [
                            ...(formData.social_links || []),
                            { platform: "", url: "" },
                          ],
                        })
                      }>
                      + Add Link
                    </button>
                  </div>
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleChange(field.name, e.target.value, field)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    required={field.required}>
                    <option value="">
                      {field.placeholder || "Select an option"}
                    </option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <div className="rich-text-editor">
                    <RichTextEditor
                      value={formData[field.name] || ""}
                      onChange={(value) =>
                        handleChange(field.name, value, field)
                      }
                      placeholder={field.placeholder}
                    />
                  </div>
                ) : field.type === "file" && field.name === "gallery" ? (
                  <>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const newPreviews = files.map((file) => ({
                          file,
                          url: URL.createObjectURL(file),
                        }));
                        const updatedGallery = [
                          ...galleryPreviews,
                          ...newPreviews,
                        ];
                        setGalleryPreviews(updatedGallery);
                        setFormData({ ...formData, gallery: updatedGallery });
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {galleryPreviews.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {galleryPreviews.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden group">
                            <img
                              src={img.url}
                              className="w-full h-full object-cover"
                              alt={`Gallery ${i + 1}`}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(i)}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={14} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                              {i + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : field.type === "file" ? (
                  <div>
                    {previewImages[field.name] && (
                      <div className="mb-3">
                        <img
                          src={previewImages[field.name]}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(field.name, e.target.files[0])
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                ) : field.type === "color" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData[field.name] || "#ffffff"}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value, field)
                      }
                      className="h-10 w-20 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value, field)
                      }
                      placeholder="#ffffff"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleChange(field.name, e.target.value, field)
                    }
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className={`flex-1 py-2.5 rounded-lg transition font-medium flex items-center justify-center gap-2 shadow-sm ${
              mode === "add"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}>
            {mode === "add" ? <Plus size={18} /> : <Save size={18} />}
            {mode === "add" ? "Save" : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm">
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        .rich-text-editor .ql-toolbar {
          border: 1px solid #d1d5db;
          border-radius: 8px 8px 0 0;
          background: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 8px 8px;
          min-height: 200px;
          font-size: 14px;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          font-style: italic;
          color: #9ca3af;
        }
      `}</style>
    </form>
  );
};

export default FormPanel;
