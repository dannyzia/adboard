import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 500,
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  // Alternative: scroll event approach
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.body.offsetHeight;

      if (scrollPosition > bottomPosition - threshold) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check if we need to load more content initially (page not full)
    const checkInitialLoad = () => {
      if (loading || !hasMore) return;
      
      const hasVerticalScrollbar = document.body.offsetHeight > window.innerHeight;
      if (!hasVerticalScrollbar) {
        // Page doesn't have enough content to scroll, load more
        onLoadMore();
      }
    };

    // Check after a short delay to ensure content is rendered
    const timeoutId = setTimeout(checkInitialLoad, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [loading, hasMore, onLoadMore, threshold]);

  return { lastElementRef };
};
