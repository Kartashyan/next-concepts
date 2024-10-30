import { BasicPhoto } from "./unsplash";

export type PhotoSearchOptions = {
  page: number;
  query: string;
  per_page?: number;
};

export async function getPhotos() {
  const request = createRequest({ page: 1, query: 'cats' });
  const response = await fetch(request);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.errors?.join(', ') || response.statusText || 'Unknown error';
    throw new Error(`Error fetching photos: ${response.status} ${errorMessage}`);
  }
  const linksHeaderString = response.headers.get('Link');
  const pagination = parsePaginationLinks(linksHeaderString);
  const data = (await response.json()) as { results: BasicPhoto[] };
  return { data, pagination };
}

function createRequest(search: PhotoSearchOptions, options?: { signal: AbortSignal }): Request {
  const { per_page = 10, page, query } = search;
  const params = new URLSearchParams({
    per_page: String(per_page),
    page: String(page),
    query: query.trim() || "cat",
  });

  const url = new URL(`${process.env.api_url}`);
  url.search = params.toString();

  return new Request(url.toString(), {
    method: 'GET',
    signal: options?.signal,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Client-ID ${process.env.access_key}`,
    },
  });
}

function parsePaginationLinks(linksHeaderString: string | null): Record<string, number> {
  if (!linksHeaderString) return {};

  try {
    return linksHeaderString.split(',').reduce((acc, link) => {
      const [urlPart, relPart] = link.split(';').map((s) => s.trim());
      const urlMatch = urlPart.match(/<(.+)>/);
      const relMatch = relPart.match(/rel="(.+)"/);
      if (urlMatch && relMatch) {
        const url = new URL(urlMatch[1]);
        const page = url.searchParams.get('page');
        if (page) {
          acc[relMatch[1]] = Number(page);
        }
      }
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('parsePaginationLinks error:', error);
    return {};
  }
}