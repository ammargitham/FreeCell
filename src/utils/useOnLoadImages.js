import { useEffect, useState } from "react";

// https://dev.to/alejomartinez8/how-to-detect-images-loaded-in-react-39fa
export const useOnLoadImages = (ref) => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const updateStatus = (images) => {
      setStatus(
        images.map((image) => image.complete).every((item) => item === true),
      );
    };

    if (!ref || !ref.current) return;

    const imagesLoaded = Array.from(ref.current.querySelectorAll("img"));

    if (imagesLoaded.length === 0) {
      setStatus(true);
      return;
    }

    imagesLoaded.forEach((image) => {
      image.addEventListener("load", () => updateStatus(imagesLoaded), {
        once: true,
      });
      image.addEventListener("error", () => updateStatus(imagesLoaded), {
        once: true,
      });
    });

    return;
  }, [ref]);

  return status;
};
