import { ProductType } from "@/types";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// CART CONTEXT -------------------------------------------------------------

type CartItem = ProductType & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductType) => void;
  removeFromCart: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: ProductType) => {
    setCart((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

// PRODUCT CONTEXT ----------------------------------------------------------

const STORAGE_KEY = "products";

interface ProductContextType {
  products: ProductType[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<ProductType, "id">) => Promise<ProductType>;
  fetchProducts: () => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const getStoredProducts = (): ProductType[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const persistProducts = (items: ProductType[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const storedProducts = getStoredProducts();
      setProducts(storedProducts);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load products";
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedProducts = getStoredProducts();
      setProducts(storedProducts);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to refresh products";
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (
    product: Omit<ProductType, "id">
  ): Promise<ProductType> => {
    const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: ProductType = { id: nextId, ...product };
    const updated = [newProduct, ...products];
    setProducts(updated);
    persistProducts(updated);
    return newProduct;
  };

  const deleteProduct = async (id: number) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    persistProducts(updated);
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, error, addProduct, fetchProducts, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};
