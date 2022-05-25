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

export default function CardCell({ card, className, isActive, onClick }) {
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
