import { useCallback, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import styled from 'styled-components';

import Card from '..';
import { Card as CardType, DragType } from '../../../globals/types';

type ContainerProps = {
  $isDragging?: boolean,
};

const Container = styled.div<ContainerProps>`
  width: fit-content;
  opacity: ${(props) => (props.$isDragging ? 0 : 1)};
`;

type DraggableCardProps = {
  card: CardType,
  className?: string,
  width: number,
  isActive?: boolean,
  isDraggable: boolean,
  showPreview?: boolean,
  onClick?: () => void,
};

export default function DraggableCard({
  card,
  className,
  width,
  isActive,
  isDraggable,
  showPreview,
  onClick,
}: DraggableCardProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    item: card,
    type: DragType.CARD,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => !!isDraggable,
  }), [card, isDraggable]);

  const ref = useCallback((node: HTMLDivElement | null) => {
    drag(node);
    const img = node?.querySelector('img');
    img?.setAttribute('draggable', `${!!isDraggable}`);
  }, [drag, isDraggable]);

  useEffect(() => {
    if (!showPreview) {
      dragPreview(getEmptyImage(), { captureDraggingState: true });
    }
  }, [dragPreview, showPreview]);

  return (
    <Container
      ref={ref}
      $isDragging={isDragging}
    >
      <Card
        card={card}
        className={className}
        width={width}
        isActive={isActive}
        onClick={onClick}
      />
    </Container>
  );
}
