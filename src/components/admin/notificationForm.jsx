"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function NotificationForm({ formData, editMode, currentEditId, onSuccess, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    content: "",
    category: "",
    department: "",
    location: "",
    pdfUrl: "",
    applyUrl: "",
    websiteUrl: "",
    lastDate: "",
    ...formData
  });
  
  console.log(currentEditId)

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
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find(cat => cat._id === form.category);
    const dataToSend = { ...form, category: selectedCategory };

    try {
      if (editMode) {
        const res = await axios.put(`/api/notification/${currentEditId}`, dataToSend);
        toast.success("Notification updated successfully");
        onSuccess(res.data.data, true);
      } else {
        const res = await axios.post("/api/notification", { data: dataToSend });
        toast.success("Notification created successfully");
        onSuccess(res.data.data, false);
      }
    } catch (error) {
      console.error("Error submitting notification:", error);
      toast.error("Failed to submit notification. Please try again.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await axios.post("/api/notification?type=category", { data: newCategory });
      const data = res.data.data;
      setCategories((prev) => [...prev, data]);
      setForm((prev) => ({ ...prev, category: data._id }));
      setNewCategory("");
      setAddCategoryMode(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error("Failed to add category. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "Edit Notification" : "Add New Notification"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" required onChange={handleChange} value={form.title} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" required onChange={handleChange} value={form.description} />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" onChange={handleChange} value={form.content} />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2">
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                onChange={handleChange}
                value={form.category}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" size="sm" onClick={() => setAddCategoryMode(true)}>
                +
              </Button>
            </div>
          </div>

          {addCategoryMode && (
            <div className="flex gap-2 items-center">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" onClick={handleAddCategory}>Add</Button>
              <Button type="button" variant="outline" onClick={() => setAddCategoryMode(false)}>
                Cancel
              </Button>
            </div>
          )}

          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" onChange={handleChange} value={form.department} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" onChange={handleChange} value={form.location} />
          </div>
          <div>
            <Label htmlFor="pdfUrl">PDF URL</Label>
            <Input id="pdfUrl" onChange={handleChange} value={form.pdfUrl} />
          </div>
          <div>
            <Label htmlFor="applyUrl">Apply URL</Label>
            <Input id="applyUrl" onChange={handleChange} value={form.applyUrl} />
          </div>
          <div>
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input id="websiteUrl" onChange={handleChange} value={form.websiteUrl} />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" onChange={handleChange} value={form.date} />
          </div>
          <div>
            <Label htmlFor="lastDate">Last Date</Label>
            <Input id="lastDate" type="date" onChange={handleChange} value={form.lastDate} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {editMode ? "Update Notification" : "Add Notification"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}