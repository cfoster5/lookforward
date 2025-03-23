import * as Menu from "zeego/context-menu";

export function ContextMenu({
  children,
  handleShareSelect,
  handleRemoveSelect,
  handleCountdownToggle,
}: {
  children?: React.ReactNode;
  handleShareSelect?: () => void;
  handleRemoveSelect?: () => void;
  handleCountdownToggle?: { action: () => void; buttonText: string };
}) {
  return (
    <Menu.Root>
      <Menu.Trigger>{children}</Menu.Trigger>
      <Menu.Content>
        {handleCountdownToggle && (
          <Menu.Item
            key="countdown-toggle"
            onSelect={handleCountdownToggle.action}
          >
            <Menu.ItemTitle>{handleCountdownToggle.buttonText}</Menu.ItemTitle>
          </Menu.Item>
        )}
        {handleShareSelect && (
          <Menu.Item key="share" onSelect={handleShareSelect}>
            <Menu.ItemTitle>Share</Menu.ItemTitle>
          </Menu.Item>
        )}
        {handleRemoveSelect && (
          <Menu.Item key="remove" onSelect={handleRemoveSelect}>
            <Menu.ItemTitle>Remove from History</Menu.ItemTitle>
          </Menu.Item>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
