import React from "react";
import { Link } from "react-router-dom";

function Pagination({ numPages, selected, changePage }) {
  const renderOptions = () => {
    let options = [];

    for (let i = 1; i < numPages + 1; i++) {
      options.push(
        <option selected={selected === i} value={i}>
          Page {i}
        </option>
      );
    }

    return options;
  };

  return (
    <div class="pagination-block">
      <form>
        <select onChange={(e) => changePage(e.target.value)}>
          {renderOptions()}
        </select>
      </form>

      <ul class="pagination">
        <li class="prev">
          <Link>
            <i class="ri-arrow-left-s-line"></i>
          </Link>
        </li>
        <li class="next">
          <Link>
            <i class="ri-arrow-right-s-line"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Pagination;
