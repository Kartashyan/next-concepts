"use client";

import Image from "next/image";
import { BasicPhoto } from "./unsplash";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { useEffect, useState } from "react";
import { getPhotos } from "./get-photos";
import { usePositions } from "./use-positions";
import { SearchArea } from "./search-area";
import { useDebounce } from "./use-debounce";
import { useResizeObserver } from "./use-resize";


const gap = 6;

export const PhotoGrid = ({
  initialData: initialData,
}: {
  initialData: BasicPhoto[];
}) => {
  const [photos, setPhotos] = useState<BasicPhoto[]>(initialData);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("cat");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      handleChange(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleChange = async (query: string) => {
    const { data } = await getPhotos({ page: 1, query });
    setPhotos(data.results);
    setPage(1);
  };

  const loadMore = async () => {
    const { data } = await getPhotos({ page: page + 1, query });
    setPhotos((prev) => [...prev, ...data.results]);
    setPage((prev) => prev + 1);
  };

  const lastItemRef = useInfiniteScroll(!initialData, loadMore);
  const { ref, width } = useResizeObserver();

  const getColumnCount = (width: number) => {
    if (width < 640) return 2;        // Mobile: 2 columns
    if (width < 1024) return 3;       // Tablet/Small screens: 3 columns
    return 4;                         // Larger screens: 4 columns
  };

  const columns_count = getColumnCount(width);
  const photoWidth = (width / columns_count) - gap;
  const positions = usePositions(photos, columns_count, photoWidth, gap);

  return (
    <div className="relative" ref={ref}>
      <SearchArea value={query} onChange={setQuery} />
      {positions.map((photo) => (
        <Photo key={photo.id} photo={photo} />
      ))}
      <div
        role="sentinel"
        ref={lastItemRef}
        className="w-full absolute h-[1px]"
        style={{ top: `${positions[positions.length - 1].top}px` }}
      />
    </div>
  );
};

function Photo({
  photo,
}: {
  photo: BasicPhoto & { left: number; top: number };
}) {
  return (
    <div
      className={`absolute overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1`}
      style={{
        left: photo.left + "px",
        top: photo.top + "px", 
        width: photo.width,
        height: photo.height,
      }}
    >
      <Image
        src={photo.urls.regular}
        width={photo.width}
        height={photo.height}
        alt={photo.description || photo.alt_description || "Photo"}
        className="object-cover w-full h-full"
      />
    </div>
  );
}
