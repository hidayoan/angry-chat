import { Button, DatePicker, Form, Input, notification, Spin } from "antd";
import moment from "moment";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../firebaseConfig/firebase";
import { hasUpperCase } from "../../utils/function";

const RegisterForm = () => {
	const [form] = Form.useForm();
	const listUserRef = firestore.collection("listUser");
	const query = listUserRef.limit(25);
	const [listUser, loading] = useCollectionData(query, { idField: "id" });

	const signUp = (values) => {
		auth
			.createUserWithEmailAndPassword(values.email, values.password)
			.then(async ({ user }) => {
				const index = listUser.findIndex((item) => item.uid === user.uid);

				if (index > -1) {
					if (listUser[index].status !== "block") {
						return notification.success({
							message: "Đăng kí thành công",
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
					user
						.updateProfile({
							displayName: values.username,
						})
						.then(async () => {
							await listUserRef.add({
								uid: user.uid,
								displayName: user.displayName,
								status: "live",
								dateOfBirth: values.date._d,
								photoURL: user.photoURL,
							});
							return notification.success({
								message: "Đăng kí thành công",
								description: "",
							});
						})
						.catch((error) => {
							console.log(error);

							return notification.error({
								message: "Đăng kí thất bại",
							});
						});
				}
			})
			.catch((error) => {
				return notification.error({
					message: "Đăng ký thất bại",
					// description: errorMessage,
				});
			});
	};

	const onFinish = (values) => {
		signUp(values);
	};

	function disabledDate(current) {
		// Can not select days before today and today
		return current && current > moment().endOf("day");
	}

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

				<div className="form__label">Tên đăng nhập</div>
				<Form.Item
					name="username"
					rules={[
						{ required: true, message: "Không được dể trống" },
						{ min: 8, message: "không được ít hơn 8 kí tự" },
						{
							validator(_, value) {
								if (!value || !value.includes(" ")) {
									return Promise.resolve();
								}
								return Promise.reject("Tên đăng nhập không thể chứ dấu cách");
							},
						},
					]}
				>
					<Input className="form__input" autoComplete="off" />
				</Form.Item>

				<div className="form__label">Mật khẩu</div>
				<Form.Item
					name="password"
					rules={[
						{ required: true, message: "Không được dể trống" },
						{ min: 8, message: "không được ít hơn 8 kí tự" },
						{
							validator(_, value) {
								if (!value || hasUpperCase(value)) {
									return Promise.resolve();
								}
								return Promise.reject("Mật khẩu phải có chữ viết hoa");
							},
						},
						{
							validator(_, value) {
								if (!value || !value.includes(" ")) {
									return Promise.resolve();
								}
								return Promise.reject("Tên đăng nhập không thể chứ dấu cách");
							},
						},
					]}
				>
					<Input.Password className="form__input" />
				</Form.Item>

				<div className="form__label">Ngày sinh</div>
				<Form.Item
					name="date"
					rules={[{ required: true, message: "Không được dể trống" }]}
				>
					<DatePicker
						placeholder="Chọn ngày"
						disabledDate={disabledDate}
						className="form__input"
					/>
				</Form.Item>

				<Form.Item>
					<Button htmlType="submit" className="form__button  primary">
						Đăng nhập
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
};

export default RegisterForm;
