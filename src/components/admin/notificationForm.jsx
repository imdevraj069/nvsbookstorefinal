"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import FroalaEditor from "@/utils/RichEditor";

const tabs = ["Basic Info", "Details", "Content", "Links", "Dates", "Settings"];

export default function NotificationForm({
  formData,
  editMode,
  currentEditId,
  onSuccess,
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    department: "",
    location: "",
    pdfUrl: "",
    applyUrl: "",
    websiteUrl: "",
    loginUrl: "",
    resultUrl: "",
    admitCardUrl: "",
    lastDate: "",
    date: "",
    isVisible: true,
    isFeatured: false,
    ...formData,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update form when formData changes (for edit mode)
  useEffect(() => {
    if (formData) {
      setForm((prev) => ({
        ...prev,
        ...formData,
        // Ensure dates are formatted correctly for input fields
        date: formData.date
          ? new Date(formData.date).toISOString().split("T")[0]
          : "",
        lastDate: formData.lastDate
          ? new Date(formData.lastDate).toISOString().split("T")[0]
          : "",
      }));
    }
  }, [formData]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/notification?type=category");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      toast.error("Failed to fetch categories");
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (rawContent) => {
    // Remove the attribution footer from the editor output
    const cleanedContent = rawContent.replace(
      /<p[^>]*data-f-id=["']pbf["'][^>]*>.*?<\/p>/gi,
      ""
    );

    setForm((prev) => ({ ...prev, content: cleanedContent }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      setActiveTab(0);
      return false;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      setActiveTab(0);
      return false;
    }
    if (!form.category) {
      toast.error("Please select a category");
      setActiveTab(1);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const selectedCategory = categories.find(
        (cat) => cat._id === form.category
      );

      const dataToSend = {
        ...form,
        category: selectedCategory || {
          _id: form.category,
          name: form.category,
        },
      };

      const res = editMode
        ? await axios.put(`/api/notification/${currentEditId}`, dataToSend)
        : await axios.post("/api/notification", { data: dataToSend });

      toast.success(
        `Notification ${editMode ? "updated" : "created"} successfully`
      );

      if (onSuccess) {
        onSuccess(res.data.data, editMode);
      }
    } catch (error) {
      console.error("Error submitting notification:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit notification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setCategoryLoading(true);
    try {
      const res = await axios.post("/api/notification?type=category", {
        data: newCategory.trim(),
      });
      const data = res.data.data;
      setCategories((prev) => [...prev, data]);
      setForm((prev) => ({ ...prev, category: data._id }));
      setNewCategory("");
      setAddCategoryMode(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.error("Failed to add category:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to add category. Please try again.";
      toast.error(errorMessage);
    } finally {
      setCategoryLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                onChange={handleChange}
                value={form.title}
                disabled={loading}
                placeholder="Enter notification title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                required
                onChange={handleChange}
                value={form.description}
                disabled={loading}
                placeholder="Enter brief description"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <div className="flex gap-2">
                <select
                  id="category"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onChange={handleChange}
                  value={form.category}
                  disabled={loading || categoryLoading}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddCategoryMode(true)}
                  disabled={loading || addCategoryMode}
                >
                  +
                </Button>
              </div>
            </div>

            {addCategoryMode && (
              <div className="flex gap-2 items-center p-3 border rounded-md bg-muted">
                <Input
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={categoryLoading}
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={categoryLoading}
                  size="sm"
                >
                  {categoryLoading ? "Adding..." : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setAddCategoryMode(false);
                    setNewCategory("");
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            )}

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                onChange={handleChange}
                value={form.department}
                disabled={loading}
                placeholder="Enter department name"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                onChange={handleChange}
                value={form.location}
                disabled={loading}
                placeholder="Enter location"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label>Content</Label>
            <div className="relative">
              <FroalaEditor
                content={form.content}
                onChange={handleContentChange}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pdfUrl">PDF URL</Label>
              <Input
                id="pdfUrl"
                onChange={handleChange}
                value={form.pdfUrl}
                disabled={loading}
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div>
              <Label htmlFor="applyUrl">Apply URL</Label>
              <Input
                id="applyUrl"
                onChange={handleChange}
                value={form.applyUrl}
                disabled={loading}
                placeholder="https://example.com/apply"
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                onChange={handleChange}
                value={form.websiteUrl}
                disabled={loading}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="loginUrl">Login URL</Label>
              <Input
                id="loginUrl"
                placeholder="https://example.com/login"
                value={form.loginUrl}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="resultUrl">Result URL</Label>
              <Input
                id="resultUrl"
                placeholder="https://example.com/result"
                value={form.resultUrl}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="admitCardUrl">Admit Card URL</Label>
              <Input
                id="admitCardUrl"
                placeholder="https://example.com/admit-card"
                value={form.admitCardUrl}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                onChange={handleChange}
                value={form.date}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="lastDate">Last Date</Label>
              <Input
                id="lastDate"
                type="date"
                onChange={handleChange}
                value={form.lastDate}
                disabled={loading}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                id="isVisible"
                type="checkbox"
                checked={form.isVisible}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label
                htmlFor="isVisible"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is Visible
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="isFeatured"
                type="checkbox"
                checked={form.isFeatured}
                onChange={handleChange}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label
                htmlFor="isFeatured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Is Featured
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-hidden flex">
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 border-r p-4 flex flex-col space-y-2">
        <h2 className="text-lg font-semibold mb-2">Notification Setup</h2>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`text-left px-4 py-2 rounded-md transition ${
              activeTab === index
                ? "bg-blue-100 dark:bg-blue-900 font-semibold text-blue-900 dark:text-blue-100"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            disabled={loading || categoryLoading}
          >
            {tab}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-8 overflow-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {editMode ? "Edit Notification" : "New Notification"}
          </h2>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" form="notification-form" disabled={loading}>
              {loading ? "Submitting..." : editMode ? "Update" : "Submit"}
            </Button>
          </div>
        </div>

        <form
          id="notification-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {renderTabContent()}
        </form>

        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveTab((prev) => Math.max(prev - 1, 0))}
            disabled={activeTab === 0 || loading}
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={() =>
              setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1))
            }
            disabled={activeTab === tabs.length - 1 || loading}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
