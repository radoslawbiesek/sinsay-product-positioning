import * as React from 'react';
import useSWR from 'swr';

import { Card, Badge, ListGroup } from 'react-bootstrap';

import { ProductData, ProductResponse } from '../types';
import { fetcher } from '../utils';

function calcDiscount(prices: string[]): number {
  const values = prices.map((price) =>
    parseFloat(price.split(' ')[0].replace(',', '.'))
  );
  values.sort();

  return 100 - Math.ceil((values[0] / values[1]) * 100);
}

const SizesInfo = ({ url }: { url: string }) => {
  const { data, error } = useSWR<ProductResponse>(
    `/api/product?url=${url}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error)
    return <span className="text-danger">Nie udało się pobrać rozmiarów</span>;
  if (!data)
    return <span className="text-secondary">Trwa pobieranie rozmiarów...</span>;

  return (
    <>
      {data.data.sizes.map((size) => (
        <Badge
          key={size}
          bg="light"
          text="secondary"
          style={{ marginRight: 3 }}
        >
          {size}
        </Badge>
      ))}
    </>
  );
};

type ProductProps = {
  product: ProductData;
};

const Product = ({
  product: { sku, imageUrl, title, prices, url },
}: ProductProps) => {
  const isDiscount = prices.length === 2;
  let discount = 0;
  if (prices.length === 2) {
    discount = calcDiscount(prices);
  }

  return (
    <Card style={{ textAlign: 'center', margin: '10px' }}>
      <Card.Img
        src={imageUrl}
        style={{ cursor: 'pointer' }}
        onClick={() => window.open(url, '_blank')}
      />
      <ListGroup className="list-group-flush">
        <Card.Title style={{ marginTop: 5 }}>
          <span>{title}</span>
          {discount > 0 && (
            <Badge bg="danger" style={{ marginLeft: 10 }}>
              -{discount}%
            </Badge>
          )}
        </Card.Title>
        <Card.Title>{sku}</Card.Title>
        <Card.Text>
          {isDiscount ? (
            <>
              <span style={{ fontSize: '1.2rem' }} className="text-danger">
                {prices[0]}{' '}
              </span>
              <span style={{ textDecoration: 'line-through' }}>
                {prices[1]}
              </span>
            </>
          ) : (
            <span>{prices[0]}</span>
          )}
        </Card.Text>
      </ListGroup>
      <Card.Text style={{ padding: '5px 0' }}>
        <SizesInfo url={url} />
      </Card.Text>
    </Card>
  );
};

export default Product;
