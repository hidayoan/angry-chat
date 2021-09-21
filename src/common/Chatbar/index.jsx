import { Avatar, Dropdown, Input, Menu } from "antd";
import React, { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useRouteMatch, useHistory } from "react-router-dom";

import Loading from "../../component/Loading";
import { auth, firestore } from "../../firebaseConfig/firebase";
import { countTime } from "../../utils/function";
import "./style/index.scss";
import firebase from "firebase/compat/app";

const Chatbar = ({ handleOpenNavbar }) => {
	const { params } = useRouteMatch();
	const [listSearch, setListSearch] = useState([]);

	const { multiFactor } = auth.currentUser;
	const { user } = multiFactor;
	const history = useHistory();

	const listChatRef = firestore.collection("listChat");
	const queryChat = listChatRef.orderBy("createAt");
	const [listChat, loadingChat] = useCollectionData(queryChat, {
		idField: "id",
	});

	const listUserRef = firestore.collection("listUser").limit(100);
	const query = listUserRef;
	const [listUser, loadingUser] = useCollectionData(query, { idField: "id" });

	const notiRef = firestore
		.collection("notification")
		.doc(user.uid)
		.collection("noti");
	const queryNoti = notiRef;
	const [noti] = useCollectionData(queryNoti, { idField: "id" });

	const changeOpenNavbar = () => {
		if (handleOpenNavbar) {
			handleOpenNavbar(false);
		}
	};

	if (loadingUser || loadingChat) return <Loading />;

	const onChangeSearch = async (e) => {
		// setListSearch(
		// 	listUser.filter((user) => user.email.includes(e.target.value))
		// );

		if (e.target.value === "") {
			setListSearch([]);
		} else {
			const temp = listUser.filter(
				(userSearch) =>
					(userSearch?.email
						?.toLowerCase()
						.includes(e.target.value.toLowerCase()) ||
						userSearch.displayName
							.toLowerCase()
							.includes(e.target.value.toLowerCase())) &&
					userSearch.uid !== user.uid
			);

			setListSearch(temp);
		}
	};

	const onCreateBoxChat = async (item) => {
		setListSearch([]);

		const index = listChat?.find((chat) => {
			const id1 = chat?.listUid.findIndex((value) => value === user.uid) > -1;
			const id2 = chat?.listUid.findIndex((value) => value === item.uid) > -1;
			if (id1 && id2) {
				return true;
			} else {
				return false;
			}
		});

		if (!!index) {
			history.push(`/chat/${index.id}`);
		} else {
			await listChatRef
				.add({
					createAt: firebase.firestore.FieldValue.serverTimestamp(),
					listUid: [user.uid, item.uid],
					type: "private",
				})
				.then(function (docRef) {
					history.push(`/chat/${docRef.id}`);
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
		}
	};

	return (
		<div className="chat-bar">
			{user.email}
			<div className="chat-bar__search">
				<Dropdown
					overlay={() => {
						return (
							<Menu theme="dark">
								{listSearch.map((item) => (
									<Menu.Item
										key={item.id}
										onClick={() => onCreateBoxChat(item)}
									>
										{item.displayName} <p>{item.email}</p>
									</Menu.Item>
								))}
							</Menu>
						);
					}}
					visible={listSearch.length > 0}
				>
					<Input
						placeholder="Tìm email hoặc username"
						onChange={onChangeSearch}
					/>
				</Dropdown>
			</div>

			<div className="chat-bar__list">
				{listChat?.map((chat) => {
					const id = chat?.listUid.findIndex((value) => value === user.uid);

					if (id > -1) {
						if (chat.type === "private") {
							// const friend = listUser.find(userl => )

							let idFriend = 9;

							if (id === 1) {
								idFriend = 0;
							} else {
								idFriend = 1;
							}

							const friend = listUser?.find(
								(userl) => userl.uid === chat.listUid[idFriend]
							);

							return (
								<Link
									className={`chat-bar__item ${
										!!params.idChat ? "selected" : ""
									}`}
									key={chat.id}
									to={`/chat/${chat.id}`}
									onClick={changeOpenNavbar}
								>
									<div className={`chat-bar__item-image`}>
										<Avatar
											src={
												friend.photoURL ||
												"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"
											}
											alt=""
											size={32}
										/>
									</div>
									<div className="chat-bar__item-content">
										<div className="chat-bar__item-content__group">
											<div className="chat-bar__item-content__group-name">
												{friend?.displayName}
											</div>

											<div className="chat-bar__item-content__group-time">
												{countTime(
													chat?.createAt?.seconds * 1000 || new Date()
												)}
											</div>
										</div>

										<div className="chat-bar__item-content__group">
											<div className="chat-bar__item-content__group-chat">
												{chat?.lastChat?.uid === user?.uid ? (
													<>you: {chat?.lastChat?.message}</>
												) : (
													<>{chat?.lastChat?.message}</>
												)}
											</div>
											{noti?.filter((item) => item.uid === friend.uid).length >
											0 ? (
												<div className="chat-bar__item-content__group-noti">
													{
														noti.filter((item) => item.uid === friend.uid)
															.length
													}
												</div>
											) : (
												<></>
											)}
										</div>
									</div>
								</Link>
							);
						} else {
							return <></>;
						}
					} else {
						return <></>;
					}
				})}
			</div>
		</div>
	);
};

export default Chatbar;
