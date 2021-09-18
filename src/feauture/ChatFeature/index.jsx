import { Drawer } from "antd";
import React, { useState } from "react";
import { Route, Switch } from "react-router";
import Chatbar from "../../common/Chatbar";
import ChatContent from "../../common/ChatContent";
import Navbar from "../../common/Navbar";
import OptionChat from "../../common/OptionChat";
import useWindowSize from "../../customHook/useWindowsSize";
import "./style/index.scss";

const ChatFeature = () => {
	const [isOpenOption, setIsOpenOption] = useState(false);
	const [isOpenNavbar, setIsOpenNavbar] = useState(true);

	const handleOpenOption = async (values) => {
		setIsOpenOption(values);
	};

	const [size] = useWindowSize();

	const onCloseOption = () => {
		setIsOpenOption(false);
	};

	const onCloseNavbar = () => {
		setIsOpenNavbar(false);
	};

	const handleOpenNavbar = (values) => {
		setIsOpenNavbar(values);
	};

	return (
		<div className="chat-feature">
			<Switch>
				<Route path="/chat" exact>
					{size > 768 ? (
						<>
							<Navbar />
							<Chatbar />
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
							<Chatbar handleOpenNavbar={handleOpenNavbar} />
						</Drawer>
					)}
				</Route>

				<Route path="/chat/:idChat">
					{/* <Chatbar /> */}

					{size > 768 ? (
						<>
							<Navbar />
							<Chatbar />
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
							<Chatbar handleOpenNavbar={handleOpenNavbar} />
						</Drawer>
					)}

					<ChatContent
						handleOpenOption={handleOpenOption}
						isOpenOption={isOpenOption}
						handleOpenNavbar={handleOpenNavbar}
					/>
					{size > 1024 ? (
						<>
							<OptionChat isOpenOption={isOpenOption} />
						</>
					) : (
						<>
							<Drawer
								placement={"right"}
								onClose={onCloseOption}
								visible={isOpenOption}
							>
								<OptionChat isOpenOption={isOpenOption} />
							</Drawer>
						</>
					)}
				</Route>
			</Switch>
		</div>
	);
};

export default ChatFeature;
