import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, Switch } from "react-router";
import "./App.scss";
import Loading from "./component/Loading";
import AuthFeature from "./feauture/AuthFeature";
import ChatFeature from "./feauture/ChatFeature";
import SettingFeature from "./feauture/SettingFeature";
import { auth } from "./firebaseConfig/firebase";

const App = () => {
	const [user, loading] = useAuthState(auth);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="app">
			<Switch>
				{!!user ? (
					<>
						<Redirect from="/" to="/chat"></Redirect>
						<Route path="/chat">
							<ChatFeature />
						</Route>
						<Route path="/setting">
							<SettingFeature />
						</Route>
					</>
				) : (
					<>
						<Redirect from="/" to="/auth"></Redirect>
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
