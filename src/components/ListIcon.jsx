import { cn } from "@/lib/utils";
import ListIconSVG from "@/assets/icons/list-icon.svg";

export const ListIcon = ({ className, size = 16, ...props }) => {
  return (
    <img
      src={ListIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn(className)}
      {...props}
    />
  );
};

