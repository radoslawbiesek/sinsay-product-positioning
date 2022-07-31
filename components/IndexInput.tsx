import * as React from 'react';

import { Form } from 'react-bootstrap';

import { FormElement } from '../types';

type IndexInputProps = {
  value: number;
  onSubmit: (val: number) => void;
  style: React.CSSProperties;
};

const IndexInput = ({ value, onSubmit, style }: IndexInputProps) => {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const onKeyDown = (e: React.KeyboardEvent<FormElement<'indexInput'>>) => {
    e.stopPropagation();
    if (e.code === 'Enter') onIndexChange(e);
  };

  const onIndexChange = (
    e: React.SyntheticEvent<FormElement<'indexInput'>>
  ) => {
    e.preventDefault();
    const newValue = Number(e.currentTarget.indexInput.value);
    onSubmit(newValue);
  };

  return (
    <Form style={style} onKeyDown={onKeyDown}>
      <Form.Control
        id="indexInput"
        type="number"
        min={1}
        value={localValue}
        onChange={(e) => setLocalValue(+e.target.value)}
      />
    </Form>
  );
};

export default IndexInput;
