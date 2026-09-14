import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './Container.module.css';

type ContainerProps<TElement extends ElementType> = {
  as?: TElement;
  children: ReactNode;
  className?: string | undefined;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children' | 'className'>;

export function Container<TElement extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: ContainerProps<TElement>) {
  const Component = as ?? 'div';

  return (
    <Component className={clsx(styles.container, className)} {...props}>
      {children}
    </Component>
  );
}
