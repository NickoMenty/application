'use client';

import React, { useEffect, useState } from 'react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import cn from '@/utils/cn';
import Image from 'next/image';

export default function Gallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index + 1 >= images.length) {
      setIndex(images.length <= 1 ? 0 : images.length - 1);
    }
  }, [images, index]);

  return (
    <div className="relative size-full flex-none">
      <div className="relative max-w-fit rounded-large shadow-none shadow-black/5">
        <img
          src={images[index] || 'https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/shoes/product-view/1.jpeg'}
          className="relative z-10 aspect-square size-full rounded-large object-cover object-center shadow-none shadow-black/5"
          alt=""
          width={600}
          height={600}
        />
      </div>
      {images.length > 1 && (
        <ScrollShadow
          className="mt-4 flex max-w-full gap-4 px-2 pb-4 pt-2"
          orientation="horizontal"
        >
          {images.map((file, k) => (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              key={file}
              type="button"
              className={cn('shrink-0 h-24 w-24 items-center justify-center rounded-medium ring-offset-background', {
                'outline-none ring-2 ring-focus ring-offset-2': index === k,
              })}
              onClick={() => setIndex(k)}
            >
              <Image
                src={file}
                className="relative z-10 size-full rounded-large object-cover object-center shadow-none shadow-black/5"
                alt=""
                width={100}
                height={100}
              />
            </button>
          ))}
        </ScrollShadow>
      )}
    </div>
  );
}
