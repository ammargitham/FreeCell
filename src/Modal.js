export const Modal = ({ open = false, children }) => {
  return (
    <div className={`modal-window ${open ? "open" : ""}`}>
      <div>{children}</div>
    </div>
  );
};
