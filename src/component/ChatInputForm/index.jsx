import {
	faPlus,
	faSmile,
	faTimesCircle,
	faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useEventListener from "@use-it/event-listener";
import { Badge, Button, Image, Input, Popover, Upload } from "antd";
import Picker from "emoji-picker-react";
import { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { storage } from "../../firebaseConfig/firebase";
import "./style/index.scss";

const ENTER_KEYS = ["13", "Enter"];

const ChatInputForm = ({ hanleSendMessage, handleSeen }) => {
	const [listImage, setListImage] = useState([]);
	const [message, setMessage] = useState("");
	const { params } = useRouteMatch();

	const onEmojiClick = (event, emojiObject) => {
		const temp = message + emojiObject.emoji;

		setMessage(temp);
	};

	const handleCloseImage = (key) => {
		const temp = [...listImage];
		setListImage(temp.filter((item, index) => index !== key));
	};

	const onChangeMessage = (e) => {
		e.preventDefault();
		setMessage(e.target.value);
	};

	const setDataMessage = async () => {
		let listUrl = [];
		const listTemp = [...listImage];
		const tempMsg = message;
		setListImage([]);
		setMessage("");

		await Promise.all(
			listTemp.map(async (file) => {
				await storage.ref(`images/${params.idChat}/${file.uid}`).put(file);

				const pathReference = await storage
					.ref(`images/${params.idChat}/${file.uid}`)
					.getDownloadURL();
				listUrl = [...listUrl, pathReference];
			})
		);

		const messageData = await {
			text: tempMsg,
			photo: listUrl,
		};

		if (hanleSendMessage) {
			await hanleSendMessage(messageData);
		}
	};

	const onSendMessage = async (e) => {
		e.preventDefault();
	};

	function handler({ key }) {
		if (ENTER_KEYS.includes(String(key))) {
			setDataMessage();
		}
	}

	useEventListener("keydown", handler);

	const handleFocus = async () => {
		if (handleSeen) {
			await handleSeen();
		}
	};

	return (
		<div className="chat-input">
			<div
				className={`chat-input__list-image ${
					listImage.length > 0 ? "haveImage" : ""
				}`}
			>
				{listImage.length > 0 && (
					<>
						{listImage &&
							listImage?.map((image, index) => {
								return (
									<div className="chat-input__list-image--image" key={index}>
										<Badge
											count={
												<Button
													type="text"
													danger
													onClick={() => handleCloseImage(index)}
												>
													<FontAwesomeIcon icon={faTimesCircle} />
												</Button>
											}
										>
											<Image src={URL.createObjectURL(image)} height={"100%"} />
										</Badge>
									</div>
								);
							})}

						<Upload
							showUploadList={false}
							onChange={({ file, fileList }) => {
								if (file.status !== "uploading") {
									const temp = [...listImage];
									temp.push(file);
									setListImage(temp);
								}
							}}
							beforeUpload={() => false}
						>
							<Button className="chat-input__list-image--button">
								<FontAwesomeIcon icon={faUpload} />
							</Button>
						</Upload>
					</>
				)}
			</div>
			<div className="chat-input__input-bar">
				{listImage.length === 0 && (
					<Upload
						showUploadList={false}
						onChange={({ file, fileList }) => {
							if (file.status !== "uploading") {
								const temp = [...listImage];
								temp.push(file);
								setListImage(temp);
							}
						}}
						beforeUpload={() => false}
					>
						<div className="chat-input__input-bar--upload-btn">
							<FontAwesomeIcon icon={faPlus} />
						</div>
					</Upload>
				)}

				<Input.TextArea
					value={message}
					autoSize={true}
					rows={1}
					className="chat-input__input-bar--input"
					bordered={false}
					onChange={onChangeMessage}
					onPressEnter={onSendMessage}
					onFocus={handleFocus}
				/>
				<Popover
					title={
						<Picker
							onEmojiClick={onEmojiClick}
							disableSkinTonePicker={true}
							disableSearchBar={true}
							onEnter
						/>
					}
					placement="leftTop"
					color="transparent"
				>
					<div className="chat-input__input-bar--emoji-btn">
						<FontAwesomeIcon icon={faSmile} />
					</div>
				</Popover>
			</div>
		</div>
	);
};

export default ChatInputForm;
