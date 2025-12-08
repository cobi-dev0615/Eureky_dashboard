import { cn } from "@/lib/utils";
import CheckIconSVG from "@/assets/icons/check-icon.svg";

export const CheckIcon = ({ className, size = 12, ...props }) => {
  return (
    <img
      src={CheckIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn(className)}
      {...props}
    />
  );
};

