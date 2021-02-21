import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Loading from "./Loading";
import axios from "axios";

function Users(props) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);

  const handleGetUsers = async (page = 1) => {
    setLoading(true);
    setSelectedPage(page);
    try {
      const { data: users } = await axios.get(
        `http://localhost:8000/admin/user?page=${page}`
      );
      const {
        data: { count, limit },
      } = await axios.get("http://localhost:8000/admin/user/count");
      setUsers(users);
      setNumPages(Math.ceil(count / limit));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (_id) => {
    try {
      const {
        data: { suspended },
      } = await axios.post(`http://localhost:8000/admin/user/suspend/${_id}`);
      const allUsers = [...users];
      allUsers.find(({ _id: userId }) => userId === _id).suspended = suspended;
      setUsers(allUsers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // get users
    handleGetUsers();
  }, []);

  return (
    <div className="results">
      {loading && <Loading />}

      {!loading && users.length > 0 && (
        <>
          <div className="table">
            {/* HEADER */}
            <div className="tr">
              <div className="th"></div>
              <div className="th">Name</div>
              <div className="th">ID</div>
              <div className="th">Email</div>
              <div className="th">Date Joined</div>
              <div className="th">Posts</div>
              <div className="th">Status</div>
              <div className="th">Response</div>
            </div>

            {/* BODY */}
            {users.map((user) => (
              <div className="tr">
                <div className="td">
                  <span className="stat active"></span>
                </div>
                <div className="td name">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://mnemonicpedia.com/user/1"
                  >
                    {user.fullname}
                  </a>
                </div>
                <div className="td small">#{user._id}</div>
                <div className="td small">{user.email}</div>
                <div className="td">{user.dateCreated}</div>
                <div className="td">10</div>
                <div
                  className={`td userStat ${
                    user.activated ? "active" : "suspended"
                  }`}
                >
                  {user.activated ? "Active" : "Not Active"}
                </div>
                <div className="td">
                  <button
                    onClick={() => handleSuspend(user._id)}
                    className={user.suspended ? "activate" : "suspend"}
                  >
                    {user.suspended ? "Desuspend" : "Suspend"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination
        numPages={numPages}
        selected={selectedPage}
        changePage={handleGetUsers}
      />

      {!loading && users.length === 0 && <span>No users found</span>}
    </div>
  );
}

export default Users;
