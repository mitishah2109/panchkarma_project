import { cn } from '@/lib/utils';

/**
 * Surface container. Compose with the sub-parts:
 *   <Card>
 *     <Card.Header>...</Card.Header>
 *     <Card.Body>...</Card.Body>
 *   </Card>
 */
export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className, children }) {
  return (
    <div className={cn('border-b border-slate-100 px-5 py-3', className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ className, children }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
};

Card.Title = function CardTitle({ className, children }) {
  return (
    <h3 className={cn('text-sm font-semibold text-slate-700', className)}>
      {children}
    </h3>
  );
};
