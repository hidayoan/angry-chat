import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, Switch } from "react-router";
import "./App.scss";
import AuthFeature from "./feauture/AuthFeature";
import ChatFeature from "./feauture/ChatFeature";
import { auth } from "./firebaseConfig/firebase";

const App = () => {
	const [user] = useAuthState(auth);
	console.log(user);
	return (
		<div className="app">
			<Switch>
				{!!user ? (
					<>
						<Redirect from="/auth" to="/chat"></Redirect>
						<Route path="/chat">
							<ChatFeature />
						</Route>
					</>
				) : (
					<>
						<Redirect from="/chat" to="/auth"></Redirect>
						<Route path="/auth">
							<AuthFeature />
						</Route>
					</>
				)}
			</Switch>
		</div>
	);
};

export default App;
