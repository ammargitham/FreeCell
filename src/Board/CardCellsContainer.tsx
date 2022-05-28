import styled from "styled-components";

import CardCell from "./CardCell";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  /* overflow: hidden; */

  & > div.card-cell {
    margin-left: 1em;
    flex: 1;
    aspect-ratio: 110 / 160;

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
  cards?: Array<number>,
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
  return (
    <Container>
      {Array(4)
        .fill(null)
        .map((_, i) => {
          const card = cards && cards[i];
          const isActive = activeCard === card;
          return (
            <CardCell
              key={`card-cell-${i}`}
              className="card-cell"
              card={card}
              isActive={isActive}
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
