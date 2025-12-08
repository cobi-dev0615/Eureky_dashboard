import { cn } from "@/lib/utils";
import CalendarStackIconSVG from "@/assets/icons/calendar-stack-icon.svg";

export const CalendarStackIcon = ({ className, size = 20, ...props }) => {
  return (
    <img
      src={CalendarStackIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn("svg-icon", className)}
      {...props}
    />
  );
};

