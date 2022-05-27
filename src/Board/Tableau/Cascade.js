import { useMemo } from "react";
import styled from "styled-components";
// import useComponentSize from "@rehooks/component-size";
import { isNil } from "lodash";

import Card from "../Card";
import { indexToCard } from "../../game/helper";
// import useWindowSize from "../../utils/useWindowSize";
import useDebounce from "../../utils/useDebounce";
import useComponentSize from "../../utils/useComponentSize";

const Container = styled.div`
  /* position: relative; */
  display: flex;
  flex-direction: column;
  height: 100%;

  &.clickable {
    cursor: pointer;
  }

  & div.card {
    /* position: absolute; */
    /* top: calc(var(--offset) * 10%); */
    /* margin-top: -100%; */
    margin-top: ${(props) => props.$topOffset}px;
    transition: margin 300ms;
    position: relative;

    &:first-child {
      margin-top: 0;
    }

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

export default function Cascade({ cards = [], activeCard, onCascadeClick }) {
  const [ref, { height }] = useComponentSize();
  const debouncedHeight = useDebounce(height, 200);

  const [cardRef, { height: cardHeight }] = useComponentSize();
  const debouncedCardHeight = useDebounce(cardHeight, 200);

  const maxOffset = useMemo(() => {
    if (!debouncedCardHeight) {
      return 0;
    }
    return debouncedCardHeight * 0.4;
  }, [debouncedCardHeight]);

  const topCardMargin = useMemo(() => {
    if (!debouncedHeight || !debouncedCardHeight || cards.length <= 1) {
      return 0;
    }
    let offset =
      (debouncedHeight - debouncedCardHeight - 20) / (cards.length - 1);
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    return offset - debouncedCardHeight;
  }, [debouncedHeight, debouncedCardHeight, cards.length, maxOffset]);

  const clickable = useMemo(() => {
    // cascade is always clickable if it contains cards
    if (cards && cards.length > 0) {
      return true;
    }
    // if no cards, its clickable if there is an active card
    return !isNil(activeCard);
  }, [activeCard, cards]);

  return (
    <Container
      className={`cascade ${clickable ? "clickable" : ""}`}
      ref={ref}
      $topOffset={topCardMargin}
      onClick={clickable ? onCascadeClick : null}
    >
      {cards.map((card, i) => {
        const actual = indexToCard(card);
        const isActive = activeCard === card;
        return (
          <Card
            ref={i === 0 ? cardRef : null}
            style={{ "--offset": i }}
            className={`${isActive ? "active" : ""}`}
            key={card}
            card={actual}
          />
        );
      })}
    </Container>
  );
}
