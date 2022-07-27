import * as React from 'react';

import useSWR from 'swr';

import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Product from './Product';

import { fetcher } from '../utils';
import { ProductsResponse } from '../types';

type ListProps = {
  url: string;
}

const List = ({ url }: ListProps) => {
  const { data, error } = useSWR<ProductsResponse>(`http://localhost:3000/api/products?url=${url}`, fetcher);

  if (!url) return null;

  if (error) return <Alert variant="danger">Nie udało się załadować wyników. Spróbuj ponownie.</Alert>;

  if (!data) return <Spinner animation="border" variant="dark" />;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {data.data.length > 0 && data.data.map(product => (
        <Product key={product.sku} product={product} />
      ))}
    </div>
  )
}

export default List;
