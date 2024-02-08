"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  imageUrl: string;
};

const CarImage = ({ imageUrl }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      alt={imageUrl}
      priority
      src={imageUrl}
      fill
      className={`
        object-cover group-hover:opacity-75 duration-700 ease-in-out
        ${
          isLoading
            ? "grayscale blur-2xl scale-110"
            : "grayscale-0 blur-0 scale-100"
        }
      `}
      onLoad={() => setIsLoading(false)}
      sizes="(max-width:768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    />
  );
};

export default CarImage;
