import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  className?: string;
  variant?: 'outlined' | 'text' | 'filled';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'filled',
  ...restProps
}) => {
  return (
    <button
      className={clsx(
        'flex items-center justify-center space-x-2 rounded-md border border-transparent px-4 py-2 text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2',
        {
          'bg-teal-600 text-white hover:bg-teal-700': variant === 'filled',
          'border border-teal-600 bg-transparent text-teal-600 hover:border-teal-700 hover:bg-teal-100':
            variant === 'outlined',
          'text-teal-600 hover:text-teal-700': variant === 'text',
        },
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
