import { type ComponentPropsWithRef, createContext, useContext } from 'react';
import * as styles from './tabs.css';

const TabsContext = createContext(false);

function joinClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}

export type TabsProps = ComponentPropsWithRef<'div'>;

const _TabsRoot = ({ className, ...props }: TabsProps) => (
  <TabsContext value={true}>
    <div
      role='tablist'
      className={joinClassNames(styles.root, className)}
      {...props}
    />
  </TabsContext>
);

export type TabsItemProps = Omit<ComponentPropsWithRef<'button'>, 'role'> & {
  selected: boolean;
};

const _TabsItem = ({
  selected,
  className,
  children,
  type = 'button',
  ...props
}: TabsItemProps) => {
  if (!useContext(TabsContext)) {
    throw new Error('Tabs.Item는 Tabs 안에서 사용해야 합니다.');
  }

  return (
    <button
      type={type}
      role='tab'
      aria-selected={selected}
      className={joinClassNames(styles.item({ selected }), className)}
      {...props}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
};

export const Tabs = Object.assign(_TabsRoot, {
  Item: _TabsItem,
});
