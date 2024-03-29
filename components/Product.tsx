import * as React from 'react';
import useSWR from 'swr';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card, Badge, ListGroup, Col } from 'react-bootstrap';

import SizesInfo from './SizesInfo';
import IndexInput from './IndexInput';
import ProductsService from '../services/products';
import { ProductData, ProductDetails } from '../types';
import PriceInfo from './PriceInfo';

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
    title,
    url,
    index,
    move,
    itemsPerRow,
    overlay = false,
  }: ProductProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const { data, error } = useSWR<ProductDetails>(
      url,
      ProductsService.getProductDetails,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
    );

    const isCompact = itemsPerRow === 12;

    if (error || !data) {
      return (
        <Col
          xs={overlay ? MAX_ITEMS : MAX_ITEMS / itemsPerRow}
          ref={setNodeRef}
          style={{
            transform: CSS.Transform.toString(transform),
            transition,
          }}
        >
          <Card
            style={{ textAlign: 'center', margin: '10px' }}
            {...attributes}
            {...listeners}
          >
            {!isCompact && (
              <IndexInput
                onSubmit={(newValue) => move(index, newValue - 1)}
                value={index + 1}
                style={{
                  marginLeft: 'auto',
                  width: '80px',
                }}
              />
            )}
            <Card.Text style={{ margin: '5px 0' }}>
              <span>{`${
                error ? 'Błąd ładowania' : 'Ładowanie'
              } produktu...`}</span>
              <br />
              <a href={url} target="_blank" rel="noreferrer">
                {title}
              </a>
            </Card.Text>
          </Card>
        </Col>
      );
    }

    const discount =
      100 - Math.ceil((data.currentPrice / data.regularPrice) * 100);

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
            <Card.Img src={data.imageUrl} {...attributes} {...listeners} />
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
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {data.isNew && <Badge bg="primary">Nowość</Badge>}
                {data.version > 1 && (
                  <Badge bg="warning">v{data.version}</Badge>
                )}
                {discount > 0 && (
                  <Badge bg="danger">{isCompact ? '%' : `-${discount}%`}</Badge>
                )}
                {data.hasVideo && <Badge bg="info">Video</Badge>}
              </div>
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
              <Card.Text>
                <PriceInfo data={data} />
              </Card.Text>
            </ListGroup>
          )}
          <Card.Text style={{ padding: '5px 0' }}>
            {isCompact && (
              <>
                <strong style={{ fontSize: 12, margin: '3px 0' }}>
                  {data.currentPrice.toString().split('.')[0]}
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: '0.8em',
                      transform: 'translate(0, -0.4em)',
                    }}
                  >
                    {data.currentPrice.toString().split('.')[1]}
                  </div>{' '}
                </strong>
                <span style={{ fontSize: 10 }}>{data.currency}</span>
              </>
            )}
            <SizesInfo isCompact={isCompact} data={data} />
          </Card.Text>
        </Card>
      </Col>
    );
  }
);
Product.displayName = 'Product';

export default Product;
