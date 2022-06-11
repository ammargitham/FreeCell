Non draggable card
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../../game/helper';

<DndProvider backend={HTML5Backend}>
  <DraggableCard
    card={indexToCard(0)}
    width={200}
  />
</DndProvider>
```

Draggable card with preview
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../../game/helper';

<DndProvider backend={HTML5Backend}>
  <DraggableCard
    card={indexToCard(0)}
    width={200}
    isDraggable={true}
    showPreview={true}
  />
</DndProvider>
```

Draggable card without preview
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../../game/helper';

<DndProvider backend={HTML5Backend}>
  <DraggableCard
    card={indexToCard(0)}
    width={200}
    isDraggable={true}
  />
</DndProvider>
```
