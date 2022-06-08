import { useMemo } from 'react';
import styled from 'styled-components';
// import useComponentSize from "@rehooks/component-size";
import { isNil } from 'lodash';

import { indexToCard } from '../../game/helper';
import Card from '../Card';
// import useWindowSize from "../../utils/useWindowSize";
import useComponentSize from '../../utils/useComponentSize';
import useDebounce from '../../utils/useDebounce';

type ContainerProps = {
  $topOffset: number,
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  height: 100%;

  &.clickable {
    cursor: pointer;
  }

  & div.card {
    margin-top: ${(props) => props.$topOffset}px;
    transition: margin 300ms;
    position: relative;

    &:first-child {
      margin-top: 0;
    }

    /* &.active::after {
      content: "";
      display: block;
      position: absolute;
      top: -3px;
      bottom: -3px;
      left: -3px;
      right: -3px;
      border: 3px solid #000;
      border-radius: 8px;
    } */
  }
`;

type CascadeProps = {
  cards: Array<number>,
  width: number,
  activeCard?: number,
  onCascadeClick?: () => void,
};

export default function Cascade({
  cards = [],
  width,
  activeCard,
  onCascadeClick,
}: CascadeProps) {
  const [ref, { height }] = useComponentSize<HTMLDivElement>();
  const debouncedHeight = useDebounce(height, 200);

  const [cardRef, { height: cardHeight }] = useComponentSize<HTMLDivElement>();
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
    let offset = (debouncedHeight - debouncedCardHeight - 20) / (cards.length - 1);
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    return offset - debouncedCardHeight;
  }, [debouncedHeight, debouncedCardHeight, cards.length, maxOffset]);

  const clickable = useMemo(() => {
    // cascade is always clickable if it contains cards
    if (cards.length > 0) {
      return true;
    }
    // if no cards, its clickable if there is an active card
    return !isNil(activeCard);
  }, [activeCard, cards]);

  return (
    <Container
      className={`cascade ${clickable ? 'clickable' : ''}`}
      ref={ref}
      $topOffset={topCardMargin}
      onClick={clickable ? onCascadeClick : undefined}
    >
      {cards.map((card, i) => {
        const actual = indexToCard(card);
        if (!actual) {
          return null;
        }
        const isActive = activeCard === card;
        return (
          <Card
            ref={i === 0 ? cardRef : null}
            key={card}
            className="card"
            card={actual}
            isActive={isActive}
            width={width}
          />
        );
      })}
    </Container>
  );
}
