import * as React from 'react';

import { Card, Badge, ListGroup, Form } from 'react-bootstrap';

import SizesInfo from './SizesInfo';
import DragItem, { DragItemProps } from './DragItem';
import { ProductData } from '../types';
import IndexInput from './IndexInput';

type ProductProps = {
  product: ProductData;
  listLen: number;
} & DragItemProps;

const Product = ({
  product: { sku, imageUrl, title, prices, url },
  listLen,
  index,
  move,
  id,
}: ProductProps) => {
  let discount: number;
  if (prices.length === 2) {
    discount = 100 - Math.ceil((prices[0].value / prices[1].value) * 100);
  } else {
    discount = 0;
  }

  const renderPrices = (prices: ProductData['prices']) => {
    if (prices.length === 2) {
      const currentPrice = prices[0];
      const regularPrice = prices[1];
      return (
        <>
          <span style={{ fontSize: '1.2rem' }} className="text-danger">
            {currentPrice.value}{' '}
          </span>
          <span style={{ textDecoration: 'line-through' }}>
            {regularPrice.value}{' '}
          </span>
          <span>{currentPrice.currency}</span>
        </>
      );
    }

    const price = prices[0];
    return (
      <span>
        {price.value} {price.currency}
      </span>
    );
  };

  return (
    <DragItem id={id} index={index} move={move}>
      <Card style={{ textAlign: 'center', margin: '10px' }}>
        <div style={{ position: 'relative' }}>
          <Card.Img
            src={imageUrl}
            style={{ cursor: 'pointer' }}
            onClick={() => window.open(url, '_blank')}
          />
          <IndexInput
            onSubmit={(newValue) => move(index, newValue - 1)}
            value={index + 1}
            maxValue={listLen}
          />
        </div>
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
          <Card.Text>{renderPrices(prices)}</Card.Text>
        </ListGroup>
        <Card.Text style={{ padding: '5px 0' }}>
          <SizesInfo url={url} />
        </Card.Text>
      </Card>
    </DragItem>
  );
};

export default Product;
