import { useState } from 'react';
import { Combobox, InputBase, useCombobox } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const AccountInput = (
  {placeholder, onBlur, onChange, onFocus} : {
    placeholder: string;
    onBlur?: any;
    onChange?: any;
    onFocus?: any;
  }
) => {
  const [accounts] = useLocalStorage<string[]>({
    key: 'accounts',
    defaultValue: [],
    getInitialValueInEffect: false,
  })
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const shouldFilterOptions = accounts.every((item) => item !==search);
  const filteredOptions = shouldFilterOptions
    ? accounts.filter((item) => item.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()))
    : accounts;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));
  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        setSearch(val);
        onChange?.(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents='none'
          onClick={() => combobox.openDropdown()}
          onFocus={() => {combobox.openDropdown(); onFocus()}}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || '');
            onBlur();
          }}
          placeholder={placeholder}
          value={search}
          onChange={(event) => {
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
            onChange(event.currentTarget.value);
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default AccountInput;
