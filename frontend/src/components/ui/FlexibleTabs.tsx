import { cva, type VariantProps } from 'class-variance-authority';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
  id: string;
  label: string;
}

interface FlexibleTabsProps extends VariantProps<typeof tabsContainerVariants> {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'extralarge';
}

const FlexibleTabs: React.FC<FlexibleTabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  variant = 'pill',
  size = 'medium',
  className,
}) => {
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    extralarge: 'px-8 py-4 text-xl',
  };
  return (
    <Tabs
      value={activeTabId}
      onValueChange={onChange}
      className={cn(
        'w-full',
        variant === 'pill' ? 'mx-auto mb-12 max-w-md' : '',
        className
      )}
    >
      <TabsList
        className={cn(
          'flex w-full p-1.5 group-data-horizontal/tabs:h-auto',
          variant === 'pill'
            ? 'rounded-full border border-gray-200 bg-white shadow-sm'
            : 'w-full rounded-2xl bg-slate-200/70'
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              'h-auto flex-1 cursor-pointer whitespace-nowrap transition-all duration-300 ease-in-out focus-visible:outline-none',
              sizeClasses[size],
              variant === 'pill'
                ? 'data-[state=active]:bg-primary-dark rounded-full px-6 py-3 text-sm font-semibold data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-500 hover:data-[state=inactive]:bg-gray-50 hover:data-[state=inactive]:text-gray-900'
                : 'rounded-xl px-8 py-2 font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-500 hover:data-[state=inactive]:bg-white/50'
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default FlexibleTabs;
