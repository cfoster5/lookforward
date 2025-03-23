import * as Menu from "zeego/context-menu";

export function ContextMenu({
  children,
  handleShareSelect,
  handleRemoveSelect,
}: {
  children?: React.ReactNode;
  handleShareSelect?: () => void;
  handleRemoveSelect?: () => void;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger>{children}</Menu.Trigger>
      <Menu.Content>
        {handleShareSelect && (
          <Menu.Item key="item-1" onSelect={handleShareSelect}>
            <Menu.ItemTitle>Share</Menu.ItemTitle>
          </Menu.Item>
        )}
        {handleRemoveSelect && (
          <Menu.Item key="item-2" onSelect={handleRemoveSelect}>
            <Menu.ItemTitle>Remove</Menu.ItemTitle>
          </Menu.Item>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
