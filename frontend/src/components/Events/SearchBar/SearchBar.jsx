import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="searchbar-container">
      <i className="bi bi-search"></i>

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
