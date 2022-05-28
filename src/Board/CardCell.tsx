import styled from "styled-components";
import { isNil } from "lodash";

import Card from "./Card";
import { indexToCard } from "../game/helper";

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

export default function CardCell({ card, className, isActive, onClick }: CardCellProps) {
  return !isNil(card) ? (
    <Card
      className={`${className || ""} ${isActive && "active"}`}
      card={indexToCard(card)}
      onClick={onClick}
    />
  ) : (
    <EmptyCell
      className={`${className || ""} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    />
  );
}
