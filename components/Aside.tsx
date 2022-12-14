import * as React from 'react';

import { Button, Overlay, Tooltip } from 'react-bootstrap';

import { ProductData } from '../types';

type AsideProps = {
  list: ProductData[];
};

const Aside = ({ list }: AsideProps) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const target = React.useRef(null);

  const onClick = () => {
    navigator.clipboard
      .writeText(list.map((product) => product.sku).join('\n'))
      .then(() => {
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
      {list.map((product) => (
        <p style={{ margin: '5px 0' }} key={product.id}>
          {product.sku}
        </p>
      ))}
    </aside>
  );
};

export default Aside;
