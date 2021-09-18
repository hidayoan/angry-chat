import { Avatar, Image, Tooltip } from "antd";
import React from "react";
import { countTime } from "../../utils/function";
import "./style/index.scss";

const ChatMessage = ({ message, user, firestore, friend }) => {
	const { text, uid, imagesLink, createAt } = message;

	const messageClass = user.uid === uid ? "sent" : "received";

	return (
		<div className={`chatMessage ${messageClass}`}>
			{messageClass === "received" && (
				<Avatar
					size="large"
					src={
						friend?.photoURL ||
						"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
					}
					className="chatMessage__photo"
				/>
			)}

			<div className={`chatMessage__content ${messageClass}`}>
				{messageClass === "received" && (
					<p className={`chatMessage__name ${messageClass}`}>
						{friend?.displayName}
					</p>
				)}

				{text !== "" ? (
					<Tooltip title={countTime(createAt?.toDate())}>
						<p className={`chatMessage__text ${messageClass}`}>{text}</p>
					</Tooltip>
				) : (
					<></>
				)}

				{imagesLink ? (
					<p className={`chatMessage__list-image ${messageClass}`}>
						{imagesLink.map((imageLink, index) => (
							<Tooltip title={countTime(createAt?.toDate())}>
								<div className="chatMessage__list-image--image">
									<Image key={index} src={imageLink} height={"100%"} />
								</div>
							</Tooltip>
						))}
					</p>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default ChatMessage;
