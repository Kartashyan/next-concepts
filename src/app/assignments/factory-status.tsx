"use client";

import { useState, ChangeEvent } from "react";

type StatusKey = "sheets" | "beams" | "bolts" | "frames";

interface Status {
  sheets: boolean;
  beams: boolean;
  bolts: boolean;
  frames: boolean;
}

const dependencies: Record<StatusKey, StatusKey[]> = {
  sheets: ["bolts", "frames"],
  beams: ["frames"],
  bolts: ["frames"],
  frames: [],
};

// Add reverse dependencies to track parents
const parentDependencies: Record<StatusKey, StatusKey[]> = {
  frames: ["sheets", "beams", "bolts"],
  bolts: ["sheets"],
  beams: [],
  sheets: [],
};

type StationProps = {
  id: StatusKey;
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Station = ({ id, label, checked, onChange }: StationProps) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <label htmlFor={`${id}-status`} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          id={`${id}-status`}
          onChange={onChange}
          checked={checked}
          className="sr-only"
        />
        <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
          checked ? 'bg-green-400' : 'bg-red-400'
        }`}>
          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}></div>
        </div>
      </div>
      <span className="ml-4 font-medium text-gray-700">{label}</span>
    </label>
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
      checked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {checked ? 'ACTIVE' : 'INACTIVE'}
    </span>
  </div>
);

export function FactoryStatus() {
  const [status, setStatus] = useState<Status>({
    sheets: true,
    beams: true,
    bolts: true, 
    frames: true,
  });

  const updateDependentStations = (
    currentStatus: Status,
    station: StatusKey,
    checked: boolean
  ): Status => {
    const newStatus = { ...currentStatus };

    if (!checked) {
      // When disabling a station
      newStatus[station] = false;
      
      // Recursively disable all dependent stations
      const processDisable = (key: StatusKey) => {
        dependencies[key].forEach(dependent => {
          newStatus[dependent] = false;
          processDisable(dependent);
        });
      };
      processDisable(station);
    } else {
      // When enabling a station
      const canEnable = (key: StatusKey): boolean => {
        const requiredParents = parentDependencies[key];
        return requiredParents.every(parent => newStatus[parent]);
      };

      // Only enable if all prerequisites are met
      if (canEnable(station)) {
        newStatus[station] = true;
      } else {
        newStatus[station] = false;
      }
    }

    return newStatus;
  };

  const handleChange = (key: StatusKey) => (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setStatus(prevStatus => ({
      ...prevStatus,
      ...updateDependentStations(prevStatus, key, checked)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Factory Control Panel</h3>
      <div className="space-y-4">
        <Station
          id="sheets"
          label="SHEETS"
          checked={status.sheets}
          onChange={handleChange("sheets")}
        />
        <Station
          id="beams"
          label="BEAMS"
          checked={status.beams}
          onChange={handleChange("beams")}
        />
        <Station
          id="bolts"
          label="BOLTS"
          checked={status.bolts}
          onChange={handleChange("bolts")}
        />
        <Station
          id="frames"
          label="FRAMES"
          checked={status.frames}
          onChange={handleChange("frames")}
        />
      </div>
    </div>
  );
}
