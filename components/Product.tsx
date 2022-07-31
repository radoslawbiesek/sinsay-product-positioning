import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card, Badge, ListGroup, Col } from 'react-bootstrap';

import SizesInfo from './SizesInfo';
import IndexInput from './IndexInput';
import { ProductData } from '../types';

type ProductProps = {
  listLen: number;
  index: number;
  itemsPerRow: number;
  move: (sourceIndex: number, targetIndex: number) => void;
} & ProductData;

const Product = React.memo(({
  id,
  sku,
  imageUrl,
  title,
  prices,
  url,
  listLen,
  index,
  move,
  itemsPerRow,
}: ProductProps) => {
  const isCompact = itemsPerRow === 12;

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

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <Col
      xs={12 / itemsPerRow}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
    >
      <Card style={{ textAlign: 'center', margin: '10px' }}>
        <div style={{ position: 'relative' }}>
          <Card.Img src={imageUrl} />
          {!isCompact && (
            <>
              <IndexInput
                onSubmit={(newValue) => move(index, newValue - 1)}
                value={index + 1}
                maxValue={listLen}
                style={{
                  width: '80px',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              />
              {discount > 0 && (
                <Badge
                  bg="danger"
                  style={{ position: 'absolute', left: 0, top: 0 }}
                >
                  -{discount}%
                </Badge>
              )}
            </>
          )}
        </div>
        {!isCompact && (
          <ListGroup className="list-group-flush">
            <Card.Text style={{ margin: '5px 0' }}>
              <a href={url} target="_blank" rel="noreferrer">{title}</a>
              <br />
              <span>{sku}</span>
            </Card.Text>
            <Card.Text>{renderPrices(prices)}</Card.Text>
          </ListGroup>
        )}
        <Card.Text style={{ padding: '5px 0' }}>
          <SizesInfo url={url} isCompact={isCompact} />
        </Card.Text>
      </Card>
    </Col >
  );
});

Product.displayName = 'Product';

export default Product;
