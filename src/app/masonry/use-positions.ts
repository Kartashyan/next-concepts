import { BasicPhoto } from "./unsplash";

export function usePositions(photos: BasicPhoto[], columns_count: number, column_width: number, gap: number) {
  const columns = Array<number>(columns_count).fill(0);
  return photos.map(photo => {
    const column = columns.indexOf(Math.min(...columns));
    const aspect_ratio = photo.width / photo.height;
    const height = column_width / aspect_ratio;
    const left = column * (column_width + gap);
    const top = columns[column];
    columns[column] += height + gap;
    return { ...photo, left, top, height, width: column_width };
  });
}