import { ProductDetails } from '../types';

type FetchedProduct = {
  sizes: {
    stock: boolean;
    sizeName: string;
  }[];
};

export default class ProductsService {
  public static async getProductDetails(url: string): Promise<ProductDetails> {
    const response = await fetch(url);
    if (response.status !== 200) throw new Error(`${response.status}`);

    const text = await response.text();

    const clean = text.replace(/\s/g, '');

    const fnRegex = /window\['getProductData'\]=(.*?)window/;
    const fnStr = fnRegex.exec(clean);
    let sizes: string[] = [];

    if (fnStr) {
      let getProductData = () => ({} as FetchedProduct);
      eval(`getProductData =  ${fnStr[1]}`);
      const productData = getProductData();
      sizes = productData.sizes
        .filter((size) => size.stock)
        .map((size) => size.sizeName);
    }

    return { sizes };
  }
}
