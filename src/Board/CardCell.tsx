import styled from 'styled-components';

import Card from '../components/Card';
import { indexToCard } from '../game/helper';

const EmptyCell = styled.div`
  display: flex;
  border: 1px solid black;
  border-radius: 0.5rem;
  width: 100%;
  /* background: white; */

  &.clickable {
    cursor: pointer;
  }
`;

type CardCellProps = {
  card?: number,
  className?: string,
  isActive?: boolean,
  onClick?: () => void,
};

export default function CardCell({
  card, className, isActive, onClick,
}: CardCellProps) {
  let c;
  if (card !== undefined) {
    c = indexToCard(card);
  }
  if (c === undefined) {
    return (
      <EmptyCell
        className={`${className || ''} ${onClick ? 'clickable' : ''}`}
        onClick={onClick}
      />
    );
  }
  return (
    <Card
      className={`${className || ''} ${isActive && 'active'}`}
      card={c}
      onClick={onClick}
    />
  );
}
