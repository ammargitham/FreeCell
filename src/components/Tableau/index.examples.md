Empty Tableau
```jsx
<Tableau
  cards={[]}
/>
```

Tableau with cascades
```jsx
import { getRandomCascades } from '../../game/helper';

const randomCascades = getRandomCascades(100);

<div style={{ height: '500px' }}>
  <Tableau
    cascades={randomCascades}
  />
</div>
```

Tableau with cascades and active card
```jsx
import { getRandomCascades } from '../../game/helper';

const randomCascades = getRandomCascades(100);

<div style={{ height: '500px' }}>
  <Tableau
    cascades={randomCascades}
    activeCard={randomCascades[0][randomCascades[0].length - 1]}
  />
</div>
```
