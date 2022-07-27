import * as React from 'react';
import type { NextPage } from 'next';

import Form from '../components/Form';
import List from '../components/List';

const Home: NextPage = () => {
  const [url, setUrl] = React.useState('');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Form onSubmit={setUrl} />
      {url && <List url={url} />}
    </div>
  );
};

export default Home;
