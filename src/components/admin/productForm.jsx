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

export default function ProductForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editMode = false, 
  initialData = null 
}) {
  // State
  const [productCategories, setProductCategories] = useState([]);
  const [newProductCategory, setNewProductCategory] = useState("");
  const [addProductCategoryMode, setAddProductCategoryMode] = useState(false);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [uploading, setUploading] = useState(false);

  // Form data structure
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
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Effects
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/product?type=category");
        const data = await res.data.data;
        setProductCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    if (isOpen) {
      fetchCategories();
      // Set initial data when editing
      if (editMode && initialData) {
        setFormData(initialData);
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, editMode, initialData]);

  // Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = productCategories.find(
      (cat) => cat._id === formData.category
    );

    const dataToSend = {
      ...formData,
      category: selectedCategory,
    };

    try {
      await onSubmit(dataToSend);
      handleCancel();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
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
      return {
        ...prev,
        specifications: newSpecs,
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));

      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        digitalUrl: data.url,
      }));

      toast.success("PDF uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
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
      toast.error(err.message || "Failed to add category. Please try again.");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Fields */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              onChange={handleChange}
              value={formData.title}
            />
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea
              id="longDescription"
              onChange={handleChange}
              value={formData.longDescription}
            />
          </div>

          {/* Category Selection */}
          <div>
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
          </div>

          {addProductCategoryMode && (
            <div className="flex gap-2 items-center">
              <Input
                placeholder="New category name"
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value)}
              />
              <Button type="button" onClick={handleAddCategory}>
                Add
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setAddProductCategoryMode(false)}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Price, Stock, Pages */}
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

          {/* Author, Publisher, ISBN */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                onChange={handleChange}
                value={formData.author}
              />
            </div>
            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                onChange={handleChange}
                value={formData.publisher}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              onChange={handleChange}
              value={formData.isbn}
            />
          </div>

          <div>
            <Label htmlFor="language">Languages (comma separated)</Label>
            <Input
              id="language"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  language: e.target.value.split(",").map((lang) => lang.trim()),
                }))
              }
              value={formData.language?.join(", ") || ""}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
            />
            {uploading && (
              <p className="text-muted-foreground">Uploading...</p>
            )}
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
          </div>

          {/* Digital Product PDF Upload */}
          <div>
            <Label>Upload Digital PDF (if digital)</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              disabled={uploading}
            />
            {formData.digitalUrl && (
              <a
                href={formData.digitalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-500 underline mt-1 block"
              >
                View PDF
              </a>
            )}
          </div>

          {/* Boolean Flags */}
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
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
              <span>Digital Product</span>
            </label>
            <label className="flex items-center space-x-2">
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
              <span>Visible</span>
            </label>
            <label className="flex items-center space-x-2">
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
              <span>Featured</span>
            </label>
          </div>

          {/* Specifications */}
          <div>
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
            <div className="space-y-2">
              {Object.entries(formData.specifications || {}).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">
                      <strong>{key}:</strong> {value}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpecification(key)}
                      className="text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={uploading}>
              {editMode ? "Update Product" : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}