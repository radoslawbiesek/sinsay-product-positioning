import * as React from 'react';

import { Badge } from 'react-bootstrap';

import ProductsService from '../services/products';
import useFetch from '../utils/useFetch';

type SizesInfoProps = {
  url: string;
  isCompact: boolean;
};

const SizesInfo = ({ url, isCompact }: SizesInfoProps) => {
  const { execute, state } = useFetch(ProductsService.getProductDetails);

  React.useEffect(() => {
    execute(url);
  }, [url, execute]);

  if (!isCompact) {
    if (state.status === 'rejected')
      return (
        <span className="text-danger">Nie udało się pobrać rozmiarów</span>
      );

    if (state.status === 'pending')
      return (
        <span className="text-secondary">Trwa pobieranie rozmiarów...</span>
      );
  }

  if (state.status === 'resolved') {
    return (
      <>
        {state.data.isLowStock && (
          <Badge bg="danger" style={{ marginRight: 10 }}>
            {isCompact ? 'ost.' : 'OSTATNIE SZTUKI'}
          </Badge>
        )}
        {!isCompact
          ? state.data.sizes.map((size) => (
              <Badge
                key={size}
                bg="light"
                text="dark"
                style={{ marginRight: 3 }}
              >
                {size}
              </Badge>
            ))
          : !state.data.isLowStock && (
              <Badge bg="light" text="dark">
                {state.data.sizes.length} r.
              </Badge>
            )}
      </>
    );
  }

  return null;
};

export default SizesInfo;
