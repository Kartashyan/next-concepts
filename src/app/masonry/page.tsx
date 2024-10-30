import { getPhotos } from "./get-photos";
import { PhotoGrid } from "./photo-grid";

const INITIAL_PAGE = 1;
const INITIAL_QUERY = 'cat';

export const MasonryPage = async () => {
  const { data } = await getPhotos({page: INITIAL_PAGE, query: INITIAL_QUERY});
  return (
    <div className="">
      <PhotoGrid initialData={data.results} />
    </div>
  );
};

export default MasonryPage;
