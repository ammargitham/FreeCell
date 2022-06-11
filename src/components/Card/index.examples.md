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

No border
```jsx
import { indexToCard } from '../../game/helper';

<Card
  card={indexToCard(0)}
  width={200}
  hideBorder
/>
```

No border, active (should show border)
```jsx
import { indexToCard } from '../../game/helper';

<Card
  card={indexToCard(0)}
  width={200}
  hideBorder
  isActive
/>
```
