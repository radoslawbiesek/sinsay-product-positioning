type Response<T> = {
  data: T;
};

export type ProductData = {
  sku: string;
  url: string;
  imageUrl: string;
  title: string;
  prices: string[];
};

export type ProductDetails = {
  sizes: string[];
};

export type ProductsResponse = Response<ProductData[]>;
