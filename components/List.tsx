import * as React from 'react';
import useSWR from 'swr';

import { Container, Alert, Spinner, Col, Row } from 'react-bootstrap';

import Product from './Product';
import Select from './Select';
import Aside from './Aside';

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

  if (!data)
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner animation="border" variant="dark" />
      </div>
    );

  return (
    <div>
      <Container>
        <span>
          <strong>Liczba produktów:</strong> {data.data.length}
        </span>
        <Select itemsPerRow={itemsPerRow} setItemsPerRow={setItemsPerRow} />
        <Row>
          <Col xs="2">
            <Aside data={data} />
          </Col>
          <Col xs="10">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.data.length > 0 &&
                data.data.map((product) => (
                  <Col xs={12 / itemsPerRow} key={product.sku}>
                    <Product product={product} />
                  </Col>
                ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default List;
