import { RefObject, useEffect, useState } from 'react';

// https://dev.to/alejomartinez8/how-to-detect-images-loaded-in-react-39fa
export default function useOnLoadImages(ref: RefObject<HTMLElement>) {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const updateStatus = (images: Array<HTMLImageElement>) => {
      const newStatus = images
        .map((image) => image.complete)
        .every((item) => item);
      setStatus(newStatus);
    };

    if (!ref || !ref.current) return;

    const imagesLoaded: Array<HTMLImageElement> = Array.from(ref.current.querySelectorAll('img'));

    if (imagesLoaded.length === 0) {
      setStatus(true);
      return;
    }

    imagesLoaded.forEach((image) => {
      image.addEventListener('load', () => updateStatus(imagesLoaded), {
        once: true,
      });
      image.addEventListener('error', () => updateStatus(imagesLoaded), {
        once: true,
      });
    });
  }, [ref]);

  return status;
}
