"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle } from "react";

export const DashboardIcon = forwardRef(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 24,
      duration = 0.6,
      isAnimated = true,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation();
    const reduced = useReducedMotion();

    useImperativeHandle(ref, () => {
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleEnter = useCallback(
      (e) => {
        if (!isAnimated || reduced) return;

        // Only auto-animate if not controlled externally (no ref passed)
        // If ref exists, it means external control is expected
        if (!ref) {
          controls.start("animate");
        }
        if (onMouseEnter) {
          onMouseEnter(e);
        }
      },
      [controls, reduced, isAnimated, onMouseEnter, ref],
    );

    const handleLeave = useCallback(
      (e) => {
        // Only auto-stop if not controlled externally (no ref passed)
        // If ref exists, it means external control is expected
        if (!ref) {
          controls.start("normal");
        }
        if (onMouseLeave) {
          onMouseLeave(e);
        }
      },
      [controls, onMouseLeave, ref],
    );

    const smoothEase = [0.22, 1, 0.36, 1];

    const iconVariants = {
      normal: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.06, 0.98, 1],
        rotate: [0, -1.5, 1.5, 0],
        transition: { duration: 1.1 * duration, ease: "easeInOut" },
      },
    };

    const tileVariants = {
      normal: { opacity: 1, scale: 1, y: 0 },
      animate: (i) => ({
        opacity: [0.6, 1],
        scale: [0.95, 1.04, 1],
        y: [3, -2, 0],
        transition: {
          duration: 0.9 * duration,
          ease: "easeInOut",
          delay: i * 0.08,
        },
      }),
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
          animate={controls}
          initial="normal"
          variants={iconVariants}
        >
          <motion.rect
            width="7"
            height="9"
            x="3"
            y="3"
            rx="1"
            variants={tileVariants}
            custom={0}
            initial="normal"
            animate={controls}
          />
          <motion.rect
            width="7"
            height="5"
            x="14"
            y="3"
            rx="1"
            variants={tileVariants}
            custom={1}
            initial="normal"
            animate={controls}
          />
          <motion.rect
            width="7"
            height="9"
            x="14"
            y="12"
            rx="1"
            variants={tileVariants}
            custom={2}
            initial="normal"
            animate={controls}
          />
          <motion.rect
            width="7"
            height="5"
            x="3"
            y="16"
            rx="1"
            variants={tileVariants}
            custom={3}
            initial="normal"
            animate={controls}
          />
        </motion.svg>
      </motion.div>
    );
  },
);

DashboardIcon.displayName = "DashboardIcon";

