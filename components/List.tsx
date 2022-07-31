import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { Container, Col, Row } from 'react-bootstrap';

import Product from './Product';
import Select from './Select';
import Aside from './Aside';

import { ProductData } from '../types';

type ListProps = {
  list: ProductData[];
};

const List = ({ list }: ListProps) => {
  const [localList, setLocalList] = React.useState(list);
  const [itemsPerRow, setItemsPerRow] = React.useState(4);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const move = React.useCallback((oldIndex: number, newIndex: number) => {
    setLocalList((list) => arrayMove(list, oldIndex, newIndex));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localList.findIndex((product) => product.id === active.id);
    const newIndex = localList.findIndex((product) => product.id === over.id);

    move(oldIndex, newIndex);
  };

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={localList} strategy={rectSortingStrategy}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {localList.map((product, index) => (
                    <Product
                      key={product.sku}
                      listLen={localList.length}
                      itemsPerRow={itemsPerRow}
                      index={index}
                      move={move}
                      {...product}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default List;
