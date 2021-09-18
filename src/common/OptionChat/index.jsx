import React from "react";
import "./style/index.scss";

const OptionChat = ({ isOpenOption }) => {
	return (
		<div className={`option-chat ${isOpenOption ? "open" : ""}`}>
			<div className={`option-chat__content  ${isOpenOption ? "open" : ""}`}>
				bacxyz
			</div>
		</div>
	);
};

export default OptionChat;
