import { cn } from "@/lib/utils";
import EditIconSVG from "@/assets/icons/edit-icon.svg";

export const EditIcon = ({ className, size = 16, ...props }) => {
  return (
    <img
      src={EditIconSVG}
      alt=""
      width={size}
      height={size}
      className={cn(className)}
      {...props}
    />
  );
};

