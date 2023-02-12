export type ProductData = {
  id: string;
  sku: string;
  url: string;
  title: string;
};

export type ProductDetails = {
  sizes: string[];
  isLowInStock: boolean;
  imageUrl: string;
  currentPrice: number;
  regularPrice: number;
  currency: string;
  hasVideo: boolean;
  version: number;
  isNew: boolean;
};

export type FormElement<T extends string> = HTMLFormElement & {
  readonly elements: HTMLFormControlsCollection & {
    [fieldName in T]: HTMLInputElement;
  };
};
