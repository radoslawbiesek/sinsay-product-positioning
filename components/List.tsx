import * as React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Container, Col, Row } from 'react-bootstrap';

import Product from './Product';
import Select from './Select';
import Aside from './Aside';

import { ProductData } from '../types';

type ListProps = {
  list: ProductData[];
};

const List = ({ list }: ListProps) => {
  const [localList, setLocalList] = React.useState<ProductData[]>([]);

  React.useEffect(() => {
    if (list) {
      setLocalList(list);
    }
  }, [list]);

  const [itemsPerRow, setItemsPerRow] = React.useState(4);

  const move = React.useCallback((dragIndex: number, hoverIndex: number) => {
    setLocalList((list) => {
      const copy = [...list];
      const itemToMove = copy.splice(dragIndex, 1)[0];
      copy.splice(hoverIndex, 0, itemToMove);
      return copy;
    });
  }, []);

  return (
    <div>
      <Container>
        <span>
          <strong>Liczba produktów:</strong> {localList.length}
        </span>
        <Select itemsPerRow={itemsPerRow} setItemsPerRow={setItemsPerRow} />
        <Row>
          <Col xs="2">
            <Aside list={localList} />
          </Col>
          <Col xs="10">
            <DndProvider backend={HTML5Backend}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {localList.length > 0 &&
                  localList.map((product, index) => (
                    <Col xs={12 / itemsPerRow} key={product.sku}>
                      <Product
                        id={product.sku}
                        product={product}
                        listLen={localList.length}
                        index={index}
                        move={move}
                      />
                    </Col>
                  ))}
              </div>
            </DndProvider>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default List;
