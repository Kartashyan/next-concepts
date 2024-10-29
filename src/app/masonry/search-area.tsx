"use client";

export const SearchArea = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SearchInput />
      <SearchButton />
    </div>
  );
}

function SearchInput() {
  return (
    <input
      type="text"
      placeholder="Search..."
      className="p-2 border border-gray-300 rounded-lg"
    />
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      className="p-2 bg-blue-500 text-white rounded-lg"
    >
      Search
    </button>
  );
}