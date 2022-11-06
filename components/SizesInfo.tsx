import * as React from 'react';

import { Badge } from 'react-bootstrap';

import { ProductDetails } from '../types';

type SizesInfoProps = {
  data: ProductDetails;
  isCompact: boolean;
};

const SizesInfo = React.memo(({ isCompact, data }: SizesInfoProps) => {
  return (
    <>
      {data.isLowInStock && (
        <Badge bg="secondary" style={{ marginRight: 10 }}>
          {isCompact ? 'ost.' : 'OSTATNIE SZTUKI'}
        </Badge>
      )}
      {!isCompact
        ? data.sizes.map((size) => (
            <Badge key={size} bg="light" text="dark" style={{ marginRight: 3 }}>
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
});

SizesInfo.displayName = 'SizesInfo';

export default SizesInfo;
