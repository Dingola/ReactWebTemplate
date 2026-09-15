import type { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

import styles from './Button.module.css';

/** Props accepted by the reusable {@link Button} component. */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual emphasis applied to the button. Defaults to `primary`. */
  variant?: 'primary' | 'secondary';
};

/**
 * Renders a styled native button while preserving all standard button attributes.
 *
 * The default `type` is `button` so placing the component inside a form does not
 * submit that form unintentionally.
 */
export function Button({ className, type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant], className)} type={type} {...props} />
  );
}
