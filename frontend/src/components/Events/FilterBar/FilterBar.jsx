import "./FilterBar.css";

const CATEGORIES = [
  "Technology", "Business", "Workshop", "Music", "Sports",
  "Education", "AI", "Startup", "Health", "Gaming",
  "Food", "Design", "Networking", "Finance",
];

function FilterBar({ category, setCategory, sortBy, setSortBy }) {
  return (
    <div className="filter-bar">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Sort By</option>
        <option value="latest">Latest</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="rating">Highest Rating</option>
      </select>
    </div>
  );
}

export default FilterBar;
