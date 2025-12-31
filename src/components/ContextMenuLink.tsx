import { Link, LinkProps } from "expo-router";

// TODO: fix TypeScript errors

type BaseProps = {
  href: LinkProps["href"];
  children: React.ReactNode;
  onPress?: () => void;
};

type ContextMenuLinkProps = BaseProps &
  (
    | {
        handleShareSelect?: () => void;
        handleRemoveSelect?: () => void;
        handleCountdownToggle?: {
          action: () => void;
          buttonText: string;
        };
        isOnboarding?: undefined;
      }
    | {
        handleShareSelect?: never;
        handleRemoveSelect?: never;
        handleCountdownToggle?: never;
        isOnboarding: true;
      }
  );

export const ContextMenuLink = ({
  href,
  children,
  handleShareSelect,
  handleRemoveSelect,
  handleCountdownToggle,
  isOnboarding,
  onPress,
}: ContextMenuLinkProps) => (
  <Link href={href} asChild onPress={onPress}>
    <Link.Trigger>{children}</Link.Trigger>
    <Link.Menu>
      {handleCountdownToggle && (
        <Link.MenuAction
          onPress={handleCountdownToggle.action}
          title={handleCountdownToggle.buttonText}
        />
      )}
      {handleShareSelect && (
        <Link.MenuAction onPress={handleShareSelect} title="Share" />
      )}
      {handleRemoveSelect && (
        <Link.MenuAction
          onPress={handleRemoveSelect}
          title="Remove from History"
        />
      )}
      {isOnboarding && (
        <Link.MenuAction onPress={() => null} title="You did it!" />
      )}
    </Link.Menu>
  </Link>
);
