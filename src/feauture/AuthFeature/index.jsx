import React from "react";
import { Redirect, Route, Switch } from "react-router";
import { useRouteMatch } from "react-router-dom";
import Login from "../../common/Login";
import Register from "../../common/Register";
import "./style/index.scss";

const AuthFeature = () => {
	const { path } = useRouteMatch();

	return (
		<div className="auth-feature">
			<Switch>
				<Redirect from={path} to={`${path}/login`} exact />
				<Route path={`${path}/login`}>
					<Login />
				</Route>
				<Route path={`${path}/register`}>
					<Register />
				</Route>
			</Switch>
		</div>
	);
};

export default AuthFeature;
