import { useRef, useState, useEffect } from "react";

export default function useDynamicSVGImport(path, options = {}) {
  const ImportedIconRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        ImportedIconRef.current = (
          await import(`../images/${path}`)
        ).ReactComponent;
        if (onCompleted) {
          onCompleted(path, ImportedIconRef.current);
        }
      } catch (err) {
        if (onError) {
          onError(err);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [path, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}
