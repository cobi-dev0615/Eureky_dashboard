import { cn } from "@/lib/utils";
import DeleteIconSVG from "@/assets/icons/delete-icon.svg";

export const DeleteIcon = ({ className, size = 16, ...props }) => {
  return (
    <img
      src={DeleteIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn(className)}
      {...props}
    />
  );
};

