Empty cell
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

<DndProvider backend={HTML5Backend}>
  <CardCell
    width={200}
  />
</DndProvider>
```

Cell with card
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../game/helper';

<DndProvider backend={HTML5Backend}>
  <CardCell
    card={0}
    width={200}
  />
</DndProvider>
```

Cell with active card
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../game/helper';

<DndProvider backend={HTML5Backend}>
  <CardCell
    card={0}
    isActive
    width={200}
  />
</DndProvider>
```

Cell with draggable card
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../game/helper';

<DndProvider backend={HTML5Backend}>
  <CardCell
    card={0}
    width={200}
    isDraggable
  />
</DndProvider>
```

Cell with active draggable card
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../game/helper';

<DndProvider backend={HTML5Backend}>
  <CardCell
    card={0}
    isActive
    width={200}
    isDraggable
  />
</DndProvider>
```

Cell with draggable card with preview
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../game/helper';

<DndProvider backend={HTML5Backend}>
  <CardCell
    card={0}
    width={200}
    isDraggable
    showPreview
  />
</DndProvider>
```

Cell with active draggable card with preview
```jsx
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { indexToCard } from '../../game/helper';

<DndProvider backend={HTML5Backend}>
  <CardCell
    card={0}
    isActive
    width={200}
    isDraggable
    showPreview
  />
</DndProvider>
```
