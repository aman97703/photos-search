import { Close, Search } from "@mui/icons-material";
import React from "react";

const Header = ({
  query,
  setQuery,
  handleSearchClick,
  pastQueries,
  clearAllPostQuery,
  showPastQ,
  setShowPastQ,
  clearPastQuery,
}) => {
  return (
    <div className="header_root">
      <div
        className="header_main position-relative"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Search Photos"
          className="flex-grow-1"
          onFocus={(e) => {
            e.stopPropagation();
            setShowPastQ(true);
          }}
          //   onBlur={() => setShowPastQ(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
        />
        <button onClick={handleSearchClick}>
          <Search />
        </button>
        {showPastQ && pastQueries && pastQueries.length > 0 && (
          <div className="past_query_root">
            {pastQueries.map((pq, i) => (
              <div
                key={i}
                className="d-flex align-items-start justify-content-between"
              >
                <p>{pq}</p>
                <button
                  className="post_cancel"
                  onClick={() => clearPastQuery(i)}
                >
                  <Close />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-danger"
              style={{ float: "right" }}
              onClick={clearAllPostQuery}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
