import { ProductData, ProductDetails } from '../types';
import HttpError from '../utils/HttpError';

import { v4 as uuidv4 } from 'uuid';

type FetchedProduct = {
  sizes: {
    stock: boolean;
    sizeName: string;
  }[];
  stickers: {
    [key: string]: {
      text: string;
      stickerId: number;
    }[];
  };
  img: {
    front: string;
  };
  price: {
    regular: number;
    final: number;
    currency: string;
  };
  sku: string;
  version: number;
};

function getTitleFromSlug(url: string) {
  try {
    const slugArr = url.split('-').slice(0, -2);
    const urlArr = slugArr[0].split('/');
    const firstPart = urlArr[urlArr.length - 1];
    slugArr[0] = firstPart[0].toUpperCase() + firstPart.slice(1);

    return slugArr.join(' ');
  } catch {
    return 'Brak tytułu';
  }
}

function handleError(error: unknown): never {
  console.log(error);
  if (error instanceof HttpError) {
    throw new HttpError(error.statusCode);
  } else if (error instanceof Error) {
    throw new Error(error instanceof Error ? error.message : '');
  }

  throw new Error();
}

async function getPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (response.status !== 200) throw new HttpError(response.status);

  const text = await response.text();
  return text.replace(/\s/g, '');
}

async function getProductDetails(url: string): Promise<ProductDetails> {
  try {
    const text = await getPage(url);

    const fnRegex = /window\['getProductData'\]=(.*?)window/;
    const fnStr = fnRegex.exec(text);

    if (fnStr) {
      let getProductData = () => ({} as FetchedProduct);
      eval(`getProductData =  ${fnStr[1]}`);
      const productData = getProductData();

      const sizes = productData.sizes
        .filter((size) => size.stock)
        .map((size) => size.sizeName);

      const flatStickers = Object.values(productData.stickers).reduce(
        (acc, arr) => [...acc, ...arr],
        []
      );

      const LABELS = ['ostatniesztuki', 'lowinstock'];
      const LOW_IN_STOCK_ID = 3783;
      const isLowInStock = flatStickers.some(
        ({ text, stickerId }) =>
          LABELS.includes(text.toLowerCase()) || stickerId === LOW_IN_STOCK_ID
      );

      const NEW_ID = 10995;
      const NEW_LABELS = ['NOWOŚĆ'];
      const isNew = flatStickers.some(
        ({ text, stickerId }) =>
          NEW_LABELS.includes(text.toLowerCase()) || stickerId === NEW_ID
      );

      let hasVideo = false;
      const videoRegex = /window.videoConfig=(.*?);/;
      const videoStr = videoRegex.exec(text);

      if (videoStr) {
        let videoArr = [] as any;
        eval(`videoArr = ${videoStr[1]};`);

        hasVideo = videoArr.some(
          (obj: { sku: string }) => obj.sku === productData.sku
        );
      }

      return {
        sizes,
        imageUrl: productData.img.front,
        currentPrice: productData.price.final,
        regularPrice: productData.price.regular,
        currency: productData.price.currency,
        version: productData.version,
        isLowInStock,
        hasVideo,
        isNew,
      };
    } else {
      throw new Error();
    }
  } catch (err) {
    handleError(err);
  }
}

async function getProductsList(url: string): Promise<ProductData[]> {
  try {
    const text = await getPage(url);

    const articleRegex = /\<article(.*?)\<\/article>/g;

    const products: ProductData[] = [];
    [...text.matchAll(articleRegex)].forEach((article) => {
      if (article[1]) {
        const articleMatch = article[1];
        const skuRegex = /data-sku="(.*?)"/;
        const sku = articleMatch.match(skuRegex)?.[1] || '';

        const urlRegex = /<ahref="(.*?)"/;
        const url = articleMatch.match(urlRegex)?.[1] || '';
        const title = getTitleFromSlug(url);

        products.push({
          id: uuidv4(),
          sku,
          url,
          title,
        });
      }
    });

    return products;
  } catch (err) {
    handleError(err);
  }
}

const ProductsService = { getProductDetails, getProductsList };

export default ProductsService;
