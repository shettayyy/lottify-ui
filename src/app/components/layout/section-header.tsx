import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  endAdornment?: ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  endAdornment,
  className,
}) => {
  return (
    <div
      className={clsx('flex items-center justify-between pb-4 pt-8', className)}
    >
      <h1 className="font-quicksand text-3xl font-bold uppercase tracking-widest text-slate-100">
        {title}
      </h1>

      {endAdornment && <div className="ml-auto">{endAdornment}</div>}
    </div>
  );
};

export default SectionHeader;
