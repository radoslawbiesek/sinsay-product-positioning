import * as React from 'react';

import { Form } from 'react-bootstrap';

import { FormElement } from '../types';

type IndexInputProps = {
  value: number;
  onSubmit: (val: number) => void;
  maxValue: number;
  style: React.CSSProperties;
};

const IndexInput = ({ value, onSubmit, maxValue, style }: IndexInputProps) => {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const onIndexChange = (
    e: React.SyntheticEvent<FormElement<'indexInput'>>
  ) => {
    e.preventDefault();
    const newValue = Number(e.currentTarget.indexInput.value);
    onSubmit(newValue);
  };

  return (
    <Form onSubmit={onIndexChange} style={style}>
      <Form.Control
        id="indexInput"
        type="number"
        min={1}
        max={maxValue}
        value={localValue}
        onChange={(e) => setLocalValue(+e.target.value)}
      />
    </Form>
  );
};

export default IndexInput;
