"use client";
import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { Content } from "@prismicio/client";
import { PrismicText, SliceComponentProps } from "@prismicio/react";
import { Center, Environment, View } from "@react-three/drei";
import clsx from "clsx";
import gsap from "gsap";
import { FC, useRef, useState } from "react";
import { Group } from "three";
import { ArrowIcon } from "./ArrowIcon";
import { WavyCircles } from "./WavyCircles";

const SPINS_ON_CHANGE = 8;
const FLAVORS: {
  flavor: SodaCanProps["flavor"];
  color: string;
  name: string;
}[] = [
  { flavor: "blackCherry", color: "#710523", name: "Black Cherry" },
  { flavor: "grape", color: "#572981", name: "Grape Goodness" },
  { flavor: "lemonLime", color: "#164405", name: "Lemon Lime" },
  {
    flavor: "strawberryLemonade",
    color: "#690B3D",
    name: "Strawberry Lemonade",
  },
  { flavor: "watermelon", color: "#4B7002", name: "Watermelon Crush" },
];

/**
 * Props for `Carousel`.
 */
export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

/**
 * Component for "Carousel" Slices.
 */
const Carousel: FC<CarouselProps> = ({ slice }) => {
  const [currentFlavorIndex, setCurrentFlavourIndex] = useState(0);

  const sodacanRef = useRef<Group>(null);

  function changeFlavour(index: number) {
    if (!sodacanRef.current) return;

    const nextIndex = (index + FLAVORS.length) % FLAVORS.length;

    const tl = gsap.timeline();

    tl.to(
      sodacanRef.current.rotation,
      {
        y:
          index > currentFlavorIndex
            ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
            : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: "power2.inOut",
        duration: 1,
      },
      0,
    )
      .to(
        ".background, .wavy-cirlces-outer, .wavy-circles-inner",
        {
          background: FLAVORS[nextIndex].color,
          fill: FLAVORS[nextIndex].color,
          ease: "power2.inOut",
          duration: 1,
        },
        0,
      )
      .to(".text-wrapper", { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to({}, { onStart: () => setCurrentFlavourIndex(nextIndex) }, 0.5)
      .to(".text-wrapper", { duration: 2, y: 0, opacity: 1 }, 0.7);

    setCurrentFlavourIndex(nextIndex);
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="carousel justify center relative grid h-screen grid-rows-[auto,4fr,auto] overflow-hidden bg-white py-12 text-white"
    >
      <div className="background absolute inset-0 bg-[#710523]/50">
        <WavyCircles className="absolute top-1/2 left-1/2 z-0 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523] opacity-50" />

        <h2 className="relative text-center text-5xl font-bold">
          <PrismicText field={slice.primary.heading} />
        </h2>

        <div className="relative z-10 flex items-center justify-center gap-4">
          {/* Left Button */}
          <ArrowButton
            onClick={() => changeFlavour(currentFlavorIndex - 1)}
            direction="left"
            label="Previous Flavor"
          />

          {/* Can */}
          <div className="aspect-square h-[70vmin] min-h-40 w-[70vmin]">
            <View className="h-full w-full">
              <Center position={[0, 0, 1.5]}>
                <FloatingCan
                  floatIntensity={0.3}
                  rotationIntensity={1}
                  flavor={FLAVORS[currentFlavorIndex].flavor}
                  ref={sodacanRef}
                />
              </Center>
              <Environment
                files="/hdr/lobby.hdr"
                environmentIntensity={0.6}
                environmentRotation={[0, 3, 0]}
              />
              <directionalLight intensity={6} position={[0, 1, 1]} />
            </View>
          </div>

          {/* Right Button */}
          <ArrowButton
            onClick={() => changeFlavour(currentFlavorIndex + 1)}
            direction="right"
            label="Next Flavor"
          />
        </div>

        <div className="text-area relative mx-auto text-center">
          <div className="text-wrapper text-4xl font-medium">
            <p>{FLAVORS[currentFlavorIndex].name}</p>
          </div>

          <div className="mt-2 text-2xl font-normal opacity-90">
            <PrismicText field={slice.primary.price_copy} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;

type ArrowButtonProps = {
  direction?: "right" | "left";
  label: string;
  onClick: () => void;
};

function ArrowButton({
  label,
  onClick,
  direction = "right",
}: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20"
    >
      <ArrowIcon className={clsx(direction === "right" && "-scale-x-100")} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
