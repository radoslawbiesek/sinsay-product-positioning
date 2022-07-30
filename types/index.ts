type Response<T> = {
  data: T;
};

type Price = { currency: string; value: number };

export type ProductData = {
  sku: string;
  url: string;
  imageUrl: string;
  title: string;
  prices: Price[];
};

export type ProductDetails = {
  sizes: string[];
};

export type ProductsResponse = Response<ProductData[]>;
