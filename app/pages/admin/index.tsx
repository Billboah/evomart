import { useState, FormEvent, useEffect } from "react";
import { useProducts } from "@/context";
import { ProductType } from "@/types";

export default function AdminPage() {
  const { addProduct, products, loading: apiLoading } = useProducts();
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<
    Partial<ProductType> & {
      ratingRate?: number;
      ratingCount?: number;
      stock?: number;
      imageFile?: File | null;
    }
  >({
    imageFile: null,
  });

  const [preview, setPreview] = useState("");

  const convertFileToDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (imageMode === "upload" && form.imageFile) {
      convertFileToDataURL(form.imageFile)
        .then((dataUrl) => {
          setPreview(dataUrl);
          setForm((prev) => ({ ...prev, image: dataUrl }));
        })
        .catch((error) => {
          console.error("Unable to read image file", error);
          setPreview("");
        });
      return;
    }

    if (imageMode === "url" && form.image) {
      setPreview(form.image);
    } else {
      setPreview("");
    }
  }, [form.imageFile, form.image, imageMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numeric = ["price", "ratingRate", "ratingCount", "stock"];

    setForm(prev => ({
      ...prev,
      [name]: numeric.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !form.title ||
      !form.price ||
      !form.category ||
      !form.description ||
      form.ratingRate === undefined ||
      form.ratingCount === undefined ||
      form.stock === undefined ||
      (imageMode === "url" && !form.image) ||
      (imageMode === "upload" && !form.imageFile)
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const newProduct: Omit<ProductType, "id"> = {
        title: form.title.toString(),
        price: Number(form.price),
        description: form.description.toString(),
        category: form.category.toString(),
        image:
          imageMode === "upload"
            ? preview
            : form.image!.toString(),
        rating: {
          rate: Number(form.ratingRate),
          count: Number(form.ratingCount),
        },
        stock: Number(form.stock),
      };

      await addProduct(newProduct);
      setForm({ imageFile: null });
      setPreview("");
      setSuccessMessage("✓ Product added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("Failed to add product. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">Add and manage your product inventory</p>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT - FORM */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 h-fit top-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <div className="h-1 w-16 bg-blue-600 rounded mt-3"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Input label="Product Name" required>
                <input
                  name="title"
                  value={form.title || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter product name"
                />
              </Input>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price ($)" required>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price || ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="0.00"
                  />
                </Input>

                <Input label="Stock" required>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock ?? ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="0"
                  />
                </Input>
              </div>

              <Input label="Category" required>
                <input
                  name="category"
                  value={form.category || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Electronics"
                />
              </Input>

              <Input label="Description" required>
                <textarea
                  rows={3}
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  className="input resize-none"
                  placeholder="Describe your product..."
                />
              </Input>

              {/* Rating */}
              <div className="grid grid-cols-2 gap-4">
                <Input label="Rating (Stars)" required>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="ratingRate"
                    value={form.ratingRate ?? ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="4.5"
                  />
                </Input>

                <Input label="Ratings Count" required>
                  <input
                    type="number"
                    name="ratingCount"
                    value={form.ratingCount ?? ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="128"
                  />
                </Input>
              </div>

              {/* IMAGE MODE SWITCH */}
              <div>
                <label className="block font-semibold text-gray-900 mb-3">
                  Product Image <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`mode-btn ${imageMode === "url" ? "active" : ""}`}
                  >
                    🔗 URL
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageMode("upload")}
                    className={`mode-btn ${imageMode === "upload" ? "active" : ""}`}
                  >
                    📤 Upload
                  </button>
                </div>

                {imageMode === "url" ? (
                  <input
                    name="image"
                    value={form.image || ""}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com/image.jpg"
                  />
                ) : (
                  <label className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e =>
                        setForm(prev => ({
                          ...prev,
                          imageFile: e.target.files?.[0] || null,
                        }))
                      }
                      className="hidden"
                    />
                    <span>📁 Click to upload or drag image</span>
                  </label>
                )}

                {preview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-blue-200 shadow-md"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || apiLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
              >
                {submitting ? "Adding..." : "✓ Add Product"}
              </button>
            </form>
          </div>

          {/* RIGHT - PRODUCT LIST */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">
                Inventory ({products.length})
              </h2>
              <div className="h-1 w-16 bg-blue-600 rounded mt-3"></div>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-3 custom-scrollbar">
              {apiLoading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="inline-block animate-spin">⏳</div>
                  <p className="font-medium mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="font-medium">No products yet</p>
                  <p className="text-sm">Add your first product to get started</p>
                </div>
              ) : (
                products.map(p => (
                  <div
                    key={p.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200 group-hover:border-blue-300"
                        />
                        {p.stock === 0 && (
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">OUT OF STOCK</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
                            {p.title}
                          </h3>
                          <span className="text-xs font-semibold text-gray-500 flex-shrink-0">
                            #{p.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-lg font-bold text-blue-600">
                            ${p.price.toFixed(2)}
                          </p>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {p.category}
                          </span>
                        </div>

                        <div className="flex gap-3 text-xs text-gray-600 mb-2">
                          <span>⭐ {p.rating.rate.toFixed(1)} ({p.rating.count})</span>
                          <span className={`font-semibold ${p.stock === 0 ? "text-red-600" : "text-green-600"}`}>
                            📦 {p.stock}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-1">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 14px;
          outline: none;
          transition: all 0.2s;
          font-size: 14px;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .input::placeholder {
          color: #9ca3af;
        }
        .mode-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1.5px solid #e5e7eb;
          background: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .mode-btn:hover {
          border-color: #2563eb;
          background: #f0f9ff;
        }
        .mode-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .upload-box {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          display: block;
          background: #fafafa;
        }
        .upload-box:hover {
          border-color: #2563eb;
          background: #f0f9ff;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}

function Input({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-semibold text-gray-900 mb-2">
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}