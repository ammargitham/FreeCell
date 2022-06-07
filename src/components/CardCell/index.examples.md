Empty cell
```jsx
<CardCell
  width={200}
/>
```

Cell with card
```jsx
import { indexToCard } from '../../game/helper';

<CardCell
  card={0}
  width={200}
/>
```

Cell with active card
```jsx
import { indexToCard } from '../../game/helper';

<CardCell
  card={0}
  isActive
  width={200}
/>
```
