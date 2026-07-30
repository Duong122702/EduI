import { cva, type VariantProps } from 'class-variance-authority';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabsContainerVariants = cva(' flex max-w-md p-1.5 ', {
  variants: {
    variant: {
      pill: 'rounded-full border border-gray-200 shadow-sm bg-white mx-auto mb-12 ',
      grayBox: 'rounded-2xl bg-slate-200/70 w-full',
    },
  },
  defaultVariants: {
    variant: 'pill',
  },
});

interface TabItem {
  id: string | number;
  label: string;
}

interface FlexibleTabsProps extends VariantProps<typeof tabsContainerVariants> {
  tabs: TabItem[];
  activeTabId: string | number;
  onChange: (id: string | number) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'extralarge';
}

const FlexibleTabs: React.FC<FlexibleTabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  variant = 'pill',
  className,
}) => {
  return (
    <Tabs
      value={String(activeTabId)}
      onValueChange={onChange}
      className={className}
    >
      <TabsList
        className={
          variant === 'pill'
            ? 'rounded-full border border-gray-200 bg-white'
            : 'w-full rounded-2xl bg-slate-200/70'
        }
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={String(tab.id)}
            // Gắn class dựa trên variant tabPill / tabGrayBox bạn đã thêm ở Button
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default FlexibleTabs;
