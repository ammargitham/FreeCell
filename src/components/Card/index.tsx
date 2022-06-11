import { useMemo, forwardRef, ForwardedRef } from 'react';
import styled from 'styled-components';
import { Card as CardType } from '../../globals/types';

type ContainerProps = {
  $width: number,
  $hideBorder?: boolean,
};

const Container = styled.div<ContainerProps>`
  background: white;
  border-width: ${(props) => (props.$hideBorder ? 0 : 1)}px;
  border-color: black;
  border-style: solid;
  border-radius: 0.5rem;
  width: ${(props) => props.$width - 2}px; // -2 to adjust for border

  &.clickable {
    cursor: pointer;
  }

  &.active {
    transform: scale(1.03);
    box-shadow: 0px 0px 20px 9px #23d5e2;
    border-width: 1px;
  }
`;

type CardProps = {
  card: CardType,
  className?: string,
  width: number,
  isActive?: boolean,
  hideBorder?: boolean,
  onClick?: () => void,
};

function Card(
  {
    card,
    className,
    width,
    isActive,
    hideBorder,
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
      className={`
        ${className || ''}
        ${onClick ? 'clickable' : ''}
        ${isActive ? 'active' : ''}
      `.trim()}
      onClick={onClick || undefined}
      $width={width}
      $hideBorder={hideBorder}
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
