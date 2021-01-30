import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { getUser } from "../../api/user";
import Mnemonics from "../other/Mnemonics";
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

  const { fullname, username } = user;

  return (
    <div className="container">
      <Navs navs={navs()} />

      <div>
        <h1>{fullname}</h1>
        <h5>@{username}</h5>
      </div>

      <Switch>
        <Route
          path="/user/:id/posts"
          render={() => <Mnemonics query={{ author: params.id }} />}
        />
      </Switch>
    </div>
  );
}

export default User;
