import * as React from 'react';
import useSWR from 'swr';

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Product from './Product';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { fetcher } from '../utils';
import { ProductsResponse } from '../types';

const SELECT_VALUES = [2, 3, 4, 6];
const DEFAULT_VALUE = 4;

type ListProps = {
  url: string;
};

const List = ({ url }: ListProps) => {
  const { data, error } = useSWR<ProductsResponse>(
    `/api/products?url=${url}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const [itemsPerRow, setItemsPerRow] = React.useState(DEFAULT_VALUE);

  if (!url) return null;

  if (error)
    return (
      <Alert variant="danger">
        Nie udało się załadować wyników. Spróbuj ponownie.
      </Alert>
    );

  if (!data) return <Spinner animation="border" variant="dark" />;

  return (
    <div>
      <Form.Group as={Row} style={{ justifyContent: 'flex-end' }}>
        <Form.Label column xs="2">
          Ilość prod. w rzędzie
        </Form.Label>
        <Col xs="1">
          <Form.Select
            value={itemsPerRow}
            onChange={(e) => setItemsPerRow(Number(e.target.value))}
          >
            {SELECT_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {data.data.length > 0 &&
          data.data.map((product) => (
            <Col xs={12 / itemsPerRow} key={product.sku}>
              <Product product={product} />
            </Col>
          ))}
      </div>
    </div>
  );
};

export default List;
