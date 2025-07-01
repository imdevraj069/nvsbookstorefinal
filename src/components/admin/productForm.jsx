"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import TiptapEditor from "../../utils/RichEditor";

const tabs = [
  "Basic Info",
  "Pricing & Stock",
  "Details",
  "Content",
  "Settings"
];

export default function ProductForm({
  initialData = {},
  editMode = false,
  onSubmit,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    originalPrice: "",
    stock: "",
    image: "",
    category: "",
    author: "",
    publisher: "",
    pages: "",
    isbn: "",
    language: "",
    specifications: {},
    content: "",
    isDigital: false,
    isVisible: true,
    isFeatured: false,
    ...initialData,
  });

  useEffect(() => {
    axios.get("/api/product?type=category").then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedCategory = categories.find(cat => cat._id === form.category);
      const finalForm = { ...form, category: selectedCategory };
      await onSubmit(finalForm);
    } catch (err) {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={handleChange} disabled={loading} />
            <Label htmlFor="description">Short Description</Label>
            <Textarea id="description" value={form.description} onChange={handleChange} disabled={loading} />
          </>
        );
      case 1:
        return (
          <>
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" value={form.price} onChange={handleChange} disabled={loading} />
            <Label htmlFor="originalPrice">Original Price</Label>
            <Input id="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} disabled={loading} />
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" value={form.stock} onChange={handleChange} disabled={loading} />
          </>
        );
      case 2:
        return (
          <>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={handleChange}
                className="border p-2 rounded mx-2"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <Label htmlFor="author">Author</Label>
            <Input id="author" value={form.author} onChange={handleChange} disabled={loading} />
            <Label htmlFor="publisher">Publisher</Label>
            <Input id="publisher" value={form.publisher} onChange={handleChange} disabled={loading} />
            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" value={form.isbn} onChange={handleChange} disabled={loading} />
            <Label htmlFor="language">Languages (comma separated)</Label>
            <Input
              id="language"
              value={form.language}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                language: e.target.value,
              }))}
              disabled={loading}
            />
          </>
        );
      case 3:
        return (
          <TiptapEditor
            content={form.content}
            onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
          />
        );
      case 4:
        return (
          <>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDigital"
                  checked={form.isDigital}
                  onChange={handleChange}
                />
                <span>Is Digital</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={form.isVisible}
                  onChange={handleChange}
                />
                <span>Visible</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                />
                <span>Featured</span>
              </label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex">
      <aside className="w-64 bg-gray-100 border-r p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4">Product Setup</h2>
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === idx ? "bg-blue-200 font-bold" : "hover:bg-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {renderTabContent()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab((prev) => Math.max(prev - 1, 0))}
              disabled={activeTab === 0}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {editMode ? "Update Product" : "Create Product"}
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1))}
              disabled={activeTab === tabs.length - 1}
            >
              Next
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
