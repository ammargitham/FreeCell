import styled from 'styled-components';

import Cascade from './Cascade';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  flex: 1;
  align-items: center;
  overflow: hidden;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1300px;
  width: calc(100% - 2rem);
  height: 100%;

  & > div.cascade {
    margin-left: 1rem;
    flex: 1;

    &:first-child {
      margin-left: 0;
    }
  }
`;

type TableauProps = {
  cascades: Array<Array<number>>,
  activeCard?: number,
  onCascadeClick?: (index: number) => void,
};

export default function Tableau({
  cascades = Array(8).fill([]),
  activeCard,
  onCascadeClick,
}: TableauProps) {
  return (
    <Container>
      <SubContainer>
        {Array.from({ length: 8 }).map((_v, i) => (
          <Cascade
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            cards={cascades[i]}
            activeCard={activeCard}
            onCascadeClick={() => onCascadeClick && onCascadeClick(i)}
          />
        ))}
      </SubContainer>
    </Container>
  );
}
