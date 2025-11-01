import React from "react";

/**
 * districts: array of { id, districtCode, districtName }
 * onSelect: returns { districtCode, districtName }
 */
export default function DistrictSelect({ districts=[], onSelect }) {
  return (
    <select onChange={(e)=> {
      const d = districts.find(x=>x.districtCode===e.target.value);
      onSelect(d || null);
    }}>
      <option value="">Select District</option>
      {districts.map(d => <option key={d.districtCode} value={d.districtCode}>{d.districtName}</option>)}
    </select>
  );
}
