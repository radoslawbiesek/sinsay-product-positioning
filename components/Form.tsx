import * as React from 'react';
import type { NextPage } from 'next'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

type FormElements = HTMLFormControlsCollection & {
  urlInput: HTMLInputElement;
};

type FormElement = HTMLFormElement & {
  readonly elements: FormElements;
}

type UrlFormProps = {
  onSubmit: (url: string) => void
}

const UrlForm = ({ onSubmit }: UrlFormProps) => {
  const handleSubmit = (e: React.SyntheticEvent<FormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.elements.urlInput.value;

    if (!value) return;

    onSubmit(value);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control type="text" placeholder="Adres www..." id="urlInput" />
        <Button variant="secondary" type="submit">
          Pobierz
        </Button>
      </InputGroup>
    </Form>
  )
}

export default UrlForm