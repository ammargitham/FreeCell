import './styles.scss';

type ButtonProps = {
  disabled?: boolean,
  onClick?: () => void,
  children?: React.ReactNode,
};

export default function Button({
  disabled,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      type="button"
      className="btn action"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
