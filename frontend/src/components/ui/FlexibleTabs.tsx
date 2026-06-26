import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Button from './Button';

const tabsContainerVariants = cva(' flex max-w-md p-1.5 ', {
  variants: {
    variant: {
      pill: 'rounded-full border border-gray-200 shadow-sm bg-white mx-auto mb-12 ',
      grayBox: 'rounded-2xl bg-slate-200/7 items-center',
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
  size,
  variant = 'pill',
  className,
}) => {
  const buttonVariantMap: Record<'pill' | 'grayBox', 'tabPill' | 'tabGrayBox'> =
    {
      pill: 'tabPill',
      grayBox: 'tabGrayBox',
    };

  const currentBtnVariant = buttonVariantMap[variant ?? 'pill'] || 'tabPill';
  console.log(currentBtnVariant);
  return (
    <div
      className={twMerge(clsx(tabsContainerVariants({ variant }), className))}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <Button
            key={tab.id}
            variant={currentBtnVariant}
            isActive={isActive}
            size={size}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

export default FlexibleTabs;
