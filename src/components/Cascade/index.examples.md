Empty cascade
```jsx
<Cascade
  cards={[]}
  width={200}
/>
```

Cascade with cards
```jsx
<div style={{ height: '500px' }}>
  <Cascade
    cards={[0, 1, 2]}
    width={200}
  />
</div>
```

Cascade with active card
```jsx
<div style={{ height: '500px' }}>
  <Cascade
    cards={[0, 1, 2]}
    width={200}
    activeCard={2}
  />
</div>
```