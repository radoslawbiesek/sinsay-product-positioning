import * as React from 'react';
import type { NextPage } from 'next';
import useSWR from 'swr';

import { Alert, Spinner } from 'react-bootstrap';

import Form from '../components/Form';
import List from '../components/List';

import { fetcher } from '../utils';
import { ProductsResponse } from '../types';

const Home: NextPage = () => {
  const [url, setUrl] = React.useState('');

  const { data, error } = useSWR<ProductsResponse>(
    url && `/api/products?url=${url}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Form onSubmit={setUrl} />
      {url && (
        <>
          {error && (
            <Alert variant="danger">
              Nie udało się załadować wyników. Spróbuj ponownie.
            </Alert>
          )}
          {!data && (
            <div style={{ textAlign: 'center' }}>
              <Spinner animation="border" variant="dark" />
            </div>
          )}
          {!error && data && <List list={data.data} />}
        </>
      )}
    </div>
  );
};

export default Home;
