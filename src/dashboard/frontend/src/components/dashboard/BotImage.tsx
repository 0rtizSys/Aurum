import wordmark from "../../assets/sudo.png";

interface BotImageProps {
  compact?: boolean;
}

export const Placeholder = ({ compact = false }: BotImageProps) => {
  return (
    <img
      src={wordmark}
      alt="Aurum dashboard wordmark"
      className={compact ? "h-9 w-auto opacity-95" : "h-11 w-auto opacity-95"}
    />
  );
};
