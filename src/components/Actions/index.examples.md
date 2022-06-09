Default actions
```jsx
<div style={{ backgroundColor: 'green' }}>
  <Actions />
</div>
```

Can undo actions
```jsx
<div style={{ backgroundColor: 'green' }}>
  <Actions
    canUndo={true}
  />
</div>
```

With move count and time
```jsx
<div style={{ backgroundColor: 'green' }}>
  <Actions
    canUndo={true}
    elapsedTime={100}
    moveCount={20}
  />
</div>
```
