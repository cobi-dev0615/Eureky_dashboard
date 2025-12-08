import { cn } from "@/lib/utils";
import TasksIconSVG from "@/assets/icons/tasks-icon.svg";

export const TasksIcon = ({ className, size = 20, ...props }) => {
  return (
    <img
      src={TasksIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn("svg-icon", className)}
      {...props}
    />
  );
};

