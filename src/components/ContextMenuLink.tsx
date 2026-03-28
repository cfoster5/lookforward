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
        <Link.MenuAction onPress={handleCountdownToggle.action}>
          {handleCountdownToggle.buttonText}
        </Link.MenuAction>
      )}
      {handleShareSelect && (
        <Link.MenuAction onPress={handleShareSelect}>Share</Link.MenuAction>
      )}
      {handleRemoveSelect && (
        <Link.MenuAction onPress={handleRemoveSelect}>
          Remove from History
        </Link.MenuAction>
      )}
      {isOnboarding && (
        <Link.MenuAction onPress={() => null}>You did it!</Link.MenuAction>
      )}
    </Link.Menu>
  </Link>
);
