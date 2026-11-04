import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { navigate } from './router';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/** A real <a href> (crawlable, opens in new tabs) that navigates client-side on a plain click. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, onClick, target, ...rest }, ref) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || target === '_blank') return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };
  return <a ref={ref} href={to} target={target} onClick={handleClick} {...rest} />;
});
