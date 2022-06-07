Default
```jsx
import { indexToCard } from '../../game/helper';

<Card
  card={indexToCard(0)}
  width={200}
/>
```

Clickable card
```jsx
import { indexToCard } from '../../game/helper';

<Card
  card={indexToCard(0)}
  width={200}
  onClick={() => {
    alert('clicked');
  }}
/>
```

Active card
```jsx
import { indexToCard } from '../../game/helper';

<Card
  card={indexToCard(0)}
  width={200}
  isActive
/>
```
