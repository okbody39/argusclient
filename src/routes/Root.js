// Libs
import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
// Screens
import Root from "@/screens/Root/Root";
import Home from "@/screens/Home/Home";

import Signin from "@/screens/Signin/Signin";
import Signup from "@/screens/Signup/Signup";
import Failure from "@/screens/Failure/Failure";
import Notice from "@/screens/Notice/Notice";
import Alarm from "@/screens/Alarm/Alarm";

import Change from "@/screens/Change/Change";
import ChangePassword from "@/screens/Change/Password";

import Settings from "@/screens/Settings/Settings";

import HistoryChange from "@/screens/History/Change";
import HistoryFailure from "@/screens/History/Failure";
import HistoryAccess from "@/screens/History/Access";

import VMCreate from "@/screens/VM/Create";

// ADMIN
import Admin from "@/screens/Admin/Admin";
import AdminClient from "@/screens/Admin/Client";
import AdminApprove from "@/screens/Admin/Approve";
import AdminFailure from "@/screens/Admin/Failure";
import AdminNotice from "@/screens/Admin/Notice";
import AdminAlarm from "@/screens/Admin/Alarm";
import AdminReport from "@/screens/Admin/Report";

function PrivateRoute ({component: Component, ...rest}) {
  let ConnInfo = localStorage.getItem("ARGUS.CONNINFO") || "{}";
  let UserToken = localStorage.getItem("ARGUS.USERTOKEN") || "{}";

  // console.log(ConnInfo, UserToken);

  let connInfo = JSON.parse(ConnInfo);
  let userToken = JSON.parse(UserToken);

  let auth = false;
  let redirectPath = "/signin";

  // console.log(connInfo, userToken);

  // if(connInfo.serverUrl && connInfo.serverUrl.length > 0 && connInfo.serverUrl !== "undefined") {
  //   //
  // } else {
  //
  //   redirectPath = "/settings";
  //
  //   return (
  //     <Route
  //       {...rest}
  //       render={(props) =>
  //         <Redirect to={{pathname: redirectPath, state: {from: props.location}}} />
  //       }
  //     />
  //   )
  // }

  if(userToken.username && userToken.username.length > 0) {
    auth = true;
  }

  return (
    <Route
      {...rest}
      render={(props) => auth
        ? <Component {...props} auth={userToken.username}/>
        : <Redirect to={{pathname: redirectPath, state: {from: props.location}}} />}
    />
  );
}

const Routes = () => (
  <HashRouter>
    <Switch>
      <PrivateRoute exact path='/' component={Root} />
      <PrivateRoute path='/home' component={Root} />

      <Route path="/signin" component={Signin} />
      <Route path="/signup" component={Signup} />
      <Route path="/settings" component={Settings} />

      <PrivateRoute path="/failure" component={Failure} />
      <PrivateRoute path="/notice" component={Notice} />
      <PrivateRoute path="/alarm" component={Alarm} />

      <PrivateRoute path="/change/password" component={ChangePassword} />
      <PrivateRoute path="/change" component={Change} />


      <PrivateRoute path="/history/change" component={HistoryChange} />
      <PrivateRoute path="/history/failure" component={HistoryFailure} />
      <PrivateRoute path="/history/access" component={HistoryAccess} />

      <PrivateRoute path="/vm/create" component={VMCreate} />

      {/* ADMIN */}
      <PrivateRoute exact path='/admin' component={Admin} />
      <PrivateRoute path="/admin/client" component={AdminClient} />
      <PrivateRoute path="/admin/approve" component={AdminApprove} />
      <PrivateRoute path="/admin/failure" component={AdminFailure} />
      <PrivateRoute path="/admin/notice" component={AdminNotice} />
      <PrivateRoute path="/admin/alarm" component={AdminAlarm} />
      <PrivateRoute path="/admin/report" component={AdminReport} />

    </Switch>
  </HashRouter>
);

export default Routes;
