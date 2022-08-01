import * as React from 'react';

import { Form } from 'react-bootstrap';

import { FormElement } from '../types';

type IndexInputProps = {
  value: number;
  onSubmit: (val: number) => void;
  style: React.CSSProperties;
};

const IndexInput = ({ value, onSubmit, style }: IndexInputProps) => {
  const [localValue, setLocalValue] = React.useState(value.toString());

  React.useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const onKeyDown = (e: React.KeyboardEvent<FormElement<'indexInput'>>) => {
    e.stopPropagation();
    if (e.code === 'Enter') onIndexChange(e);
  };

  const onIndexChange = (
    e: React.SyntheticEvent<FormElement<'indexInput'>>
  ) => {
    e.preventDefault();
    const newValue = e.currentTarget.indexInput.value;
    if (!newValue) return;
    onSubmit(Number(newValue));
  };

  return (
    <Form style={style} onKeyDown={onKeyDown}>
      <Form.Control
        id="indexInput"
        type="number"
        min={1}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => setLocalValue(value.toString())}
      />
    </Form>
  );
};

export default IndexInput;
