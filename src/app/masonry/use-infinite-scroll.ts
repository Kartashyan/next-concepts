import { useRef } from "react";

export function useInfiniteScroll(
  loading: boolean,
  loadMore: () => void,
  loadOffset: number = 0
) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = (node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: `${loadOffset}px`,
      }
    );
    if (node) observer.current.observe(node);
  }

  return lastItemRef;
}