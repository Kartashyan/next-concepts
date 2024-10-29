"use client";
import Image from 'next/image';
import { BasicPhoto } from './unsplash';

export const PhotoGrid = ({ data }: {
  data: BasicPhoto[];
}) => {
  if (!data) return <div>Loading...</div>;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((photo) => (
        <Photo key={photo.id} photo={photo} />
      ))}
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

