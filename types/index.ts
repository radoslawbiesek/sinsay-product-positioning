type Response<T> = {
  data: T;
};

export type ProductData = {
  sku: string;
  url: string;
  imageUrl: string;
  title: string;
  prices: [string] | [string, string];
};

export type ProductDetails = {
  sizes: string[];
};

export type ProductResponse = Response<ProductDetails>;
export type ProductsResponse = Response<ProductData[]>;
