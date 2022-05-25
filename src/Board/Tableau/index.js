import Cascade from "./Cascade";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  flex: 1;
  align-items: center;
  overflow: hidden;
  /* padding: 0 3px; */
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1300px;
  width: calc(100% - 2rem);
  /* padding: 1rem 0; */
  height: 100%;

  & > div.cascade {
    margin-left: 1rem;
    flex: 1;

    &:first-child {
      margin-left: 0;
    }
  }
`;

export default function Tableau({
  cascades = Array(8).fill([]),
  activeCard,
  onCascadeClick,
}) {
  return (
    <Container>
      <SubContainer>
        {Array.from({ length: 8 }).map((_v, i) => {
          return (
            <Cascade
              key={i}
              cards={cascades[i]}
              activeCard={activeCard}
              onCascadeClick={() => onCascadeClick && onCascadeClick(i)}
            />
          );
        })}
      </SubContainer>
    </Container>
  );
}
