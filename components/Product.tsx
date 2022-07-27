import * as React from 'react';

import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import { ProductData } from '../types';

type ProductProps = {
  product: ProductData;
};

function calcDiscount(prices: [string, string]): number {
  const values = prices.map((price) =>
    parseFloat(price.split(' ')[0].replace(',', '.'))
  );
  values.sort();

  return 100 - Math.ceil((values[0] / values[1]) * 100);
}

const Product = ({
  product: { sku, imageUrl, title, prices },
}: ProductProps) => {
  const isDiscount = prices.length === 2;
  let discount = 0;
  if (prices.length === 2) {
    discount = calcDiscount(prices);
  }

  return (
    <Card style={{ width: '260px', textAlign: 'center', margin: '20px' }}>
      <Card.Img src={imageUrl} />
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
            <span style={{ textDecoration: 'line-through' }}>{prices[1]}</span>
          </>
        ) : (
          <span>{prices[0]}</span>
        )}
      </Card.Text>
    </Card>
  );
};

export default Product;
