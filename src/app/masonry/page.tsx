import { getPhotos } from "./get-photos";
import { PhotoGrid } from "./photo-grid";

export const MasonryPage = async () => {
  const { data } = await getPhotos();
  return (
    <div className="">
      <PhotoGrid data={data.results} />
    </div>
  );
};

export default MasonryPage;
