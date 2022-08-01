import * as React from 'react';
import type { NextPage } from 'next';
import useSWR from 'swr';

import { Alert, Spinner } from 'react-bootstrap';

import Form from '../components/Form';
import List from '../components/List';

import ProductsService from '../services/products';
import { ProductData } from '../types';
import HttpError from '../utils/HttpError';

function getErrorMessage(error: unknown): string {
  const baseMsg = 'Nie udało się pobrać wyników.';
  if (error instanceof HttpError) {
    switch (error.statusCode) {
      case 404:
        return '404: Nie znaleziono strony';
      default:
        return `${baseMsg}. Kod błędu: ${error.statusCode}`;
    }
  } else if (error instanceof Error) {
    if (error.message) {
      return `${baseMsg}. Błąd: ${error.message}`;
    }
  }

  return baseMsg;
}

const Home: NextPage = () => {
  const [url, setUrl] = React.useState('');

  const { data, error } = useSWR<ProductData[]>(
    url,
    ProductsService.getProductsList,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 5,
    }
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Form onSubmit={setUrl} />
      {url && (
        <>
          {error && <Alert variant="danger">{getErrorMessage(error)}</Alert>}
          {!data && !error && (
            <div style={{ textAlign: 'center' }}>
              <Spinner animation="border" variant="dark" />
            </div>
          )}
          {!error && data && <List list={data} />}
        </>
      )}
    </div>
  );
};

export default Home;
