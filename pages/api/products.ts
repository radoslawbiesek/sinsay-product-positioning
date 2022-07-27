import type { NextApiRequest, NextApiResponse } from 'next';

import jsdom from 'jsdom';
import got from 'got';

import { ProductData, ProductsResponse } from '../../types';

const { JSDOM } = jsdom;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductsResponse>
) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    return res.status(400).end('Url is required');
  }

  const response = await got(url);

  try {
    const dom = new JSDOM(response.body);

    const productNodes = dom.window.document.querySelectorAll('article');
    const products: ProductData[] = [];

    productNodes.forEach((productNode) => {
      const sku = productNode.getAttribute('data-sku')!;

      const link = productNode.querySelector('a')!;
      const url = link?.getAttribute('href')!;
      const image = link.querySelector('img')!;
      const imageUrl = image.getAttribute('data-src')!;

      const figcaption = productNode.querySelector('figcaption')!;
      const title = figcaption.querySelector('a')?.innerHTML!;

      const pricesSection = productNode.querySelector('section')!;

      let prices = [];

      const priceNodes = pricesSection.children!;
      for (let i = 0; i < priceNodes.length; i++) {
        const price = pricesSection.children[i];

        prices.push(price.children[0].innerHTML.replace('&nbsp;', ' '));
      }

      products.push({
        sku,
        url,
        title,
        imageUrl,
        prices,
      });
    });

    res.status(200).json({ data: products });
  } catch (err) {
    console.log(err);
    res.status(400).end('Something went wrong');
  }
}
