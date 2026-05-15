import ProductCard from "@/components/productCard";
import { useProducts } from "@/context";

export default function Home() {
  const { products, loading } = useProducts();

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">⏳</p>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">📦</p>
            <p className="text-gray-600">No products available. Start by adding one in the admin panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
