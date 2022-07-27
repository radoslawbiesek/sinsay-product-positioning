import type { NextApiRequest, NextApiResponse } from 'next';

import got from 'got';

import { ProductResponse } from '../../types';

type FetchedProduct = {
  sizes: {
    stock: boolean;
    sizeName: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse>
) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    return res.status(400).end('Url is required');
  }

  const response = await got(url);

  const clean = response.body.replace(/\s/g, '');

  const fnRegex = /window\['getProductData'\]=(.*?)window/;
  const fnStr = fnRegex.exec(clean);
  let sizes: string[] = [];

  if (fnStr) {
    let getProductData = () => ({} as FetchedProduct);
    eval('getProductData = ' + fnStr[1]);
    const productData = getProductData();
    sizes = productData.sizes
      .filter((size) => size.stock)
      .map((size) => size.sizeName);
  }

  res.status(200).send({ data: { sizes } });
}
