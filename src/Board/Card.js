import { useMemo, forwardRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  background: white;
  border: 1px solid black;
  border-radius: 8px;

  &.clickable {
    cursor: pointer;
  }
`;

function Card({ card, className, onClick, ...rest }, ref) {
  const name = useMemo(() => {
    if (!card) {
      return null;
    }
    return `${card.rank}_of_${card.suit}`;
  }, [card]);

  const src = useMemo(() => {
    if (!name) {
      return null;
    }
    return `images/cards/${name}.png`;
  }, [name]);

  return (
    <Container
      ref={ref}
      {...rest}
      className={`card ${className || ""} ${onClick && "clickable"}`}
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
