import * as React from 'react';

import { Button, Overlay, Tooltip } from 'react-bootstrap';

import { ProductsResponse } from '../types';

type AsideProps = {
  data: ProductsResponse;
};

const Aside = ({ data }: AsideProps) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const target = React.useRef(null);

  const skuList = data.data.map((product) => product.sku);

  const onClick = () => {
    navigator.clipboard.writeText(skuList.join('\n')).then(() => {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    });
  };

  return (
    <aside>
      <Button
        ref={target}
        onClick={onClick}
        variant="secondary"
        style={{ margin: '10px 0' }}
      >
        Kopiuj
      </Button>
      <Overlay target={target.current} show={showTooltip} placement="right">
        {(props) => (
          <Tooltip id="overlay" {...props}>
            Skopiowano do schowka
          </Tooltip>
        )}
      </Overlay>
      {skuList.map((sku) => (
        <p style={{ margin: '5px 0' }} key={sku}>
          {sku}
        </p>
      ))}
    </aside>
  );
};

export default Aside;
