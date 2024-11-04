"use client";

export const SearchArea = ({value, onChange}: {value: string, onChange: (value: string) => void}) => {
  return (
    <div className="fixed p-4 top-1 z-10 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="p-2 w-full sm:w-1/2 border border-gray-300 rounded-lg text-black"
      />
    </div>
  );
};
