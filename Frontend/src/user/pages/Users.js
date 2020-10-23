import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    { id: "u1", name: "nelli", image: "https://i.imgur.com/187Y4u3.png" },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
