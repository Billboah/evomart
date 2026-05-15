
export type ProductType = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  rating: {
    rate: number;
    count: number;
  };
}
