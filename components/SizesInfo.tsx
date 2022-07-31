import * as React from 'react';

import { Badge } from 'react-bootstrap';

import ProductsService from '../services/products';
import useFetch from '../utils/useFetch';

type SizesInfoProps = {
  url: string;
};

const SizesInfo = ({ url }: SizesInfoProps) => {
  const { execute, state } = useFetch(ProductsService.getProductDetails);

  React.useEffect(() => {
    execute(url);
  }, [url, execute]);

  if (state.status === 'rejected')
    return <span className="text-danger">Nie udało się pobrać rozmiarów</span>;

  if (state.status === 'pending')
    return <span className="text-secondary">Trwa pobieranie rozmiarów...</span>;

  if (state.status === 'resolved') {
    return (
      <>
        {state.data.isLowStock && <><Badge bg="danger">OSTATNIE SZTUKI</Badge><br /></>}
        {
          state.data.sizes.map((size) => (
            <Badge
              key={size}
              bg="light"
              text="secondary"
              style={{ marginRight: 3 }}
            >
              {size}
            </Badge>
          ))
        }
      </>
    );
  }

  return null;
};

export default SizesInfo;
