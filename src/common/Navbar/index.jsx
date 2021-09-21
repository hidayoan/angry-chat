import { faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../asset/images/logo.png";
import { auth } from "../../firebaseConfig/firebase";
import "./style/index.scss";

const Navbar = () => {
	return (
		<div className="navbar">
			<Link to="/chat">
				<Tooltip title="Trang chủ" placement="right">
					<div className="navbar__image">
						<img src={logo} alt="" />
					</div>
				</Tooltip>
			</Link>

			<div className="navbar__fix"></div>
			<div className="navbar__loggout">
				<Link to="/setting">
					<Tooltip title="Cài đặt" placement="right">
						<div className="navbar__loggout-icon">
							<FontAwesomeIcon icon={faCog} />
						</div>
					</Tooltip>
				</Link>
				<Tooltip title="Đăng xuất" placement="right">
					<div
						className="navbar__loggout-icon"
						onClick={() => {
							auth.signOut();
						}}
					>
						<FontAwesomeIcon icon={faSignOutAlt} />
					</div>
				</Tooltip>
			</div>
		</div>
	);
};

export default Navbar;
