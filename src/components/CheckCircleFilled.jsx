import { cn } from "@/lib/utils";
import CheckCircleFilledSVG from "@/assets/icons/check-circle-filled.svg";

export const CheckCircleFilled = ({ className, size = 16, ...props }) => {
  return (
    <img
      src={CheckCircleFilledSVG}
      alt=""
      width={size}
      height={size}
      className={cn(className)}
      {...props}
    />
  );
};

