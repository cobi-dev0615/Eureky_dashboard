import { cn } from "@/lib/utils";
import HomeIconSVG from "@/assets/icons/home-line-icon.svg";

export const HomeIcon = ({ className, size = 20, ...props }) => {
  return (
    <img
      src={HomeIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn("svg-icon", className)}
      {...props}
    />
  );
};

