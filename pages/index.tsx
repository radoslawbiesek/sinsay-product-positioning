import * as React from 'react';
import type { NextPage } from 'next';

import { Alert, Spinner } from 'react-bootstrap';

import Form from '../components/Form';
import List from '../components/List';

import useFetch from '../utils/useFetch';
import ProductsService from '../services/products';

const Home: NextPage = () => {
  const [url, setUrl] = React.useState('');

  const { execute, state } = useFetch(ProductsService.getProductsList);

  React.useEffect(() => {
    if (!url) return;
    execute(url);
  }, [url, execute]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Form onSubmit={setUrl} />
      <>
        {state.status === 'rejected' && (
          <Alert variant="danger">
            Nie udało się załadować wyników. Spróbuj ponownie.
          </Alert>
        )}
        {state.status === 'pending' && (
          <div style={{ textAlign: 'center' }}>
            <Spinner animation="border" variant="dark" />
          </div>
        )}
        {state.status === 'resolved' && <List list={state.data} />}
      </>
    </div>
  );
};

export default Home;
