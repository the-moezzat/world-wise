import styles from './Button.module.css';

interface IButton {
  type?: 'primary' | 'back' | 'position';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
}

function Button({ type, onClick, children }: IButton) {
  return (
    <button
      onClick={onClick}
      className={`${styles.btn} ${type ? styles[type] : 'primary'}`}
    >
      {children}
    </button>
  );
}

export default Button;
