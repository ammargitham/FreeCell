import { useMemo, forwardRef, ForwardedRef, CSSProperties } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  border: 1px solid black;
  border-radius: 8px;

  &.clickable {
    cursor: pointer;
  }
`;

type CardProps = {
  card: any, 
  className?: string, 
  style?: CSSProperties,
  onClick?: () => void,
};

function Card({ 
    card, 
    className,
    style,
    onClick,
  }: CardProps,
  ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const name = useMemo(() => {
    if (!card) {
      return undefined;
    }
    return `${card.rank}_of_${card.suit}`;
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
      className={`card ${className || ""} ${onClick ? "clickable" : ""}`}
      style={style}
      onClick={onClick ? onClick : undefined}
    >
      <>
        {src ? (
          <img
            alt={name}
            style={{
              width: "100%",
              height: "100%",
            }}
            src={src}
          />
        ) : null}
      </>
    </Container>
  );
}

export default forwardRef(Card);
