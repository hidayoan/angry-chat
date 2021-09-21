import { faUnlock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer, Menu } from "antd";
import React from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import Navbar from "../../common/Navbar";
import UserContent from "../../common/UserContent";
import useWindowSize from "../../customHook/useWindowsSize";
import "./style/index.scss";

const SettingFeature = () => {
	const [isOpenNavbar, setIsOpenNavbar] = useState(true);
	const [size] = useWindowSize();

	const onCloseNavbar = () => {
		setIsOpenNavbar(false);
	};

	const handleOpenNavbar = (values) => {
		setIsOpenNavbar(values);
	};

	return (
		<div className="setting-feature">
			{size > 768 ? (
				<>
					<Navbar />
					<Menu
						theme="dark"
						defaultSelectedKeys={["1"]}
						mode="inline"
						className="setting-feature__menu"
					>
						<Menu.Item
							key="1"
							icon={<FontAwesomeIcon icon={faUser} />}
							className="setting-feature__menu--item"
						>
							<Link to="/setting/user">Tài khoản</Link>
						</Menu.Item>
						<Menu.Item
							key="2"
							icon={<FontAwesomeIcon icon={faUnlock} />}
							className="setting-feature__menu--item"
						>
							<Link to="/setting/change-password">Thay đổi mật khẩu</Link>
						</Menu.Item>
					</Menu>
				</>
			) : (
				<Drawer
					placement={"left"}
					visible={isOpenNavbar}
					onClose={onCloseNavbar}
					className="drawer__chatbar"
					closeIcon={false}
					width={"100%"}
				>
					<Navbar />
					<Menu
						theme="dark"
						defaultSelectedKeys={["1"]}
						mode="inline"
						className="setting-feature__menu"
					>
						<Menu.Item
							key="1"
							icon={<FontAwesomeIcon icon={faUser} />}
							className="setting-feature__menu--item"
						>
							<Link
								to="/setting/user"
								onClick={() => setIsOpenNavbar(!isOpenNavbar)}
							>
								Tài khoản
							</Link>
						</Menu.Item>
						<Menu.Item
							key="2"
							icon={<FontAwesomeIcon icon={faUnlock} />}
							className="setting-feature__menu--item"
						>
							<Link
								to="/setting/change-password"
								onClick={() => setIsOpenNavbar(!isOpenNavbar)}
							>
								Thay đổi mật khẩu
							</Link>
						</Menu.Item>
					</Menu>
				</Drawer>
			)}

			<Switch>
				<Redirect from="/setting" to="/setting/user" exact />
				<Route path="/setting/user">
					<UserContent handleOpenNavbar={handleOpenNavbar} />
				</Route>
			</Switch>
		</div>
	);
};

export default SettingFeature;
