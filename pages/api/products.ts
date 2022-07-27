import type { NextApiRequest, NextApiResponse } from "next";

import jsdom from "jsdom";
import got from "got";

const { JSDOM } = jsdom;

type Product = {
  sku?: string;
  url?: string;
  imageUrl?: string;
  title?: string;
  prices: { type: string; value: string }[];
};

type Response = {
  data: Product[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { url } = req.body;

  const response = await got(url);
  const dom = new JSDOM(response.body);

  const productNodes = dom.window.document.querySelectorAll("article");
  const products: Product[] = [];

  productNodes.forEach((productNode) => {
    const sku = productNode.getAttribute("data-sku")!;

    const link = productNode.querySelector("a")!;
    const url = link?.getAttribute("href")!;
    const image = link.querySelector("img")!;
    const imageUrl = image.getAttribute("data-src")!;

    const figcaption = productNode.querySelector("figcaption")!;
    const title = figcaption.querySelector("a")?.innerHTML;

    const pricesSection = productNode.querySelector("section")!;

    let prices = [];

    const priceNodes = pricesSection.children!;
    for (let i = 0; i < priceNodes.length; i++) {
      const price = pricesSection.children[i];

      prices.push({
        type: price.className.split("-")[1],
        value: price.children[0].innerHTML,
      });
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
}
