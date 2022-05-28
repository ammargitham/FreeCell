import {
  useRef, useState, useEffect, ReactNode,
} from 'react';

type DynamicSVGImportOptions = {
  onCompleted?: (path: string, element?: ReactNode) => void,
  onError?: (error?: any) => void,
};

export default function useDynamicSVGImport(path: string, options: DynamicSVGImportOptions = {}) {
  const ImportedIconRef = useRef<ReactNode | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | undefined>();

  const { onCompleted, onError } = options;

  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        ImportedIconRef.current = (await import(`../images/${path}`)).ReactComponent;
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
