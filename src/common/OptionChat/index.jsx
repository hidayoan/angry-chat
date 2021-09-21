import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Col, Image, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import Loading from "../../component/Loading";
import { auth, firestore, storage } from "../../firebaseConfig/firebase";
import "./style/index.scss";

const OptionChat = ({ isOpenOption }) => {
	const { params } = useRouteMatch();

	const [listImage, setListImage] = useState([]);
	const [friendData, setFriendData] = useState({});
	const [isVisibleListImage, setIsVisibleListImage] = useState(false);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		(async () => {
			console.log(params);
			const storageRef = storage.ref();
			let listRef = storageRef.child(`images/${params.idChat}`);

			listRef
				.listAll()
				.then(async (res) => {
					let tempList = [];
					await Promise.all(
						res.items.map(async (itemRef) => {
							await tempList.push(await itemRef.getDownloadURL());
						})
					);
					await setListImage(tempList);
				})
				.catch((error) => {
					// Uh-oh, an error occurred!
				});
		})();
	}, [isOpenOption]);

	if (loading) return <Loading />;

	return (
		<div className={`option-chat ${isOpenOption ? "open" : ""}`}>
			<div className={`option-chat__content  ${isOpenOption ? "open" : ""}`}>
				<div className="option-chat__content--user">
					<Avatar
						src={
							friendData?.photoURL ||
							"https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg"
						}
					/>
					<p>{friendData?.displayName}</p>
				</div>

				<div className="option-chat__content--search">
					<div className="option-chat__content--search__text">
						Tìm kiếm tin nhắn
					</div>
					<div className="option-chat__content--search__icon">
						<FontAwesomeIcon icon={faSearch} />
					</div>
				</div>

				<div
					className={`option-chat__content--btn-image  ${
						isVisibleListImage ? "open" : ""
					}`}
					onClick={() => setIsVisibleListImage(!isVisibleListImage)}
				>
					Xem tất cả ảnh
				</div>

				<Row
					style={{
						overflowY: "scroll",
						maxHeight: "50vh",
						visibility: `${isVisibleListImage ? "initial" : "hidden"}`,
					}}
					className={`option-chat__content--list-image`}
				>
					{listImage.map((image, index) => (
						<Col
							span={6}
							key={index}
							className="option-chat__content--list-image__image-div"
						>
							<Image
								src={image}
								width={"100%"}
								height={"100%"}
								className="option-chat__content--list-image__image"
							/>
						</Col>
					))}
				</Row>
			</div>
		</div>
	);
};

export default OptionChat;
