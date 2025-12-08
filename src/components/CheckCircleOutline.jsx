import { cn } from "@/lib/utils";
import CheckCircleOutlineSVG from "@/assets/icons/check-circle-outline.svg";

export const CheckCircleOutline = ({ className, size = 16, ...props }) => {
  return (
    <img
      src={CheckCircleOutlineSVG}
      alt=""
      width={size}
      height={size}
      className={cn(className)}
      {...props}
    />
  );
};

