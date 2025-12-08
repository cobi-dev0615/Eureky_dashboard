import { cn } from "@/lib/utils";
import ChartIconSVG from "@/assets/icons/chart-icon.svg";

export const ChartIcon = ({ className, size = 20, ...props }) => {
  return (
    <img
      src={ChartIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn("svg-icon", className)}
      {...props}
    />
  );
};

