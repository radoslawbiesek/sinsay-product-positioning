import * as React from 'react';
import useSWR from 'swr';

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import Product from './Product';
import Select from './Select';

import { fetcher } from '../utils';
import { ProductsResponse } from '../types';

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

  const [itemsPerRow, setItemsPerRow] = React.useState(4);

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
      <Select itemsPerRow={itemsPerRow} setItemsPerRow={setItemsPerRow} />
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
