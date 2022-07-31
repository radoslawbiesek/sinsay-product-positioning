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
  isLowStock: boolean;
};

export type FormElement<T extends string> = HTMLFormElement & {
  readonly elements: HTMLFormControlsCollection & {
    [fieldName in T]: HTMLInputElement;
  };
};
