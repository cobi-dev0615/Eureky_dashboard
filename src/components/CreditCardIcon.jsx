"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export const CreditCardIcon = forwardRef(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 1,
      isAnimated = true,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation();
    const stripeControls = useAnimation();
    const swipeControls = useAnimation();
    const reduced = useReducedMotion();

    useImperativeHandle(ref, () => {
      return {
        startAnimation: () => {
          if (reduced) {
            controls.start("normal");
            stripeControls.start("normal");
            swipeControls.start("normal");
          } else {
            controls.start("animate");
            stripeControls.start("animate");
            swipeControls.start("animate");
          }
        },
        stopAnimation: () => {
          controls.start("normal");
          stripeControls.start("normal");
          swipeControls.start("normal");
        },
      };
    });

    const handleEnter = useCallback(
      (e) => {
        if (!isAnimated || reduced) return;

        // Only auto-animate if not controlled externally (no ref passed)
        // If ref exists, it means external control is expected
        if (!ref) {
          controls.start("animate");
          stripeControls.start("animate");
          swipeControls.start("animate");
        }
        if (onMouseEnter) {
          onMouseEnter(e);
        }
      },
      [
        controls,
        stripeControls,
        swipeControls,
        reduced,
        isAnimated,
        onMouseEnter,
        ref,
      ],
    );

    const handleLeave = useCallback(
      (e) => {
        // Only auto-stop if not controlled externally (no ref passed)
        // If ref exists, it means external control is expected
        if (!ref) {
          controls.start("normal");
          stripeControls.start("normal");
          swipeControls.start("normal");
        }
        if (onMouseLeave) {
          onMouseLeave(e);
        }
      },
      [controls, stripeControls, swipeControls, onMouseLeave, ref],
    );

    const cardTilt = {
      normal: { rotate: 0, scale: 1, x: 0, y: 0 },
      animate: {
        rotate: [0, -4, 2, 0],
        scale: [1, 1.02, 1],
        x: [0, -0.4, 0],
        y: [0, -0.3, 0],
        transition: { duration: 0.6 * duration, ease: "easeInOut" },
      },
    };

    const stripeSlide = {
      normal: { x: 0, opacity: 1 },
      animate: {
        x: [-2, 0],
        opacity: [0.7, 1],
        transition: {
          duration: 0.4 * duration,
          ease: "easeOut",
          delay: 0.08,
        },
      },
    };

    const swipeLine = {
      normal: { pathLength: 0, opacity: 0 },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1, 0.9],
        transition: {
          duration: 0.5 * duration,
          ease: "easeInOut",
          delay: 0.18,
        },
      },
    };

    const embossPulse = {
      normal: { scale: 1 },
      animate: {
        scale: [1, 1.035, 1],
        transition: {
          duration: 0.28 * duration,
          ease: "easeOut",
          delay: 0.3,
        },
      },
    };

    return (
      <motion.div
        className={cn("inline-flex items-center justify-center", className)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        {...props}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-credit-card-icon lucide-credit-card"
        >
          <motion.g variants={cardTilt} initial="normal" animate={controls}>
            <motion.rect
              width="20"
              height="14"
              x="2"
              y="5"
              rx="2"
              variants={embossPulse}
              initial="normal"
              animate={controls}
            />
            <motion.line
              x1="2"
              x2="22"
              y1="10"
              y2="10"
              variants={stripeSlide}
              initial="normal"
              animate={stripeControls}
            />
            <motion.path
              d="M5 15 H15"
              stroke="currentColor"
              strokeWidth="1.5"
              variants={swipeLine}
              initial="normal"
              animate={swipeControls}
            />
          </motion.g>
        </motion.svg>
      </motion.div>
    );
  },
);

CreditCardIcon.displayName = "CreditCardIcon";

