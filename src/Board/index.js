import { useCallback } from "react";
import styled from "styled-components";
import { isNil } from "lodash";

import { Actions } from "./Actions";
import CardCellsContainer from "./CardCellsContainer";
import Tableau from "./Tableau";
import { WonModal } from "./WonModal";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  background: green;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 1300px;
  width: calc(100% - 2rem);
  padding: 1rem 0;
`;

const Spacer = styled.div`
  width: 8%;
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: green;
  z-index: 99;
  display: flex;
  align-items: center;
`;

export default function Board({
  board = {
    canUndo: false,
    hasWon: false,
    activeCard: null,
    openCards: [],
    foundationCards: [],
    cascades: [],
    moveCount: 0,
    elapsedTime: 0,
  },
  loading,
  onOpenCellClick,
  onUndoClick,
  onNewGameClick,
  onResetClick,
  onCascadeClick,
}) {
  const openCellClickable = useCallback(
    (cellIndex) => {
      // if no active card, only cells with cards are clickable
      if (isNil(board.activeCard)) {
        // TODO make cell with cards clickable
        if (board.openCards && board.openCards[cellIndex]) {
          return true;
        }
        return false;
      }

      // if active card is the open cell card itself, it should be clickable
      const isSameAsActive =
        board.openCards && board.openCards[cellIndex] === board.activeCard;
      if (isSameAsActive) {
        return true;
      }

      // if active card, only empty cells are clickable
      if (board.openCards && board.openCards[cellIndex]) {
        return false;
      }
      return true;
    },
    [board.activeCard, board.openCards],
  );

  return (
    <Container>
      {loading ? (
        <LoaderContainer>
          <div className="loader" />
        </LoaderContainer>
      ) : null}
      {board.hasWon ? <WonModal open /> : null}
      <TopRow>
        <SubContainer>
          <CardCellsContainer
            key="open-cells"
            cards={board.openCards}
            activeCard={board.activeCard}
            cellClickable={openCellClickable}
            onCellClick={onOpenCellClick}
          />
          <Spacer />
          <CardCellsContainer
            key="foundation-cells"
            cards={board.foundationCards}
          />
        </SubContainer>
      </TopRow>
      <Tableau
        cascades={board.cascades}
        activeCard={board.activeCard}
        onCascadeClick={onCascadeClick}
      />
      <Actions
        moveCount={board.moveCount}
        elapsedTime={board.elapsedTime}
        canUndo={board.canUndo}
        onUndoClick={onUndoClick}
        onNewGameClick={onNewGameClick}
        onResetClick={onResetClick}
      />
    </Container>
  );
}
