import { useMemo, forwardRef, ForwardedRef } from 'react';
import styled from 'styled-components';
import { Card as CardType } from '../../globals/types';

type ContainerProps = {
  $width: number,
};

const Container = styled.div<ContainerProps>`
  background: white;
  border: 1px solid black;
  border-radius: 8px;
  width: ${(props) => props.$width}px;

  &.clickable {
    cursor: pointer;
  }
`;

type CardProps = {
  card: CardType,
  className?: string,
  width: number,
  onClick?: () => void,
};

function Card(
  {
    card,
    className,
    width,
    onClick,
  }: CardProps,
  ref: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  const name = useMemo(() => {
    if (!card) {
      return undefined;
    }
    return `${card.rank}_of_${card.suit.name}`;
  }, [card]);

  const src = useMemo(() => {
    if (!name) {
      return undefined;
    }
    return `images/cards/${name}.png`;
  }, [name]);

  return (
    <Container
      ref={ref}
      className={`card ${className || ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick || undefined}
      $width={width}
    >
      {src ? (
        <img
          alt={name}
          style={{
            width: '100%',
            height: '100%',
          }}
          src={src}
        />
      ) : null}
    </Container>
  );
}

export default forwardRef(Card);
