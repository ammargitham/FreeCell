type ModalProps = {
  open?: boolean,
  children?: React.ReactNode,
};

export default function Modal({ open = false, children }: ModalProps) {
  return (
    <div className={`modal-window ${open ? 'open' : ''}`}>
      <div>{children}</div>
    </div>
  );
}
