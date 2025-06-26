"use client";

// Core React imports
import { useState, useEffect } from "react";
import OverviewTab from "@/components/admin/overview"
import NotificationsTab from "@/components/admin/notificationTab"
import ProductTab from "@/components/admin/productTab"

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
import OrdersAdmin from "../../components/store/order-admin";
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
    { id: "orders", label: "Orders" },
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
  digitalUrl: "", // <--- NEW for PDFs or digital files
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

  const [productFormDataState, setProductFormDataState] =
    useState(productFormData);

  // Notifications effects
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/notification?type=category");
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
        const res = await axios.put(`/api/notification/${currentEditId}`, dataToSend);
        setNotifications((prev) =>
          prev.map((not) =>
            not._id === currentEditId
              ? { ...not, ...formData, category: selectedCategory }
              : not
          )
        );
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
      const res = await axios.patch(`/api/notification/${id}`);
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
      const res = await axios.delete(`/api/notification/${id}`);

      if (!res.data.success){
        toast.error(res.data.message)
      }

      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted successfully!");
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error("Failed to delete notification");
    }
  };

  // ============================================================= PRODUCTS TAB =============================================================
  // Products handlers (to be implemented)
  // Add product-related handlers here when needed

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

    if (showProductForm) fetchCategories();
  }, [showProductForm]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/product"); 
        const data = await res.data.data;
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
        const res = await axios.put(`/api/product/${currentEditProductId}`, dataToSend);
        setProduct((prev) =>
          prev.map((not) =>
            not._id === currentEditProductId
              ? { ...not, ...productFormDataState, category: selectedCategory }
              : not
          )
        );
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
        const res = await axios.post("/api/product",{data:dataToSend});
        const newNotification = res.data.data
        setProduct((prev) => [...prev, newNotification]);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
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

      const mime = file.type;
      let updateKey = "";

      if (mime.startsWith("image/")) {
        updateKey = "image";
      } else if (mime === "application/pdf") {
        updateKey = "digitalUrl";
      } else {
        throw new Error("Unsupported file type");
      }

      setProductFormDataState((prev) => ({
        ...prev,
        [updateKey]: data.url,
      }));

      toast.success(`${updateKey === "image" ? "Image" : "PDF"} uploaded successfully`);
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
      const res = await axios.post("/api/product?type=category",{data:newProductCategory});
      const data = res.data.data
      setProductCategories((prev) => [...prev, data]);
      setProductFormDataState((prev) => ({ ...prev, category: data._id }));
      setNewProductCategory("");
      setAddProductCategoryMode(false);
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

  const handleProductToggleVisibility = async (id) => {
    try {
      const res = await axios.patch(`/api/product/${id}`);
      const updated = await res.data.data;
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
      const res = await axios.delete(`/api/product/${id}`);

      if (!res.data.success){
        toast.error(res.data.message)
      };

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
      {activeTab === "overview" && <OverviewTab />}

      {/* Notifications Tab */}
      {activeTab === "notifications" && <NotificationsTab />}


      {/* Products Tab */}
      {activeTab === "products" && <ProductTab />}



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
      {activeTab === "orders" && (
        <OrdersAdmin />
      )}
    </div>
  );
}
