import { cn } from "@/lib/utils";
import MoreOptionsIconSVG from "@/assets/icons/more-options-icon.svg";

export const MoreOptionsIcon = ({ className, size = 20, ...props }) => {
  return (
    <img
      src={MoreOptionsIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn("text-current", className)}
      {...props}
    />
  );
};

