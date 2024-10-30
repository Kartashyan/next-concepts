"use client";
import Image from "next/image";
import { BasicPhoto } from "./unsplash";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { useState } from "react";
import { getPhotos } from "./get-photos";

export const PhotoGrid = ({
  initialData: initialData,
}: {
  initialData: BasicPhoto[];
}) => {
  const [photos, setPhotos] = useState<BasicPhoto[]>(initialData);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    const { data } = await getPhotos({ page: page + 1, query: "cat" });
    setPhotos((prev) => [...prev, ...data.results]);
    setPage((prev) => prev + 1);
  };

  const lastItemRef = useInfiniteScroll(!initialData, loadMore);
  
  return (
    <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <Photo key={photo.id} photo={photo} />
      ))}
      <div role="sentinel" ref={lastItemRef} className="w-full h-[1px]" />
    </div>
  );
};

function Photo({ photo }: { photo: BasicPhoto }) {
  return (
    <div className="relative overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1">
      <Image
        src={photo.urls.small}
        width={photo.width / 10}
        height={photo.height / 10}
        alt={photo.description || photo.alt_description || "Photo"}
        className="object-cover w-full h-full"
      />
    </div>
  );
}
