"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import RichEditor from "@/utils/RichEditor";

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
    loginUrl: "", // ✅ Add this
    resultUrl: "", // ✅ Add this
    admitCardUrl: "", // ✅ Add this
    lastDate: "",
    date: "",
    isVisible: true,
    isFeatured: false,
    ...formData,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/notification?type=category");
      setCategories(res.data.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const selectedCategory = categories.find(
      (cat) => cat._id === form.category
    );
    const dataToSend = { ...form, category: selectedCategory };

    try {
      const res = editMode
        ? await axios.put(`/api/notification/${currentEditId}`, dataToSend)
        : await axios.post("/api/notification", { data: dataToSend });

      toast.success(
        `Notification ${editMode ? "updated" : "created"} successfully`
      );
      onSuccess(res.data.data, editMode);
    } catch (error) {
      console.error("Error submitting notification:", error);
      toast.error("Failed to submit notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setCategoryLoading(true);
    try {
      const res = await axios.post("/api/notification?type=category", {
        data: newCategory,
      });
      const data = res.data.data;
      setCategories((prev) => [...prev, data]);
      setForm((prev) => ({ ...prev, category: data._id }));
      setNewCategory("");
      setAddCategoryMode(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setCategoryLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              onChange={handleChange}
              value={form.title}
              disabled={loading}
            />

            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              required
              onChange={handleChange}
              value={form.description}
              disabled={loading}
            />
          </>
        );
      case 1:
        return (
          <>
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2">
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
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
                disabled={loading}
              >
                +
              </Button>
            </div>

            {addCategoryMode && (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={categoryLoading}
                >
                  {categoryLoading ? "Adding..." : "Add"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddCategoryMode(false)}
                >
                  Cancel
                </Button>
              </div>
            )}

            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              onChange={handleChange}
              value={form.department}
              disabled={loading}
            />

            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              onChange={handleChange}
              value={form.location}
              disabled={loading}
            />
          </>
        );
      case 2:
        return (
          <>
            <RichEditor
              content={form.content}
              onChange={(html) =>
                setForm((prev) => ({ ...prev, content: html }))
              }
            />
          </>
        );
      case 3:
        return (
          <>
            <Label htmlFor="pdfUrl">PDF URL</Label>
            <Input
              id="pdfUrl"
              onChange={handleChange}
              value={form.pdfUrl}
              disabled={loading}
            />

            <Label htmlFor="applyUrl">Apply URL</Label>
            <Input
              id="applyUrl"
              onChange={handleChange}
              value={form.applyUrl}
              disabled={loading}
            />

            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              onChange={handleChange}
              value={form.websiteUrl}
              disabled={loading}
            />

            <Label htmlFor="loginUrl">Login URL</Label>
            <Input
              id="loginUrl"
              placeholder="Enter Login URL"
              value={form.loginUrl || ""}
              onChange={handleChange}
              disabled={loading}
            />

            <Label htmlFor="resultUrl">Result URL</Label>
            <Input
              id="resultUrl"
              placeholder="Enter Result URL"
              value={form.resultUrl || ""}
              onChange={handleChange}
              disabled={loading}
            />

            <Label htmlFor="admitCardUrl">Admit Card URL</Label>
            <Input
              id="admitCardUrl"
              placeholder="Enter Admit Card URL"
              value={form.admitCardUrl || ""}
              onChange={handleChange}
              disabled={loading}
            />
          </>
        );

      case 4:
        return (
          <>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              onChange={handleChange}
              value={form.date}
              disabled={loading}
            />

            <Label htmlFor="lastDate">Last Date</Label>
            <Input
              id="lastDate"
              type="date"
              onChange={handleChange}
              value={form.lastDate}
              disabled={loading}
            />
          </>
        );
      case 5:
        return (
          <>
            <div className="flex items-center space-x-2">
              <input
                id="isVisible"
                type="checkbox"
                checked={form.isVisible}
                onChange={handleChange}
                disabled={loading}
              />
              <Label htmlFor="isVisible">Is Visible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isfeatured"
                type="checkbox"
                checked={form.isfeatured}
                onChange={handleChange}
                disabled={loading}
              />
              <Label htmlFor="isfeatured">Is Featured</Label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex">
      <aside className="w-64 bg-gray-100 border-r p-4 flex flex-col space-y-2">
        <h2 className="text-lg font-semibold mb-2">Notification Setup</h2>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`text-left px-4 py-2 rounded-md transition ${
              activeTab === index
                ? "bg-blue-100 font-semibold"
                : "hover:bg-gray-200"
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
          className="space-y-4"
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
