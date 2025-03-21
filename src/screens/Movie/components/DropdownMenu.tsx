import * as Menu from "zeego/dropdown-menu";

import {
  CreditSelectionProps,
  ImageSelectionProps,
  VideoSelectionProps,
} from "../types";

type Option = CreditSelectionProps | VideoSelectionProps | ImageSelectionProps;

type MenuProps = {
  children: React.ReactElement;
  options: Option[];
  handleSelect: (value: Option["value"], label: Option["label"]) => void;
};

export function DropdownMenu({ children, options, handleSelect }: MenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger className="flex justify-center align-center outline-none">
        {children}
      </Menu.Trigger>

      <Menu.Content>
        {options.map(({ value, label }) => (
          <Menu.Item key={value} onSelect={() => handleSelect(value, label)}>
            <Menu.ItemTitle>{label}</Menu.ItemTitle>
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}
