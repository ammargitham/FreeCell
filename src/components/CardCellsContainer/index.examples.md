All Empty cells
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

<DndProvider backend={HTML5Backend}>
  <CardCellsContainer />
</DndProvider>
```

With cards
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

<DndProvider backend={HTML5Backend}>
  <CardCellsContainer
    cards={[0, 1, undefined, 2]}
  />
</DndProvider>
```

With an active card
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

<DndProvider backend={HTML5Backend}>
  <CardCellsContainer
    cards={[0, 1, undefined, 2]}
    activeCard={1}
  />
</DndProvider>
```