import * as React from 'react';

import { Form, Button, InputGroup } from 'react-bootstrap';
import { FormElement } from '../types';

type UrlFormProps = {
  onSubmit: (url: string) => void;
};

const UrlForm = ({ onSubmit }: UrlFormProps) => {
  const handleSubmit = (e: React.SyntheticEvent<FormElement<'urlInput'>>) => {
    e.preventDefault();
    const value = e.currentTarget.elements.urlInput.value;

    if (!value) return;

    onSubmit(value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control type="text" placeholder="Adres www..." id="urlInput" />
        <Button variant="secondary" type="submit">
          Pobierz
        </Button>
      </InputGroup>
    </Form>
  );
};

export default UrlForm;
