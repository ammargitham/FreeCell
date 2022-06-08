import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { calcColWidth } from '../../utils';

import Cascade from '../Cascade';

const spacingRem = 1;

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
  width: 100%;
  height: 100%;

  & > div.cascade {
    margin-left: ${spacingRem}rem;
    /* flex: 1; */

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
  const [cascadeWidth, setCascadeWidth] = useState(0);

  const ref = useCallback((node: HTMLDivElement) => {
    if (!node) {
      setCascadeWidth(0);
      return;
    }
    setCascadeWidth(calcColWidth(node.clientWidth, 'px', spacingRem, 'rem', 8));
  }, []);

  return (
    <Container>
      <SubContainer
        ref={ref}
      >
        {Array.from({ length: 8 }).map((_v, i) => (
          <Cascade
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            cards={cascades[i]}
            activeCard={activeCard}
            width={cascadeWidth}
            onCascadeClick={() => onCascadeClick && onCascadeClick(i)}
          />
        ))}
      </SubContainer>
    </Container>
  );
}
