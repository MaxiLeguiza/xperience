// RecommendedInfluencers.jsx
// -------------------------------------------------------------
// Lista de influencers populares con su avatar y red social.
// -------------------------------------------------------------

import React from "react";

export default function RecommendedInfluencers({ influencers }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm">
      <h4 className="font-semibold mb-2">🌟 Influencers populares</h4>
      <div className="space-y-3">
        {influencers.map((inf) => (
          <div key={inf.id} className="flex items-center gap-3">
            <img
              src={inf.avatar}
              alt={inf.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{inf.name}</div>
              <div className="text-sm text-gray-500">{inf.social}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
