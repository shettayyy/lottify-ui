import { ExclamationTriangleIcon } from '@heroicons/react/16/solid';

export type NotFoundProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function NotFound({ title, description, icon }: NotFoundProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="flex animate-bounce items-center">
        {icon || <ExclamationTriangleIcon className="h-32 w-32 text-primary" />}
      </div>

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{title}</h1>
        <p className="mb-4 text-lg">{description}</p>
      </div>
    </div>
  );
}
