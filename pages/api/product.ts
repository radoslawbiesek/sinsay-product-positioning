import type { NextApiRequest, NextApiResponse } from "next";

import got from "got";

type Product = {
  sizes: string[];
};

type Response = {
  data: Product;
};

type ProductData = {
  sizes: {
    stock: boolean;
    sizeName: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { url } = req.body;

  const response = await got(url);

  const clean = response.body.replace(/\s/g, "");

  const fnRegex = /window\['getProductData'\]=(.*?)window/;
  const fnStr = fnRegex.exec(clean);
  let sizes: string[] = [];

  if (fnStr) {
    let getProductData = () => ({} as ProductData);
    eval("getProductData = " + fnStr[1]);
    const productData = getProductData();
    sizes = productData.sizes
      .filter((size) => size.stock)
      .map((size) => size.sizeName);
  }

  res.status(200).send({ data: { sizes } });
}
