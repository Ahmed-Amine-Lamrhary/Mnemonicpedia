import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { getUser } from "../../api/user";
import Navs from "../other/Navs";

function User({ history, match }) {
  const [user, setUser] = useState({});
  const { url, params } = match;

  const handleGetUser = async () => {
    try {
      const { data: user } = await getUser(params.id);
      setUser(user);
    } catch (error) {
      console.error(error);
      history.push("/notFound");
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  const getPosts = () => (
    <>
      <h1>Posts of {user.fullname}</h1>
    </>
  );

  const navs = () => {
    return [
      {
        to: `${url}/posts`,
        text: "Posts",
      },
      {
        to: `/report-user/${params.id}`,
        text: "Report User",
      },
    ];
  };

  return (
    <div className="container">
      <Navs navs={navs()} />

      <Switch>
        <Route path="/user/:id/posts" render={() => getPosts()} />
      </Switch>
    </div>
  );
}

export default User;
