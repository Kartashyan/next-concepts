"use client";

import Image from "next/image";
import { BasicPhoto } from "./unsplash";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { useEffect, useState } from "react";
import { getPhotos } from "./get-photos";
import { usePositions } from "./use-positions";
import { SearchArea } from "./search-area";
import { useDebounce } from "./use-debounce";

const columns_count = 3;
const gap = 1;
const column_width = 220;

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
    const { data } = await getPhotos({ page: page + 1, query: "cat" });
    setPhotos((prev) => [...prev, ...data.results]);
    setPage((prev) => prev + 1);
  };

  const lastItemRef = useInfiniteScroll(!initialData, loadMore);

  const positions = usePositions(photos, columns_count, column_width, gap);

  return (
    <div className="relative">
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
      style={{ left: photo.left + "px", top: photo.top + "px" }}
    >
      <Image
        src={photo.urls.small}
        width={photo.width}
        height={photo.height}
        alt={photo.description || photo.alt_description || "Photo"}
        className="object-cover w-full h-full"
      />
    </div>
  );
}
