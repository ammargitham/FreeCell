import styled from 'styled-components';

import Card from '../Card';
import { indexToCard } from '../../game/helper';

type EmptyCellProp = {
  $width: number,
};

const EmptyCell = styled.div<EmptyCellProp>`
  border: 1px solid black;
  border-radius: 0.5rem;
  width: ${(props) => props.$width}px;
  aspect-ratio: 73 / 108;

  &.clickable {
    cursor: pointer;
  }
`;

type CardCellProps = {
  card?: number,
  className?: string,
  isActive?: boolean,
  width: number,
  onClick?: () => void,
};

export default function CardCell({
  card,
  className,
  isActive,
  width,
  onClick,
}: CardCellProps) {
  let c;
  if (card !== undefined) {
    c = indexToCard(card);
  }
  if (c === undefined) {
    return (
      <EmptyCell
        className={`${className || ''} ${onClick ? 'clickable' : ''}`}
        $width={width}
        onClick={onClick}
      />
    );
  }
  return (
    <Card
      className={`${className || ''} ${isActive && 'active'}`}
      card={c}
      width={width}
      onClick={onClick}
    />
  );
}
