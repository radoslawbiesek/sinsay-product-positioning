import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { url } = req.body;

    const response = await fetch(url);
    const text = await response.text();

    res.status(200).send(text);
  } catch (error) {
    res.status(500).send(error);
  }
}
