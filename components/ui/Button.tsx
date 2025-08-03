import React from 'react';

// Using a generic component pattern for a polymorphic button.
// This allows passing an `as` prop to render a different element (e.g., 'span')
// while maintaining type safety.

// Props specific to our Button component.
type ButtonOwnProps<E extends React.ElementType> = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  baseClasses?: string;
  as?: E;
};

// Combine our props with the props of the underlying element,
// omitting any conflicting keys. We use ComponentPropsWithoutRef to avoid ref-forwarding complexities.
type ButtonProps<E extends React.ElementType> = ButtonOwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>;

const defaultElement = 'button';

export const Button = <E extends React.ElementType = typeof defaultElement>({
  children,
  variant = 'primary',
  className = '',
  baseClasses,
  as,
  ...props
}: ButtonProps<E>) => {
  // Use the 'as' prop for the component, or default to 'button'.
  const Component = as || defaultElement;

  const defaultBaseClasses = 'px-4 py-2 text-sm md:text-base font-bold uppercase tracking-wider border-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: '', // Specific colors are passed via className from parent components.
    secondary: 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80 hover:text-white',
  };

  return (
    <Component
      className={`${baseClasses || defaultBaseClasses} ${variantClasses[variant]} ${className}`}
      // The `props` are now correctly typed for the rendered element.
      {...props}
    >
      {children}
    </Component>
  );
};
