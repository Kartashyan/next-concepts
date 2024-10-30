"use client";
import Image from 'next/image';
import { BasicPhoto } from './unsplash';
import { useInfiniteScroll } from './use-infinite-scroll';

export const PhotoGrid = ({ data }: {
  data: BasicPhoto[];
}) => {
  const lastItemRef = useInfiniteScroll(!data, () => console.log("load more"));
  return (
    <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((photo) => (
        <Photo key={photo.id} photo={photo} />
      ))}
      <div role="sentinel" ref={lastItemRef} className='w-full h-[1px]'/>
    </div>
  );
}

function Photo({ photo }: { photo: BasicPhoto }) {
  return (
    <div className="relative overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1">
      <Image
        src={photo.urls.small}
        width={photo.width/10}
        height={photo.height/10}
        alt={photo.description || photo.alt_description || 'Photo'}
        className="object-cover w-full h-full"
      />
    </div>
  );
}

