type Price = { currency: string; value: number };

export type ProductData = {
  id: string;
  sku: string;
  url: string;
  imageUrl: string;
  title: string;
  currentPrice: number;
  regularPrice: number;
  currency: string;
};

export type ProductDetails = {
  sizes: string[];
  isLowInStock: boolean;
};

export type FormElement<T extends string> = HTMLFormElement & {
  readonly elements: HTMLFormControlsCollection & {
    [fieldName in T]: HTMLInputElement;
  };
};
