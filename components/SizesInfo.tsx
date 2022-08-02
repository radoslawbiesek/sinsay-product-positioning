import * as React from 'react';
import useSWR from 'swr';

import { Badge } from 'react-bootstrap';

import ProductsService from '../services/products';
import { ProductDetails } from '../types';

type SizesInfoProps = {
  url: string;
  isCompact: boolean;
};

const SizesInfo = React.memo(({ url, isCompact }: SizesInfoProps) => {
  const { data, error } = useSWR<ProductDetails>(
    url,
    ProductsService.getProductDetails,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (!isCompact) {
    if (error)
      return (
        <span className="text-danger">Nie udało się pobrać rozmiarów</span>
      );

    if (!data)
      return (
        <span className="text-secondary">Trwa pobieranie rozmiarów...</span>
      );
  }

  if (data) {
    return (
      <>
        {data.isLowInStock && (
          <Badge bg="secondary" style={{ marginRight: 10 }}>
            {isCompact ? 'ost.' : 'OSTATNIE SZTUKI'}
          </Badge>
        )}
        {!isCompact
          ? data.sizes.map((size) => (
              <Badge
                key={size}
                bg="light"
                text="dark"
                style={{ marginRight: 3 }}
              >
                {size}
              </Badge>
            ))
          : !data.isLowInStock && (
              <Badge bg="light" text="dark">
                {data.sizes.length} r.
              </Badge>
            )}
      </>
    );
  }

  return null;
});

SizesInfo.displayName = 'SizesInfo';

export default SizesInfo;
