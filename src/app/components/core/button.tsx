import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  startAdornment,
  endAdornment,
  className,
  ...restProps
}) => {
  return (
    <button
      className={clsx(
        'flex items-center justify-center space-x-2 rounded-md border border-transparent px-4 py-2 text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        className,
      )}
      {...restProps}
    >
      {startAdornment && (
        <span className="-ml-1 flex-shrink-0">{startAdornment}</span>
      )}
      {children}
      {endAdornment && (
        <span className="-mr-1 flex-shrink-0">{endAdornment}</span>
      )}
    </button>
  );
};

export default Button;
