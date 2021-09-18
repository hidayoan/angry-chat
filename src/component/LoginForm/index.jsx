import { Button, Form, Input, notification, Spin } from "antd";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { auth, firestore } from "../../firebaseConfig/firebase";
import "./style/index.scss";

const LoginForm = () => {
	const [form] = Form.useForm();
	const listUserRef = firestore.collection("listUser");
	const query = listUserRef.limit(25);
	const [listUser, loading] = useCollectionData(query, { idField: "id" });

	const login = (email, password) => {
		auth
			.signInWithEmailAndPassword(email, password)
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
						photoURL: user.photoURL,
					});
					return notification.success({
						message: "Đăng nhập thành công",
						description: "",
					});
				}
			})
			.catch((error) => {
				console.log(error);
				return notification.error({
					message: "Đăng nhập thất bại",
					// description: errorMessage,
				});
			});
	};

	const onFinish = (values) => {
		login(values.email, values.password);
	};

	return (
		<Spin spinning={loading}>
			<Form
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				className="form"
				form={form}
			>
				<div className="form__label">Email</div>
				<Form.Item
					name="email"
					rules={[{ type: "email", message: "Sai định dạng email" }]}
				>
					<Input className="form__input" autoComplete="off" />
				</Form.Item>

				<div className="form__label">Mật khẩu</div>
				<Form.Item
					name="password"
					rules={[{ required: true, message: "Không được dể trống" }]}
				>
					<Input.Password className="form__input" />
				</Form.Item>

				<Link className="form__forgot" to="/auth/forgot">
					Quên mật khẩu?
				</Link>

				<Form.Item>
					<Button htmlType="submit" className="form__button  primary">
						Đăng nhập
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
};

export default LoginForm;
