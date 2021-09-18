import { faChevronLeft, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRouteMatch } from "react-router-dom";
import ChatInputForm from "../../component/ChatInputForm";
import ChatMessage from "../../component/ChatMessage";
import Loading from "../../component/Loading";
import { auth, firestore } from "../../firebaseConfig/firebase";
import "./style/index.scss";
import firebase from "firebase/compat/app";
import useWindowSize from "../../customHook/useWindowsSize";

const ChatContent = ({
	handleOpenOption,
	isOpenOption = false,
	handleOpenNavbar,
}) => {
	const { params } = useRouteMatch();
	const [friendData, setFriendData] = useState({});
	const [loading, setLoading] = useState(true);
	const [size] = useWindowSize();

	const { multiFactor } = auth.currentUser;
	const { user } = multiFactor;

	useEffect(() => {
		(async () => {
			firestore
				.collection("listChat")
				.doc(params.idChat)
				.get()
				.then((doc) => {
					if (doc.exists) {
						const friendID = doc.data().listUid.find((uid) => uid !== user.uid);

						if (!!friendID) {
							firestore
								.collection("listUser")
								.where("uid", "==", friendID)
								.get()
								.then((querySnapshot) => {
									querySnapshot.forEach((docFriend) => {
										setFriendData(docFriend.data());
										setLoading(false);
									});
								})
								.catch((e) => {
									console.log(e);
									return <Loading text="Lỗi" />;
								});
						} else {
							return <Loading text="Lỗi" />;
						}
					}
				})
				.catch((e) => {
					console.log(e);
					return <Loading text="Lỗi" />;
				});
		})();
	}, [params, user?.uid]);

	// noti friend
	const notiRef = firestore
		.collection("notification")
		.doc(friendData.uid)
		.collection("noti");

	// noti me
	const notiRef2 = firestore
		.collection("notification")
		.doc(user.uid)
		.collection("noti");
	const query2 = notiRef2;
	const [noti] = useCollectionData(query2, { idField: "id" });

	const chatRef = firestore
		.collection("listChat")
		.doc(params.idChat)
		.collection("chat");
	const queryChat = chatRef.orderBy("createAt").limit(100);
	const [chat, loadingChat] = useCollectionData(queryChat, {
		idField: "id",
	});

	const dummy = useRef(null);

	useEffect(() => {
		//console.log("new message");
		//getNotificationData({ number: 1 });

		dummy.current?.scrollIntoView({ behavior: "smooth" });
	}, [chat]);

	const changeOpenOption = () => {
		// setIsOpenOption(!isOpenOption);
		if (handleOpenOption) {
			handleOpenOption(!isOpenOption);
		}
	};

	const changeOpenNavbar = () => {
		if (handleOpenNavbar) {
			handleOpenNavbar(true);
		}
	};

	const hanleSendMessage = async (values) => {
		console.log(values);
		if (values.photo.length > 0) {
			await chatRef.add({
				text: values.text,
				createAt: firebase.firestore.FieldValue.serverTimestamp(),
				uid: user.uid,
				imagesLink: values.photo,
			});

			await firestore
				.collection("listChat")
				.doc(params.idChat)
				.update({
					lastChat: {
						message:
							values.text === ""
								? `${values.photo.length} ${
										values.photo.length > 1 ? "photos" : "photo"
								  }`
								: values.text,
						uid: user.uid,
					},
					createAt: firebase.firestore.FieldValue.serverTimestamp(),
				});

			await notiRef.add({
				noti: true,
				uid: user.uid,
			});
		} else {
			if (values.text !== "") {
				await chatRef.add({
					text: values.text,
					createAt: firebase.firestore.FieldValue.serverTimestamp(),
					uid: user.uid,
				});

				await firestore
					.collection("listChat")
					.doc(params.idChat)
					.update({
						lastChat: {
							message: values.text,
							uid: user.uid,
						},
						createAt: firebase.firestore.FieldValue.serverTimestamp(),
					});

				await notiRef.add({
					noti: true,
					uid: user.uid,
				});
			}
		}
	};

	const handleSeen = async () => {
		try {
			await noti.forEach((item) => {
				console.log("170", item);
				if (item.uid === friendData.uid) {
					console.log("172", friendData.uid);
					firestore
						.collection("notification")
						.doc(user.uid)
						.collection("noti")
						.doc(item.id)
						.delete()
						.then(() => console.log("ok"))
						.catch((err) => console.log("delete faile", err));
				}
			});
		} catch (error) {
			console.log("err", error);
		}
	};

	return loading || loadingChat ? (
		<Loading></Loading>
	) : (
		<>
			<div className={`chat-content ${isOpenOption ? "open" : ""}`}>
				<div className={`chat-content__header ${isOpenOption ? "open" : ""}`}>
					<div className="chat-content__header-user">
						{size < 768 ? (
							<div
								className="chat-content__header-user__back"
								onClick={changeOpenNavbar}
							>
								<FontAwesomeIcon icon={faChevronLeft} />
							</div>
						) : (
							<></>
						)}

						<div className="chat-content__header-user__photo">
							<img
								src={
									friendData?.photoURL ||
									"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"
								}
								alt=""
							/>
						</div>
						<div className="chat-content__header-user__name">
							{friendData?.displayName}
						</div>
					</div>

					<div className="chat-content__header-group-button">
						<button
							className="chat-content__header-group-button__icon"
							onClick={changeOpenOption}
						>
							<FontAwesomeIcon icon={faInfo} />
						</button>
					</div>
				</div>
				<div className={`chat-content__body ${isOpenOption ? "open" : ""}`}>
					<div>
						{chat &&
							chat?.map((msg) => (
								<ChatMessage
									key={msg.id}
									message={msg}
									user={user}
									friend={friendData || {}}
									firestore={firestore}
								/>
							))}
						<div ref={dummy}></div>
					</div>
				</div>

				<div className={`chat-content__footer ${isOpenOption ? "open" : ""}`}>
					<ChatInputForm
						hanleSendMessage={hanleSendMessage}
						handleSeen={handleSeen}
					/>
				</div>
			</div>
		</>
	);
};

export default ChatContent;
