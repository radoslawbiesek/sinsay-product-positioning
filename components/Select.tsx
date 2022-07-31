import * as React from 'react';

import { Col, Form, Row } from 'react-bootstrap';

const SELECT_VALUES = [2, 3, 4, 6, 12];

type SelectProps = {
  itemsPerRow: number;
  setItemsPerRow: React.Dispatch<React.SetStateAction<number>>;
};

const Select = ({ itemsPerRow, setItemsPerRow }: SelectProps) => {
  return (
    <Form.Group as={Row} style={{ justifyContent: 'flex-end' }}>
      <Form.Label column xs="2">
        Ilość prod. w rzędzie
      </Form.Label>
      <Col xs="1">
        <Form.Select
          value={itemsPerRow}
          onChange={(e) => setItemsPerRow(Number(e.target.value))}
        >
          {SELECT_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  );
};

export default Select;
