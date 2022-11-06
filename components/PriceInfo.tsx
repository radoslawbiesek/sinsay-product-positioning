import * as React from 'react';

import { ProductDetails } from '../types';

type PriceInfoProps = {
  data: ProductDetails;
};

const PriceInfo = React.memo(({ data }: PriceInfoProps) => {
  const isDiscount = data.regularPrice != data.currentPrice;

  if (isDiscount) {
    return (
      <>
        <span style={{ fontSize: '1.2rem' }} className="text-danger">
          {data.currentPrice}{' '}
        </span>
        <span style={{ textDecoration: 'line-through' }}>
          {data.regularPrice}{' '}
        </span>
        <span>{data.currency}</span>
      </>
    );
  }

  return (
    <span>
      {data.currentPrice} {data.currency}
    </span>
  );
});
PriceInfo.displayName = 'PriceInfo';

export default PriceInfo;
