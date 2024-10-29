import { PhotoGrid } from "./photo-grid";
import { BasicPhoto } from "./unsplash";

export const MasonryPage = async () => {
  const response = await fetch(
    `${process.env.api_url}?query=cat&client_id=${process.env.access_key}`,
    { cache: "force-cache" }
  );
  const data = (await response.json()) as { results: BasicPhoto[] };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PhotoGrid data={data.results} />
    </div>
  );
};

export default MasonryPage;
