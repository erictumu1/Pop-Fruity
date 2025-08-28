import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";

type Props = {
  buttonLink: LinkField;
  buttonText: string | null;
  classname?: string;
};

export default function Button({ buttonLink, buttonText, classname }: Props) {
  return (
    <PrismicNextLink
      className={clsx(
        "rounded-xl bg-orange-600 px-5 py-4 text-center text-xl font-bold tracking-wide text-white uppercase transition-colors duration-150 hover:bg-orange-700 md:text-2xl",
        classname,
      )}
      field={buttonLink}
    >
      {buttonText}
    </PrismicNextLink>
  );
}
