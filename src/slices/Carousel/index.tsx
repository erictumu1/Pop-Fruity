"use client";
import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { Content } from "@prismicio/client";
import { PrismicText, SliceComponentProps } from "@prismicio/react";
import { Center, Environment, View } from "@react-three/drei";
import clsx from "clsx";
import gsap from "gsap";
import { FC, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { ArrowIcon } from "./ArrowIcon";
import { WavyCircles } from "./WavyCircles";

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

export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

const Carousel: FC<CarouselProps> = ({ slice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sodaCanRef = useRef<Group>(null);
  const leftCanRef = useRef<HTMLDivElement>(null);
  const rightCanRef = useRef<HTMLDivElement>(null);
  const centerCanContainerRef = useRef<HTMLDivElement>(null);

  const prevIndex = (currentIndex - 1 + FLAVORS.length) % FLAVORS.length;
  const nextIndex = (currentIndex + 1) % FLAVORS.length;

  function changeFlavor(newIndex: number) {
    const idx = (newIndex + FLAVORS.length) % FLAVORS.length;

    // Rotate center can 360 degrees
    if (sodaCanRef.current) {
      gsap.fromTo(
        sodaCanRef.current.rotation,
        { y: sodaCanRef.current.rotation.y },
        {
          y: sodaCanRef.current.rotation.y + Math.PI * 2,
          duration: 1,
          ease: "power2.inOut",
        },
      );
    }

    // Jump animation for left can
    if (leftCanRef.current) {
      gsap.fromTo(
        leftCanRef.current,
        { y: 0 },
        {
          y: -30,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.out",
        },
      );
    }

    // Jump animation for right can
    if (rightCanRef.current) {
      gsap.fromTo(
        rightCanRef.current,
        { y: 0 },
        {
          y: -30,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.out",
        },
      );
    }

    // Jump animation for center can container
    if (centerCanContainerRef.current) {
      gsap.fromTo(
        centerCanContainerRef.current,
        { y: 0 },
        {
          y: -40,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power1.out",
        },
      );
    }

    setCurrentIndex(idx);
  }

  // Update the current year dynamically
  useEffect(() => {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }, []);

  return (
    <section
      className="relative grid h-screen grid-rows-[auto,1fr,auto] overflow-hidden py-12 text-white transition-colors duration-500"
      style={{ backgroundColor: FLAVORS[currentIndex].color }}
    >
      <h2 className="relative mb-12 text-center text-5xl font-bold">
        <PrismicText field={slice.primary.heading} />
      </h2>

      <div className="grid w-full grid-cols-1 items-center gap-8 px-4 lg:grid-cols-3">
        {/* LEFT CAN */}
        <div className="hidden justify-center lg:flex" ref={leftCanRef}>
          <FlavorCard flavor={FLAVORS[prevIndex]} offsetY={0.5} />
        </div>

        {/* CENTER CAN */}
        <div
          className="relative col-span-full flex flex-col items-center justify-center lg:col-auto"
          ref={centerCanContainerRef}
        >
          <WavyCircles className="absolute top-1/2 left-1/2 h-[75vmin] -translate-x-1/2 -translate-y-1/2 text-white/50" />

          <View className="relative z-10 aspect-square h-[65vmin] min-h-40">
            <ambientLight intensity={1.2} />
            <directionalLight intensity={6} position={[0, 2, 3]} />
            <Center position={[0, 0, 1.5]}>
              <FloatingCan
                ref={sodaCanRef}
                floatIntensity={0.3}
                rotationIntensity={1}
                flavor={FLAVORS[currentIndex].flavor}
              />
            </Center>
            <Environment files="/hdr/lobby.hdr" environmentIntensity={0.7} />
          </View>

          <div className="absolute top-1/2 right-0 left-0 z-50 flex -translate-y-1/2 justify-between px-2">
            <ArrowButton
              onClick={() => changeFlavor(currentIndex - 1)}
              direction="left"
              label="Previous"
            />
            <ArrowButton
              onClick={() => changeFlavor(currentIndex + 1)}
              direction="right"
              label="Next"
            />
          </div>

          <div className="relative z-20 mt-4 text-center">
            <p className="text-4xl font-bold">{FLAVORS[currentIndex].name}</p>
            <p className="text-2xl opacity-90">
              <PrismicText field={slice.primary.price_copy} />
            </p>
          </div>
        </div>

        {/* RIGHT CAN */}
        <div className="hidden justify-center lg:flex" ref={rightCanRef}>
          <FlavorCard flavor={FLAVORS[nextIndex]} offsetY={0.5} />
        </div>
      </div>

      {/* White line separating the carousel and footer */}
      <div className="w-full border-t border-white"></div>

      {/* Footer */}
      <footer
        className="absolute bottom-0 w-full py-8 text-center transition-colors duration-500 lg:py-6"
        style={{
          backgroundColor: FLAVORS[currentIndex].color, // Footer background color
        }}
      >
        <p className="copyright">
          &copy; <span id="year"></span> Created by Eric Tumu . All Rights
          Reserved.
        </p>
      </footer>
    </section>
  );
};

export default Carousel;

function FlavorCard({
  flavor,
  offsetY = 0,
}: {
  flavor: (typeof FLAVORS)[0];
  offsetY?: number;
}) {
  return (
    <div
      className="pointer-events-none relative flex flex-col items-center justify-center"
      style={{ transform: `translateY(-${offsetY * 20}%)` }} // Adjust the multiplier if needed
    >
      <WavyCircles className="absolute top-1/2 left-1/2 h-[45vmin] -translate-x-1/2 -translate-y-1/2 text-white/40" />

      <View className="pointer-events-none relative z-10 aspect-square h-[35vmin] min-h-32">
        <ambientLight intensity={1.2} />
        <directionalLight intensity={3} position={[0, 2, 3]} />

        <Center position={[0, 0, 1.5]}>
          <FloatingCan
            floatIntensity={0.2}
            rotationIntensity={0.5}
            flavor={flavor.flavor}
          />
        </Center>
        <Environment files="/hdr/lobby.hdr" environmentIntensity={0.7} />
      </View>
    </div>
  );
}

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
      className="pointer-events-auto relative z-50 size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20"
    >
      <ArrowIcon className={clsx(direction === "right" && "-scale-x-100")} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
