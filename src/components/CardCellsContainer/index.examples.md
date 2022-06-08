All Empty cells
```jsx
<CardCellsContainer />
```

With cards
```jsx
<CardCellsContainer
  cards={[0, 1, undefined, 2]}
/>
```

With an active card
```jsx
<CardCellsContainer
  cards={[0, 1, undefined, 2]}
  activeCard={1}
/>
```