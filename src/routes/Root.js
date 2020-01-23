// Libs
import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
// Screens
import Home from "@/screens/Home/Home";
import Signin from "@/screens/Signin/Signin";
import Signup from "@/screens/Signup/Signup";

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
    </Switch>
  </HashRouter>
);

export default Routes;
