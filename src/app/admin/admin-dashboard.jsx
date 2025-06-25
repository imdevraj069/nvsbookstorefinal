"use client";

// Core React imports
import { useState, useEffect } from "react";

// Icon imports
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  FileText,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import axios from "axios";

// UI Component imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// External imports
import toast from "react-hot-toast";
import {
  createNotificationHandler,
  // updateNotificationHandler,
} from "@/handler/notification";
// import {
//   createProductHandler,
//   updateProductnHandler,
//   createProductCatHandler,
// } from "../../handler/product";
import Image from "next/image";

export default function AdminDashboard() {
  // Common state
  const [activeTab, setActiveTab] = useState("overview");

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "notifications", label: "Notifications" },
    { id: "products", label: "Products" },
    { id: "users", label: "Users" },
    { id: "analytics", label: "Analytics" },
  ];

  // ==================== OVERVIEW TAB ====================
  // Overview constants
  const [products, setProduct] = useState([]);

  // Overview state
  const [notifications, setNotifications] = useState([]);

  // Overview stats (depends on notifications and products)

  const stats = [
    {
      title: "Total Notifications",
      value: notifications.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Monthly Revenue",
      value: "₹45,678",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
  ];

  // ==================== NOTIFICATIONS TAB ====================
  // Notifications state
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const notificationformData = {
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
  };
  const [formData, setFormData] = useState(notificationformData);

  // ==================== NOTIFICATIONS TAB ====================
  // Notifications state
  const [showProductForm, setShowProductForm] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [newProductCategory, setNewProductCategory] = useState("");
  const [addProductCategoryMode, setAddProductCategoryMode] = useState(false);
  const [editProductMode, setEditProductMode] = useState(false);
  const [currentEditProductId, setCurrentEditProductId] = useState(null);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [uploading, setUploading] = useState(false);

  const productFormData = {
    title: "",
    description: "",
    price: null,
    originalPrice: "",
    longDescription: "",
    image: "",
    images: [],
    rating: 4,
    category: "",
    stock: null,
    isDigital: false,
    isVisible: true,
    author: "",
    publisher: "",
    pages: null,
    language: [],
    isbn: "",
    specifications: {},
  };
  const [productFormDataState, setProductFormDataState] =
    useState(productFormData);

  // Notifications effects
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/notification?type=category");
        console.log(res)
        const data = await res.data.data;
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    if (showNotificationForm) fetchCategories();
  }, [showNotificationForm]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notification");
        const data = await res.data.data;
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  // Notifications handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNotfSubmitForm = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find(
      (cat) => cat._id === formData.category
    );

    const dataToSend = {
      ...formData,
      category: selectedCategory,
    };

    if (editMode) {
      try {
        // const res = await updateNotificationHandler(currentEditId, dataToSend);
        // setNotifications((prev) =>
        //   prev.map((not) =>
        //     not._id === currentEditId
        //       ? { ...not, ...formData, category: selectedCategory }
        //       : not
        //   )
        // );
        toast.success("Notification updated successfully");
      } catch (error) {
        console.error("Error updating notification:", error);
        toast.error("Failed to update notification. Please try again.");
      } finally {
        setFormData([]);
        setEditMode(false);
        setCurrentEditId(null);
        setShowNotificationForm(false);
      }
    } else {
      try {
        const res = await axios.post("/api/notification",{data:dataToSend});
        const newNotification = res.data.data;
        setNotifications((prev) => [...prev, newNotification]);
        toast.success("Notification created successfully");
      } catch (err) {
        console.error("Failed to add notification", err);
        toast.error("Failed to add notification. Please try again.");
      } finally {
        setFormData([]);
        setShowNotificationForm(false);
      }
    }
  };

  const handleAddNotfCat = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await axios.post("/api/notification?type=category",{data:newCategory});
      const data = res.data.data
      console.log(data)
      setCategories((prev) => [...prev, data]);
      setFormData((prev) => ({ ...prev, category: data._id }));
      setNewCategory("");
      setAddCategoryMode(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error(err.message || "Failed to add category. Please try again.");
    }
  };

  const handleEdit = (notification) => {
    setFormData({
      title: notification.title,
      description: notification.description,
      content: notification.content,
      category: notification.category?._id,
      department: notification.department,
      location: notification.location,
      pdfUrl: notification.pdfUrl,
      applyUrl: notification.applyUrl,
      websiteUrl: notification.websiteUrl,
      date: notification.date?.slice(0, 10),
      lastDate: notification.lastDate?.slice(0, 10),
    });
    setCurrentEditId(notification._id);
    setEditMode(true);
    setShowNotificationForm(true);
  };

  const dunplicateNotifiation = async (notification) =>{
    const {_id, ...data} = notification;

    try {
      const res = await axios.post("api/notification", {data});
      const newNotification = res.data.data;
      setNotifications((prev) => [...prev, newNotification]);
      toast.success("Notification duplicated successfully");
    } catch (err) {
      console.error("Failed to duplicate notification", err);
      toast.error("Failed to add notification. Please try again.");
    } finally {
      setFormData([]);
    }

  }

  const handleToggleVisibility = async (id) => {
    try {
      console.log(id)
      const res = await axios.patch(`/api/notification/${id}`);
      if(!res.data.success){
        toast.error(res.data.message)
      }

      const updated = await res.data.data;
      toast.success("Notification visibility updated successfully!");
      setNotifications((prev) =>
        prev.map((not) =>
          not._id === id ? { ...not, isVisible: updated.isVisible } : not
        )
      );
    } catch (err) {
      console.error("Visibility toggle failed:", err);
      toast.error("Failed to update notification visibility");
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const res = await fetch(`/api/notification/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete notification");

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted successfully!");
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error("Failed to delete notification");
    }
  };

  // ==================== PRODUCTS TAB ====================
  // Products handlers (to be implemented)
  // Add product-related handlers here when needed

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/product?type=category");
        const data = await res.json();
        setProductCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    if (showProductForm) fetchCategories();
  }, [showProductForm]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/product?type=product");
        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const selectedCategory = productCategories.find(
      (cat) => cat._id === productFormDataState.category
    );

    const dataToSend = {
      ...productFormDataState,
      category: selectedCategory,
    };
    if (editProductMode) {
      try {
        // const res = await updateProductnHandler(currentEditProductId, dataToSend);
        // setProduct((prev) =>
        //   prev.map((not) =>
        //     not._id === currentEditProductId
        //       ? { ...not, ...productFormDataState, category: selectedCategory }
        //       : not
        //   )
        // );
        toast.success("Product updated successfully");
      } catch (error) {
        console.error("Error updating notification:", error);
        toast.error("Failed to update notification. Please try again.");
      } finally {
        setProductFormDataState([]);
        setEditProductMode(false);
        setCurrentEditProductId(null);
        setShowProductForm(false);
      }
    } else {
      try {
        // const newNotification = await createProductHandler(dataToSend);
        // setProduct((prev) => [...prev, newNotification]);
        toast.success("Notification created successfully");
      } catch (err) {
        console.error("Failed to add notification", err);
        toast.error("Failed to add notification. Please try again.");
      } finally {
        setFormData([]);
        setShowProductForm(false);
      }
    }
  };

  const handleProductChange = (e) => {
    const { id, value, type, checked } = e.target;
    setProductFormDataState((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setProductFormDataState((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newSpecKey.trim()]: newSpecValue.trim(),
      },
    }));
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleImageChange = async (e) => {
    setUploading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file); // Don't stringify or manipulate here

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      toast.success(" Image uploaded successfully");
      setProductFormDataState((prev) => ({ ...prev, image: data.url }));
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
      // const data = await createProductCatHandler(newProductCategory);
      // setProductCategories((prev) => [...prev, data]);
      // setProductFormDataState((prev) => ({ ...prev, category: data._id }));
      // setNewProductCategory("");
      // setAddProductCategoryMode(false);
      toast.success("Category created successfully");
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error(err.message || "Failed to add category. Please try again.");
    }
  };

  const handleProductEdit = (product) => {
    setProductFormDataState(product);
    setCurrentEditProductId(product._id);
    setEditProductMode(true);
    setShowProductForm(true)

  }

  const handleProductToggleVisibility = async (id, currentVisibility) => {
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });

      if (!res.ok) throw new Error("Failed to update visibility");

      const updated = await res.json();
      toast.success("Product visibility updated successfully!");
      setProduct((prev) =>
        prev.map((not) =>
          not._id === id ? { ...not, isVisible: updated.isVisible } : not
        )
      );
    } catch (err) {
      console.error("Visibility toggle failed:", err);
      toast.error("Failed to update notification visibility");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProduct((prev) => prev.filter((n) => n._id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error("Failed to delete product");
    }
  };

  // ==================== USERS TAB ====================
  // Users handlers (to be implemented)
  // Add user-related handlers here when needed

  // ==================== ANALYTICS TAB ====================
  // Analytics handlers (to be implemented)
  // Add analytics-related handlers here when needed

  // ==================== RENDER ====================
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {/* Commented out as in original - can be uncommented when needed */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">New notification published</p>
                  <p className="text-sm text-muted-foreground">
                    UPSC Civil Services Results
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Product added to store</p>
                  <p className="text-sm text-muted-foreground">
                    SSC CGL Study Material
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  5 hours ago
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">User registered</p>
                  <p className="text-sm text-muted-foreground">
                    New user signup
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}

      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-semibold">
                Manage Notifications
              </h2>
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setShowNotificationForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Notification
              </Button>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 sm:p-4">Title</th>
                    <th className="text-left p-3 sm:p-4">Category</th>
                    <th className="text-left p-3 sm:p-4">Department</th>
                    <th className="text-left p-3 sm:p-4">Date</th>
                    <th className="text-left p-3 sm:p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification._id} className="border-b">
                      <td className="p-3 sm:p-4 max-w-[180px] truncate">
                        {notification.title}
                      </td>
                      <td className="p-3 sm:p-4">
                        <Badge variant="outline" className="text-xs">
                          {notification.category.name}
                        </Badge>
                      </td>
                      <td className="p-3 sm:p-4 max-w-[160px] truncate">
                        {notification.department}
                      </td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        {new Date(notification.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleToggleVisibility(
                                notification._id,
                                notification.isVisible
                              )
                            }
                          >
                            {!notification.isVisible ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(notification)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() =>
                              handleDeleteNotification(notification._id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              dunplicateNotifiation(notification)
                            }
                          >
                            <FileText className="h-4 w-4 text-blue-300" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Notification Form Modal */}
      {showNotificationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Notification" : "Add New Notification"}
            </h2>
            <form onSubmit={handleNotfSubmitForm} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  onChange={handleChange}
                  value={formData.title || ""}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  onChange={handleChange}
                  value={formData.description || ""}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  onChange={handleChange}
                  value={formData.content || ""}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <select
                    id="category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    onChange={handleChange}
                    value={formData.category || ""}
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
                  >
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
                  <Button type="button" onClick={handleAddNotfCat}>
                    Add
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

              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  onChange={handleChange}
                  value={formData.department || ""}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  onChange={handleChange}
                  value={formData.location || ""}
                />
              </div>
              <div>
                <Label htmlFor="pdfUrl">PDF URL</Label>
                <Input
                  id="pdfUrl"
                  onChange={handleChange}
                  value={formData.pdfUrl || ""}
                />
              </div>
              <div>
                <Label htmlFor="applyUrl">Apply URL</Label>
                <Input
                  id="applyUrl"
                  onChange={handleChange}
                  value={formData.applyUrl || ""}
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  onChange={handleChange}
                  value={formData.websiteUrl || ""}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  onChange={handleChange}
                  value={formData.date || ""}
                />
              </div>
              <div>
                <Label htmlFor="lastDate">Last Date</Label>
                <Input
                  id="lastDate"
                  type="date"
                  onChange={handleChange}
                  value={formData.lastDate || ""}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editMode ? "Update Notification" : "Add Notification"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData([]);
                    setShowNotificationForm(false);
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6 border-b">
              <h2 className="text-xl font-semibold">Manage Products</h2>
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setShowProductForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Products
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4">Title</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b">
                      <td className="p-4">
                        <div className="max-w-xs truncate">{product.title}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{product.category.name}</Badge>
                      </td>
                      <td className="p-4">₹{product.price}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            product.stock != 0 ? "default" : "destructive"
                          }
                        >
                          {product.stock !== 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                          size="sm" variant="ghost"
                          onClick={() =>{
                            handleProductToggleVisibility(
                              product._id,
                              product.isVisible
                            )
                          }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                          size="sm" variant="ghost"
                          onClick={() =>{
                            handleProductEdit(product)
                          }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() =>{
                              handleDeleteProduct(product._id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editProductMode? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  onChange={handleProductChange}
                  value={productFormDataState.title || ""}
                />
              </div>
              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  onChange={handleProductChange}
                  value={productFormDataState.description || ""}
                />
              </div>
              <div>
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  onChange={handleProductChange}
                  value={productFormDataState.longDescription || ""}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <select
                    id="category"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    onChange={handleProductChange}
                    value={productFormDataState.category || ""}
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
                    +
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    onChange={handleProductChange}
                    value={productFormDataState.price || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    onChange={handleProductChange}
                    value={productFormDataState.originalPrice || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    onChange={handleProductChange}
                    value={productFormDataState.stock || 0}
                  />
                </div>
                <div>
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    onChange={handleProductChange}
                    value={productFormDataState.pages || 0}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    onChange={handleProductChange}
                    value={productFormDataState.author || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    onChange={handleProductChange}
                    value={productFormDataState.publisher || ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="language">Language (comma separated)</Label>
                <Input
                  id="language"
                  onChange={(e) =>
                    setProductFormDataState((prev) => ({
                      ...prev,
                      language: e.target.value.split(",").map((l) => l.trim()),
                    }))
                  }
                  value={productFormDataState.language?.join(", ") || ""}
                />
              </div>

              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  onChange={handleProductChange}
                  value={productFormDataState.isbn || ""}
                />
              </div>

              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                {uploading &&(
                  <p
                   className="text-white "
                  >Uploading</p>
                )}
                {productFormDataState.image && (
                  <Image
                    src={productFormDataState.image}
                    alt="Preview"
                    width={0}
                    height={120}
                    sizes="100vw"
                    className="mt-2 h-[120px] w-auto object-contain"
                  />
                )}
              </div>

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
                    +
                  </Button>
                </div>
                <ul className="text-sm text-muted-foreground">
                  {Object.entries(
                    productFormDataState.specifications || {}
                  ).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1"
                disabled={uploading}>
                  {editProductMode? 'Edit Product': 'Create Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>{
                    setShowProductForm(false)
                    setProductFormDataState(productFormData)
                    setEditProductMode(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {/* Commented out as in original - can be uncommented when needed */}
      {/* {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="text-muted-foreground">User management features will be implemented here.</p>
          </div>
        </div>
      )} */}

      {/* Analytics Tab */}
      {/* Commented out as in original - can be uncommented when needed */}
      {/* {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics & Reports</h2>
            <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
          </div>
        </div>
      )} */}
    </div>
  );
}
