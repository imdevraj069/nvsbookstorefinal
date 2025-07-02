"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import Image from "next/image";
import RichEditor from "@/utils/RichEditor";

const tabs = [
  "Basic Info",
  "Details",
  "Digital",
  "Specifications",
  "Settings",
  "Content",
];

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  editMode = false,
  initialData = null,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [productCategories, setProductCategories] = useState([]);
  const [newProductCategory, setNewProductCategory] = useState("");
  const [addProductCategoryMode, setAddProductCategoryMode] = useState(false);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [digitalInputMode, setDigitalInputMode] = useState("upload");
  const [enableGallery, setEnableGallery] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  const defaultFormData = {
    title: "",
    description: "",
    price: null,
    originalPrice: "",
    longDescription: "",
    image: "",
    images: [],
    digitalUrl: "",
    rating: 4,
    category: "",
    stock: null,
    isDigital: false,
    isVisible: true,
    isFeatured: false,
    author: "",
    publisher: "",
    pages: null,
    language: [],
    isbn: "",
    specifications: {},
    date: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/product?type=category");
        setProductCategories(res.data.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    if (isOpen) {
      fetchCategories();
      setFormData(editMode && initialData ? initialData : defaultFormData);
    }
  }, [isOpen, editMode, initialData]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedCategory = productCategories.find(
      (cat) => cat._id === formData.category
    );
    const dataToSend = {
      ...formData,
      category: selectedCategory,
    };
    console.log(dataToSend);
    try {
      await onSubmit(dataToSend);
      handleCancel();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    setFormData(defaultFormData);
    setAddProductCategoryMode(false);
    setNewSpecKey("");
    setNewSpecValue("");
    setNewProductCategory("");
    onClose();
  };

  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey.trim()]: newSpecValue.trim(),
      },
    }));
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleRemoveSpecification = (key) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleAddCategory = async () => {
    if (!newProductCategory.trim()) return;
    try {
      const res = await axios.post("/api/product?type=category", {
        data: newProductCategory,
      });
      const data = res.data.data;
      setProductCategories((prev) => [...prev, data]);
      setFormData((prev) => ({ ...prev, category: data._id }));
      setNewProductCategory("");
      setAddProductCategoryMode(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error("Failed to add category. Please try again.");
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("No file selected");

    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    if ((type === "image" && !isImage) || (type === "pdf" && !isPDF)) {
      return toast.error(`Invalid ${type.toUpperCase()} file`);
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        ...(type === "image" ? { image: data.url } : { digitalUrl: data.url }),
      }));
      toast.success(`${type.toUpperCase()} uploaded successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Label htmlFor="title">Title</Label>
            <Input id="title" onChange={handleChange} value={formData.title} />

            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              onChange={handleChange}
              value={formData.description}
            />

            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "image")}
              disabled={uploading}
            />
            {formData.image && (
              <Image
                src={formData.image}
                alt="Product"
                width={0}
                height={120}
                sizes="100vw"
                className="mt-2 h-[120px] w-auto object-contain"
              />
            )}

            <Label>Upload Additional Images</Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                if (!files.length) return;
                setUploading(true);

                const newImages = [];
                for (const file of files) {
                  const form = new FormData();
                  form.append("file", file);
                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: form,
                    });
                    const data = await res.json();
                    newImages.push(data.url);
                  } catch (err) {
                    console.error("Image upload error:", err);
                    toast.error("Some image(s) failed to upload.");
                  }
                }

                setFormData((prev) => ({
                  ...prev,
                  images: [...prev.images, ...newImages],
                }));
                setUploading(false);
                toast.success("Images uploaded");
              }}
              disabled={uploading}
            />

            {/* Gallery Preview */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group border rounded overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    width={150}
                    height={100}
                    className="object-cover w-full h-28"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-1 right-1 text-xs bg-red-500 text-white px-1 rounded hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2">
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                onChange={handleChange}
                value={formData.category._id || formData.category}
              >
                <option value="">Select category</option>
                {productCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddProductCategoryMode(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {addProductCategoryMode && (
              <div className="flex gap-2 items-center mt-2">
                <Input
                  placeholder="New category name"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                />
                <Button onClick={handleAddCategory}>Add</Button>
                <Button
                  variant="outline"
                  onClick={() => setAddProductCategoryMode(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </>
        );

      case 1:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  onChange={handleChange}
                  value={formData.price || ""}
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  onChange={handleChange}
                  value={formData.originalPrice || ""}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  onChange={handleChange}
                  value={formData.stock || ""}
                />
              </div>
              <div>
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  onChange={handleChange}
                  value={formData.pages || ""}
                />
              </div>
            </div>

            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              onChange={handleChange}
              value={formData.author}
            />

            <Label htmlFor="publisher">Publisher</Label>
            <Input
              id="publisher"
              onChange={handleChange}
              value={formData.publisher}
            />

            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" onChange={handleChange} value={formData.isbn} />

            <Label htmlFor="language">Languages (comma separated)</Label>
            <Input
              id="language"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  language: e.target.value
                    .split(",")
                    .map((lang) => lang.trim()),
                }))
              }
              value={formData.language?.join(", ") || ""}
            />
          </>
        );

      case 2:
        return (
          <>
            <Label>
              <input
                type="checkbox"
                checked={formData.isDigital}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDigital: e.target.checked,
                  }))
                }
              />
              Digital Product
            </Label>

            {formData.isDigital && (
              <>
                <div className="flex border rounded-md overflow-hidden w-fit my-2">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm ${
                      digitalInputMode === "upload"
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setDigitalInputMode("upload");
                    }}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm ${
                      digitalInputMode === "url"
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setDigitalInputMode("url");
                    }}
                  >
                    Use URL
                  </button>
                </div>

                {digitalInputMode === "upload" ? (
                  <>
                    <Label>Upload Digital PDF</Label>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, "pdf")}
                    />
                  </>
                ) : (
                  <>
                    <Label>Direct URL</Label>
                    <Input
                      id="digitalUrl"
                      value={formData.digitalUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          digitalUrl: e.target.value.trim(),
                        }))
                      }
                    />
                  </>
                )}
              </>
            )}
          </>
        );

      case 3:
        return (
          <>
            <Label>Specifications</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Key"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
              />
              <Input
                placeholder="Value"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
              />
              <Button type="button" onClick={handleAddSpecification}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {Object.entries(formData.specifications || {}).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between bg-muted p-2 rounded"
                >
                  <span>
                    <strong>{key}:</strong> {value}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveSpecification(key)}
                  >
                    Remove
                  </Button>
                </div>
              )
            )}
          </>
        );

      case 4:
        return (
          <>
            <Label>
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVisible: e.target.checked,
                  }))
                }
              />
              Visible
            </Label>
            <Label>
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
              />
              Featured
            </Label>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              onChange={handleChange}
              value={formData.date}
            />
          </>
        );

      case 5:
        return (
          <>
            <Label>Long Description</Label>
            <RichEditor
              content={formData.longDescription}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, longDescription: html }))
              }
            />
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col md:flex-row">
      <div className="hidden md:flex md:flex-col bg-gray-100 border-r p-2 w-56 min-w-[200px]">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm text-left rounded-md transition mb-1 ${
              activeTab === index
                ? "bg-blue-100 font-semibold"
                : "hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6 overflow-auto">
        <div className="md:hidden text-red-500 font-semibold text-center">
          This form is best viewed on desktop. Please open on a larger screen.
        </div>

        <div className="hidden md:block">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editMode ? "Edit Product" : "New Product"}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" form="product-form" disabled={uploading}>
                {editMode ? "Update" : "Submit"}
              </Button>
            </div>
          </div>

          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            {renderTabContent()}
          </form>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveTab((prev) => Math.max(prev - 1, 0))}
              disabled={activeTab === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1))
              }
              disabled={activeTab === tabs.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
