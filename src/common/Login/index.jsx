import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, notification } from "antd";
import firebase from "firebase/compat/app";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import LoginForm from "../../component/LoginForm";
import { auth, firestore } from "../../firebaseConfig/firebase";
import "./style/index.scss";

const Login = () => {
	const listUserRef = firestore.collection("listUser");
	const query = listUserRef.limit(25);
	const [listUser] = useCollectionData(query, { idField: "id" });

	const SignInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth
			.signInWithPopup(provider)
			.then(async ({ user }) => {
				const index = listUser.findIndex((item) => item.uid === user.uid);

				if (index > -1) {
					if (listUser[index].status !== "block") {
						return notification.success({
							message: "Đăng nhập thành công",
							description: "",
						});
					} else {
						auth.signOut();
						return notification.error({
							message: "Không thể đăng nhập",
							description:
								"Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng",
						});
					}
				} else {
					await listUserRef.add({
						uid: user.uid,
						displayName: user.displayName,
						status: "live",
						dateOfBirth: "",
						photoURL: user.photoURL,
						email: user.email,
					});
					return notification.success({
						message: "Đăng nhập thành công",
						description: "",
					});
				}
			})
			.catch((e) => console.log(e));
	};

	return (
		<div className="auth">
			<div className="auth__content">
				<div className="auth__content-title">Đăng nhập</div>
				<div className="auth__content-form">
					<LoginForm />
				</div>
				<Button className="auth__content-google" onClick={SignInWithGoogle}>
					<FontAwesomeIcon icon={faGoogle} style={{ marginRight: "5px" }} />
					Login with Google
				</Button>
				<div className="auth__content-change">
					Chưa có tài khoản? <Link to="/auth/register">đăng kí</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
