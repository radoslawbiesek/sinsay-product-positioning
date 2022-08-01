import { ProductData, ProductDetails } from '../types';
import HttpError from '../utils/HttpError';

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

function getTitleFromSlug(url: string) {
  const slugArr = url.split('-').slice(0, -2);
  const urlArr = slugArr[0].split('/');
  const firstPart = urlArr[urlArr.length - 1];
  slugArr[0] = firstPart[0].toUpperCase() + firstPart.slice(1);

  return slugArr.join(' ');
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

        const imageUrlRegex = /data-src="(.*?)"/;
        const imageUrl = articleMatch.match(imageUrlRegex)?.[1] || '';

        const pricesSectionRegex =
          /<sectionclass="es-product-price">(.*?)<\/section>/;
        const pricesSection = articleMatch.match(pricesSectionRegex)?.[1];

        let regularPrice = 0;
        let currentPrice = 0;

        let currency = '';
        if (pricesSection) {
          const priceRegex = /<span>(.*?)<\/span>/g;
          const pricesMatches = pricesSection.matchAll(priceRegex);
          [...pricesMatches].forEach((priceMatch, index) => {
            const [strValue, matchCurrency] = priceMatch[1].split('&nbsp;');
            const value = parseFloat(strValue.replace(',', '.'));
            if (index === 0) {
              currency = matchCurrency;
              currentPrice = value;
            }

            if (index === 1) {
              regularPrice = value;
            }
          });
        }

        products.push({
          sku,
          url,
          imageUrl,
          title,
          id: sku,
          regularPrice,
          currentPrice,
          currency,
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
