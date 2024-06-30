
import React from "react";
import StackNavigator from "./navigation/StackNavigator";
import { UserProvider } from "./UserContext";

const App = () => {
  return (
    <UserProvider>
      <StackNavigator />
    </UserProvider>
  );
};

export default App;
