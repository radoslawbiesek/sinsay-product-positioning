import { ProductData, ProductDetails } from '../types';

type FetchedProduct = {
  sizes: {
    stock: boolean;
    sizeName: string;
  }[];
  stickers: {
    [key: string]: {
      text: string;
    }[];
  };
};

export default class ProductsService {
  private static getPage = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (response.status !== 200) throw new Error(`${response.status}`);

    const text = await response.text();
    return text.replace(/\s/g, '');
  };

  public static getProductDetails = async (
    url: string
  ): Promise<ProductDetails> => {
    const text = await this.getPage(url);

    const fnRegex = /window\['getProductData'\]=(.*?)window/;
    const fnStr = fnRegex.exec(text);
    let sizes: string[] = [];
    let isLowStock = false;

    if (fnStr) {
      let getProductData = () => ({} as FetchedProduct);
      eval(`getProductData =  ${fnStr[1]}`);
      const productData = getProductData();
      sizes = productData.sizes
        .filter((size) => size.stock)
        .map((size) => size.sizeName);

      const flatStickers = Object.values(productData.stickers).reduce(
        (acc, arr) => [...acc, ...arr],
        []
      );

      isLowStock = flatStickers
        .map(({ text }) => text)
        .includes('OSTATNIESZTUKI');
    }

    return { sizes, isLowStock };
  };

  public static getProductsList = async (
    url: string
  ): Promise<ProductData[]> => {
    const text = await this.getPage(url);

    const articleRegex = /\<article(.*?)\<\/article>/g;

    const products: ProductData[] = [];
    [...text.matchAll(articleRegex)].forEach((article) => {
      if (article[1]) {
        const articleMatch = article[1];
        const skuRegex = /data-sku="(.*?)"/;
        const sku = articleMatch.match(skuRegex)?.[1] || '';

        const urlRegex = /<ahref="(.*?)"/;
        const url = articleMatch.match(urlRegex)?.[1] || '';

        const imageUrlRegex = /data-src="(.*?)"/;
        const imageUrl = articleMatch.match(imageUrlRegex)?.[1] || '';

        const pricesSectionRegex =
          /<sectionclass="es-product-price">(.*?)<\/section>/;
        const pricesSection = articleMatch.match(pricesSectionRegex)?.[1];

        let prices: ProductData['prices'] = [];
        if (pricesSection) {
          const priceRegex = /<span>(.*?)<\/span>/g;
          const pricesMatches = pricesSection.matchAll(priceRegex);
          [...pricesMatches].forEach((priceMatch) => {
            const [strValue, currency] = priceMatch[1].split('&nbsp;');
            const value = parseFloat(strValue.replace(',', '.'));

            prices.push({ value, currency });
          });
        }

        const figcaptionRegex = /<figcaption.*>(.*?)<\/figcaption>/;
        const figcaption = articleMatch.match(figcaptionRegex)?.[0];
        let title = '';
        if (figcaption) {
          const titleMatch = /<a.*>(.*?)<\/a>/;
          title = figcaption.match(titleMatch)?.[1] || '';
        }

        products.push({ sku, url, imageUrl, prices, title });
      }
    });

    return products;
  };
}
