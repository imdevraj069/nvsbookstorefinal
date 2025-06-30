"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, Star } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import NotificationForm from "./notificationForm";

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/api/notification");
      setNotifications(res.data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
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
      isVisible: notification.isVisible,
      isfeatured: notification.isfeatured,
      lastDate: notification.lastDate?.slice(0, 10),
      ...notification,
    });
    setCurrentEditId(notification._id);
    setEditMode(true);
    setShowNotificationForm(true);
  };

  const duplicateNotification = async (notification) => {
    const { _id, ...data } = notification;
    try {
      const res = await axios.post("/api/notification", { data });
      const newNotification = res.data.data;
      setNotifications((prev) => [...prev, newNotification]);
      toast.success("Notification duplicated successfully");
    } catch (err) {
      console.error("Failed to duplicate notification", err);
      toast.error("Failed to duplicate notification. Please try again.");
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const res = await axios.delete(`/api/notification/${id}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted successfully!");
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error("Failed to delete notification");
    }
  };

  const handleFormSuccess = (newNotification, isEdit) => {
    if (isEdit) {
      setNotifications((prev) =>
        prev.map((not) =>
          not._id === currentEditId ? { ...not, ...newNotification } : not
        )
      );
    } else {
      setNotifications((prev) => [...prev, newNotification]);
    }
    setShowNotificationForm(false);
    setEditMode(false);
    setCurrentEditId(null);
    setFormData({});
  };

  const toggleField = async(id, field) => {
    try {
      const response = await axios.patch("/api/notification/", {
        id,
        field
      });

      if (response.data.success) {
        const updated = response.data.data;
        toast.success("✅ Toggled:", field);
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === id
              ? { ...notification, [field]: updated[field] }
              : notification
          )
        );
      } else {
        toast.error("⚠️ Toggle failed:", response.data.message);
      }

      return response.data;
    } catch (err) {
      toast.error("❌ API error:", err);
      return { success: false, message: "Request failed" };
      console.log(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
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

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 sm:p-4">Title</th>
                <th className="text-left p-3 sm:p-4">Category</th>
                <th className="text-left p-3 sm:p-4">Department</th>
                <th className="text-left p-3 sm:p-4">Date</th>
                <th className="text-left p-3 sm:p-4">Status</th>
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
                      {notification.category?.name}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4 max-w-[160px] truncate">
                    {notification.department}
                  </td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    {new Date(notification.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={
                          notification.isVisible ? "default" : "secondary"
                        }
                        className="text-xs w-fit"
                      >
                        {notification.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                      {notification.isfeatured && (
                        <Badge variant="outline" className="text-xs w-fit">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleField(notification._id, "isVisible")}
                        title="Toggle Visibility"
                      >
                        {!notification.isVisible ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleField(notification._id, "isfeatured")}
                        title="Toggle Featured"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            notification.isfeatured
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
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
                        onClick={() => duplicateNotification(notification)}
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

      {showNotificationForm && (
        <NotificationForm
          formData={formData}
          editMode={editMode}
          currentEditId={currentEditId}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowNotificationForm(false);
            setEditMode(false);
            setCurrentEditId(null);
            setFormData({});
          }}
        />
      )}
    </div>
  );
}
