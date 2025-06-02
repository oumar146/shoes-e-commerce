import { useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Filters = ({
  products,
  filters,
  setFilters,
  openSections,
  toggleSection,
  uniqueSizes,
}) => {
  const uniqueCategories = [...new Set(products.map((p) => p.category_name))].filter(Boolean);
  const uniqueGenders = [...new Set(products.map((p) => p.gender_name))].filter(Boolean); 

  const handleCheckboxChange = (filterType, value) => {
    setFilters((prev) => {
      const updated = prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value];
      return { ...prev, [filterType]: updated };
    });
  };

  const handlePriceChange = (e, index) => {
    const value = parseFloat(e.target.value);
    setFilters((prev) => {
      const updated = [...prev.price];
      if (index === 0) {
        updated[0] = Math.min(value, prev.price[1] - 1);
      } else {
        updated[1] = Math.max(value, prev.price[0] + 1);
      }
      return { ...prev, price: updated };
    });
  };

  return (
    <aside className="filters">
      {/* Genre */}
      <div className="filter-section">
        <div className="filter-title" onClick={() => toggleSection("gender")}>
          <span>Genre</span>
          {openSections.gender ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </div>
        {openSections.gender && (
          <div className="filter-options">
            {uniqueGenders.map((gender) => (
              <label key={gender}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange("gender", gender)}
                  checked={filters.gender.includes(gender)}
                />
                {gender}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Catégories */}
      <div className="filter-section">
        <div className="filter-title" onClick={() => toggleSection("category")}>
          <span>Catégorie</span>
          {openSections.category ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </div>
        {openSections.category && (
          <div className="filter-options">
            {uniqueCategories.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange("category", cat)}
                  checked={filters.category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Prix */}
      <div className="filter-section">
        <div className="filter-title" onClick={() => toggleSection("price")}>
          <span>Prix</span>
          {openSections.price ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </div>
        {openSections.price && (
          <div className="filter-options price-range">
            <div className="price-values">
              <span>{filters.price[0]}€</span>
              <span>{filters.price[1]}€</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="1"
              value={filters.price[0]}
              onChange={(e) => handlePriceChange(e, 0)}
              className="range-input"
            />
            <input
              type="range"
              min="0"
              max="500"
              step="1"
              value={filters.price[1]}
              onChange={(e) => handlePriceChange(e, 1)}
              className="range-input"
            />
          </div>
        )}
      </div>

      {/* Tailles */}
      <div className="filter-section">
        <div className="filter-title" onClick={() => toggleSection("size")}>
          <span>Pointure</span>
          {openSections.size ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </div>
        {openSections.size && (
          <div className="sizes-list">
            {uniqueSizes.map((size) => {
              const isSelected = filters.size.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  className={`size-button ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setFilters((prev) => {
                      const newSizes = prev.size.includes(size)
                        ? prev.size.filter((s) => s !== size)
                        : [...prev.size, size];
                      return { ...prev, size: newSizes };
                    });
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Filters;
