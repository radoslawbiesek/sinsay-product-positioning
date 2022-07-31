import * as React from 'react';
import useSWR from 'swr';

import { Badge } from 'react-bootstrap';

import ProductsService from '../services/products';

type SizesInfoProps = {
  url: string;
};

const SizesInfo = ({ url }: SizesInfoProps) => {
  const { data, error } = useSWR(url, ProductsService.getProductDetails, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (error)
    return <span className="text-danger">Nie udało się pobrać rozmiarów</span>;
  if (!data)
    return <span className="text-secondary">Trwa pobieranie rozmiarów...</span>;

  return (
    <>
      {data.isLowStock && (
        <div>
          <Badge bg="danger">OSTATNIE SZTUKI</Badge>
        </div>
      )}
      {data.sizes.map((size) => (
        <Badge
          key={size}
          bg="light"
          text="secondary"
          style={{ marginRight: 3 }}
        >
          {size}
        </Badge>
      ))}
    </>
  );
};

export default SizesInfo;
