import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import logo from "../../asset/images/logo.png";
import { auth } from "../../firebaseConfig/firebase";
import "./style/index.scss";

const Navbar = () => {
	return (
		<div className="navbar">
			<div className="navbar__image">
				<img src={logo} alt="" />
			</div>
			<div className="navbar__fix"></div>
			<div className="navbar__loggout">
				<div
					className="navbar__loggout-icon"
					onClick={() => {
						auth.signOut();
					}}
				>
					<FontAwesomeIcon icon={faSignOutAlt} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
