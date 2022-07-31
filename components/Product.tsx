import * as React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card, Badge, ListGroup, Col } from 'react-bootstrap';

import SizesInfo from './SizesInfo';
import IndexInput from './IndexInput';
import { ProductData } from '../types';

const MAX_ITEMS = 12;

type ProductProps = {
  index: number;
  itemsPerRow: number;
  move: (sourceIndex: number, targetIndex: number) => void;
  overlay?: boolean;
} & ProductData;

const Product = React.memo(
  ({
    id,
    sku,
    imageUrl,
    title,
    url,
    currentPrice,
    regularPrice,
    currency,
    index,
    move,
    itemsPerRow,
    overlay = false,
  }: ProductProps) => {
    const isCompact = itemsPerRow === 12;

    let discount: number;
    const isDiscount = regularPrice !== 0;
    if (isDiscount) {
      discount = 100 - Math.ceil((currentPrice / regularPrice) * 100);
    } else {
      discount = 0;
    }

    const renderPrices = () => {
      if (isDiscount) {
        return (
          <>
            <span style={{ fontSize: '1.2rem' }} className="text-danger">
              {currentPrice}{' '}
            </span>
            <span style={{ textDecoration: 'line-through' }}>
              {regularPrice}{' '}
            </span>
            <span>{currency}</span>
          </>
        );
      }

      return (
        <span>
          {currentPrice} {currency}
        </span>
      );
    };

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    return (
      <Col
        xs={overlay ? MAX_ITEMS : MAX_ITEMS / itemsPerRow}
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        <Card style={{ textAlign: 'center', margin: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Card.Img src={imageUrl} {...attributes} {...listeners} />
            <>
              {!isCompact && (
                <IndexInput
                  onSubmit={(newValue) => move(index, newValue - 1)}
                  value={index + 1}
                  style={{
                    width: '80px',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                />
              )}
              {discount > 0 && (
                <Badge
                  bg="danger"
                  style={{ position: 'absolute', left: 0, top: 0 }}
                >
                  {isCompact ? '%' : `-${discount}%`}
                </Badge>
              )}
            </>
          </div>
          {!isCompact && (
            <ListGroup className="list-group-flush">
              <Card.Text style={{ margin: '5px 0' }}>
                <a href={url} target="_blank" rel="noreferrer">
                  {title}
                </a>
                <br />
                <span>{sku}</span>
              </Card.Text>
              <Card.Text>{renderPrices()}</Card.Text>
            </ListGroup>
          )}
          <Card.Text style={{ padding: '5px 0' }}>
            <SizesInfo url={url} isCompact={isCompact} />
          </Card.Text>
        </Card>
      </Col>
    );
  }
);
Product.displayName = 'Product';

export default Product;
