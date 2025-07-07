"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Star,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import ProductForm from "./productForm";
import Image from "next/image";

export default function ProductTab() {
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product");
      setProducts(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      longDescription: product.longDescription,
      image: product.image,
      images: product.images,
      digitalUrl: product.digitalUrl,
      rating: product.rating,
      category: product.category?._id,
      stock: product.stock,
      isDigital: product.isDigital,
      isVisible: product.isVisible,
      isFeatured: product.isFeatured,
      author: product.author,
      publisher: product.publisher,
      pages: product.pages,
      language: product.language,
      isbn: product.isbn,
      specifications: product.specifications,
      ...product
    });
    setCurrentEditId(product._id);
    setEditMode(true);
    setShowProductForm(true);
  };

  const duplicateProduct = async (product) => {
    const { _id, createdAt, updatedAt, ...data } = product;
    try {
      const res = await axios.post("/api/product", { data });
      const newProduct = res.data.data;
      setProducts((prev) => [...prev, newProduct]);
      toast.success("Product duplicated successfully");
    } catch (err) {
      console.error("Failed to duplicate product", err);
      toast.error("Failed to duplicate product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await axios.delete(`/api/product/${id}`);
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Deletion error:", err);
      toast.error("Failed to delete product");
    }
  };

  const handleFormSubmit = async (productData) => {
    try {
      if (editMode) {
        const res = await axios.put(`/api/product/${currentEditId}`, productData);
        toast.success("Product updated successfully");
        setProducts((prev) =>
          prev.map((product) =>
            product._id === currentEditId ? { ...product, ...res.data.data } : product
          )
        );
      } else {
        const res = await axios.post("/api/product", { data: productData });
        toast.success("Product created successfully");
        setProducts((prev) => [...prev, res.data.data]);
      }
      handleFormClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to submit product. Please try again.");
      throw error; // Re-throw to let ProductForm handle it
    }
  };

  const handleFormClose = () => {
    setShowProductForm(false);
    setEditMode(false);
    setCurrentEditId(null);
    setFormData({});
  };

  async function toggleField(id, field) {
    try {
      const response = await axios.patch("/api/product/", {
        id,
        field
      });

      if (response.data.success) {
        const updated = response.data.data
        toast.success("✅ Toggled:", field);
        setProducts((prev) =>
          prev.map((product) =>
            product._id === id ? { ...product, [field]: updated[field] } : product
          )
        );
      } else {
        toast.error("⚠️ Toggle failed:", response.data.message);
      }

      return response.data;
    } catch (err) {
      toast.error("❌ API error:", err);
      return { success: false, message: "Request failed" };
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">
            Manage Products
          </h2>
          <Button
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setShowProductForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 sm:p-4">Image</th>
                <th className="text-left p-3 sm:p-4">Title</th>
                <th className="text-left p-3 sm:p-4">Category</th>
                <th className="text-left p-3 sm:p-4">Date</th>
                <th className="text-left p-3 sm:p-4">Price</th>
                <th className="text-left p-3 sm:p-4">Stock</th>
                <th className="text-left p-3 sm:p-4">Status</th>
                <th className="text-left p-3 sm:p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-3 sm:p-4">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="p-3 sm:p-4 max-w-[180px] truncate">
                    {product.title}
                  </td>
                  <td className="p-3 sm:p-4">
                    <Badge variant="outline" className="text-xs">
                      {product.category?.name}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4">
                    <Badge variant="outline" className="text-xs">
                      {product.date?.slice(0, 10)}
                    </Badge>
                  </td>

                  <td className="p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="font-medium">₹{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <Badge 
                      variant={product.stock > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {product.isDigital ? "Digital" : product.stock || 0}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex flex-col gap-1">
                      <Badge 
                        variant={product.isVisible ? "default" : "secondary"}
                        className="text-xs w-fit"
                      >
                        {product.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                      {product.isFeatured && (
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
                        onClick={() => toggleField(product._id, "isVisible")}
                        title="Toggle Visibility"
                      >
                        {!product.isVisible ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleField(product._id, "isFeatured")}
                        title="Toggle Featured"
                      >
                        <Star 
                          className={`w-4 h-4 ${
                            product.isFeatured 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-muted-foreground"
                          }`} 
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                        title="Edit Product"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteProduct(product._id)}
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => duplicateProduct(product)}
                        title="Duplicate Product"
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

      {showProductForm && (
        <ProductForm
          isOpen={showProductForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editMode={editMode}
          initialData={formData}
        />
      )}
    </div>
  );
}