"use client";

import { SodaCan, SodaCanProps } from "@/components/SodaCan";
import { Float } from "@react-three/drei";
import { forwardRef, ReactNode } from "react";
import { Group } from "three";

type FloatingCanProps = {
  flavor?: SodaCanProps["flavor"];
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
};

type Flavor = SodaCanProps["flavor"];

export function normalizeFlavor(
  f: string | null | undefined,
): Flavor | undefined {
  if (!f) return undefined;

  switch (f.toLowerCase()) {
    case "lemonlime":
      return "lemonLime";
    case "grape":
      return "grape";
    case "blackcherry":
      return "blackCherry";
    case "strawberrylemonade":
      return "strawberryLemonade";
    case "watermelon":
      return "watermelon";
    default:
      return undefined;
  }
}

const FloatingCan = forwardRef<Group, FloatingCanProps>(
  (
    {
      flavor = "blackCherry",
      floatSpeed = 1.5,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <SodaCan flavor={flavor} />
        </Float>
      </group>
    );
  },
);

FloatingCan.displayName = "FloatingCan";

export default FloatingCan;
