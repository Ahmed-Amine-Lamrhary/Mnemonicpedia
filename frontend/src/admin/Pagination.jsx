import React from "react";
import { Link } from "react-router-dom";

function Pagination(props) {
  return (
    <div class="pagination-block">
      <form>
        <select>
          <option selected value="1">
            1
          </option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
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
