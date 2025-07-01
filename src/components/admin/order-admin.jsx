// app/components/admin/OrdersAdmin.js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data.data);
      console.log(res.data.data)
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusSelect = (order, newStatus) => {
    if (order.status === newStatus) return;
    setSelectedOrder(order);
    setStatusToUpdate(newStatus);
  };

  const confirmStatusChange = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/admin/orders/${selectedOrder._id}`, {
        status: statusToUpdate,
      });
      toast.success("Status updated");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, status: statusToUpdate } : o
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setSelectedOrder(null);
      setStatusToUpdate(null);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <h2 className="text-xl font-semibold">Manage Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-4 max-w-xs truncate">
                    {order.customerName}
                  </td>
                  <td className="p-4">{order.customerEmail}</td>
                  <td className="p-4">
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) =>
                        handleStatusSelect(order, newStatus)
                      }
                      disabled={["delivered", "cancelled"].includes(
                        order.status
                      )}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "pending",
                          "paid",
                          "processing",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-4">₹{order.price.total}</td>
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && !statusToUpdate && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm">
                  Customer: {selectedOrder.customerName}
                </p>
                <p className="text-sm">Email: {selectedOrder.customerEmail}</p>
                <p className="text-sm">Phone: {selectedOrder.customerPhone}</p>
              </div>
              <div className="border rounded-md p-3">
                <h3 className="font-semibold mb-2">Items:</h3>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.product?.title || "Deleted Product"}</span>
                    <span>x {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="text-right space-y-1">
                <p>Subtotal: ₹{selectedOrder.price.subtotal}</p>
                <p>Discount: ₹{selectedOrder.price.discount}</p>
                <p>Shipping: ₹{selectedOrder.price.shipping}</p>
                <p className="font-bold">Total: ₹{selectedOrder.price.total}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedOrder && statusToUpdate && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                Are you sure you want to change the status of order{" "}
                <b>#{selectedOrder._id.slice(-5)}</b> to {statusToUpdate}?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>

                {loading ? (
                  <Button disabled className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </Button>
                ) : (
                  <Button onClick={confirmStatusChange}>Confirm</Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
