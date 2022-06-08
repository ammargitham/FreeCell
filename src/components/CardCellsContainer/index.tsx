import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { calcColWidth } from '../../utils';

import CardCell from '../CardCell';

const cellSpacingRem = 1;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  & > div.card-cell {
    margin-left: ${cellSpacingRem}rem;
    /* flex: 1; */

    &:first-child {
      margin-left: 0;
    }
  }

  & div.card {
    position: relative;

    &.active::after {
      content: "";
      display: block;
      position: absolute;
      top: -3px;
      bottom: -3px;
      left: -3px;
      right: -3px;
      border: 3px solid #000;
      border-radius: 8px;
    }
  }
`;

type CardCellsContainerProps = {
  cards?: Array<number | undefined>,
  activeCard?: number,
  cellClickable?: (index: number) => boolean,
  onCellClick?: (index: number) => void,
};

export default function CardCellsContainer({
  cards,
  activeCard,
  cellClickable,
  onCellClick,
}: CardCellsContainerProps) {
  const [cellWidth, setCellWidth] = useState(0);

  const ref = useCallback((node: HTMLDivElement) => {
    if (!node) {
      setCellWidth(0);
      return;
    }
    setCellWidth(calcColWidth(node.clientWidth, 'px', cellSpacingRem, 'rem', 4));
  }, []);

  return (
    <Container
      ref={ref}
    >
      {Array(4)
        .fill(null)
        .map((_, i) => {
          const card = cards && cards[i];
          const isActive = activeCard === card;
          return (
            <CardCell
              // eslint-disable-next-line react/no-array-index-key
              key={`card-cell-${i}`}
              className="card-cell"
              card={card}
              isActive={isActive}
              width={cellWidth}
              onClick={
                cellClickable && cellClickable(i) && onCellClick
                  ? () => onCellClick(i)
                  : undefined
              }
            />
          );
        })}
    </Container>
  );
}
