import * as Menu from "zeego/dropdown-menu";

import {
  CreditSelectionProps,
  ImageSelectionProps,
  VideoSelectionProps,
} from "@/screens/Movie/types";

type SearchSelectionProps = {
  value: "Movies" | "Games";
  label: "Movies" | "Games";
};

type RegionSelectionProps = {
  value: string;
  label: string;
};

type Option =
  | CreditSelectionProps
  | VideoSelectionProps
  | ImageSelectionProps
  | SearchSelectionProps
  | RegionSelectionProps;

type MenuProps = {
  children: React.ReactElement;
  options: Option[];
  handleSelect: (value: Option["value"], label: Option["label"]) => void;
  selectedValue?: Option["value"];
};

export function DropdownMenu({
  children,
  options,
  handleSelect,
  selectedValue,
}: MenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger className="flex justify-center align-center outline-none">
        {children}
      </Menu.Trigger>

      <Menu.Content>
        {options.map(({ value, label }) => (
          <Menu.CheckboxItem
            key={value}
            value={value === selectedValue ? "on" : "off"}
            onValueChange={() => handleSelect(value, label)}
          >
            <Menu.ItemIndicator />
            <Menu.ItemTitle>{label}</Menu.ItemTitle>
          </Menu.CheckboxItem>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}
