import { useRouter } from "next/router";
import { useMemo } from "react";
import ProductDetailClient from "@/components/productDetailClient";
import { useProducts } from "@/context";
import { ProductType } from "@/types";

export default function ProductDetailPage() {
  const router = useRouter();
  const { products, loading } = useProducts();

  const product = useMemo<ProductType | undefined>(() => {
    if (!router.isReady) return undefined;
    const id = Number(router.query.id);
    if (Number.isNaN(id)) return undefined;
    return products.find((p) => p.id === id);
  }, [products, router.isReady, router.query.id]);

  if (!router.isReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <p className="text-2xl mb-2">⏳</p>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6 text-gray-600">
            We couldn&apos;t find the product you&apos;re looking for.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
