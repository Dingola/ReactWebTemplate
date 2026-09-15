import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './Container.module.css';

/** Props accepted by the polymorphic {@link Container} component. */
export type ContainerProps<TElement extends ElementType> = {
  /** HTML element or React component rendered by the container. */
  as?: TElement;
  /** Content constrained by the application's maximum content width. */
  children: ReactNode;
  /** Optional class name appended to the container's local CSS class. */
  className?: string | undefined;
} & Omit<ComponentPropsWithoutRef<TElement>, 'as' | 'children' | 'className'>;

/**
 * Constrains page content to the shared responsive width and horizontal spacing.
 *
 * @typeParam TElement - Element or component selected through the `as` prop.
 */
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
