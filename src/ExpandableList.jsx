import { useState } from "react";

const ExpandableList = ({ title, items = [], limit = 3, icon = "•" }) => {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, limit);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 transition-all duration-500 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]">
        <h2 className="text-lg font-semibold">{title}</h2>

        {items.length > limit && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-purple-600 font-medium hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* List */}
      <ul className="space-y-3">
        {visibleItems.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
          >
            <span className="text-purple-500">{icon}</span>
            <span className="text-gray-700 text-sm">{item}</span>
          </li>
        ))}
      </ul>

      {/* Fade effect */}
      {!expanded && items.length > limit && (
        <div className="bg-gradient-to-t from-white to-transparent"></div>
      )}
    </div>
  );
};

export default ExpandableList;
