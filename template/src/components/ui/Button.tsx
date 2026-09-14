import type { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

import styles from './Button.module.css';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ className, type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant], className)} type={type} {...props} />
  );
}
