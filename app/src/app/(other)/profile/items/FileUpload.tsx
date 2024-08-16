'use client';

import React, { useEffect, useState } from 'react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import cn from '@/utils/cn';

export default function FileUpload(props: { files?: string[] }) {
  // eslint-disable-next-line react/destructuring-assignment
  const [files, setFiles] = useState<string[]>(props.files || []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index + 1 >= files.length) {
      setIndex(files.length <= 1 ? 0 : files.length - 1);
    }
  }, [files, index]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const file of e.target.files || []) {
      newFiles.push(URL.createObjectURL(file));
    }
    setFiles(newFiles);
  };

  return (
    <>
      <div className="relative rounded-large shadow-none shadow-black/5">
        <div>
          <div
            className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border"
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor="file"
              className="flex size-full flex-col justify-center text-center"
            >
              {files[index] ? (
                <div className="flex w-full flex-col items-center">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <object
                    className="aspect-square w-full cursor-pointer rounded-lg object-cover object-center"
                    data={files[index]}
                    type="image/png"
                  />
                </div>
              ) : (
                'Click to upload'
              )}
            </label>
            <input
              id="file"
              type="file"
              name="files"
              className="hidden"
              onChange={onChange}
              multiple
            />
          </div>
        </div>
      </div>
      {files.length > 1 && (
        <ScrollShadow
          className="mt-4 flex max-w-full gap-4 px-2 pb-4 pt-2"
          orientation="horizontal"
        >
            {files.map((file, k) => (
              <button
                key={file}
                type="button"
                className={cn('shrink-0 h-24 w-24 items-center justify-center rounded-medium ring-offset-background', {
                  'outline-none ring-2 ring-focus ring-offset-2': index === k,
                })}
                onClick={() => setIndex(k)}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <object
                  className="aspect-square size-24 w-full rounded-large object-cover object-center"
                  data={file}
                  type="image/png"
                />
              </button>
            ))}
        </ScrollShadow>
      )}
    </>
  );
}
