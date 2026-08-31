import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface SubjectFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  uniqueSubjects: string[];
}

export const SubjectFormField = <T extends FieldValues>({
  control,
  name,
  uniqueSubjects,
}: SubjectFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const [open, setOpen] = useState(false);
        const [searchValue, setSearchValue] = useState('');
        const handleSelect = (val: string) => {
          field.onChange(val);
          setOpen(false);
          setSearchValue('');
        };
        return (
          <FormItem>
            <FormLabel className="text-xs font-bold tracking-wider text-gray-600 uppercase">
              Bộ môn học
            </FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      'w-full justify-between bg-gray-50 text-xs font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value || 'Chọn bộ môn'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Tìm hoặc gõ môn học"
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="text-xs"
                  />
                  <CommandList>
                    <CommandEmpty className="p-1">
                      {searchValue.trim() ? (
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleSelect(searchValue.trim())}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Thêm môn: "{searchValue.trim()}"
                        </button>
                      ) : (
                        <p className="py-2 text-center text-xs text-gray-500">
                          Không tìm thấy môn học
                        </p>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {uniqueSubjects.map((sub) => (
                        <CommandItem
                          key={sub}
                          value={sub}
                          onSelect={() => handleSelect(sub)}
                          className="text-xs"
                        >
                          <Check
                            className={cn(
                              'mr-2 h-3.5 w-3.5',
                              field.value === sub ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {sub}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
