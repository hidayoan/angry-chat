import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../../component/RegisterForm";

const Register = () => {
	return (
		<div className="auth">
			<div className="auth__content">
				<div className="auth__content-title">Đăng kí</div>
				<div className="auth__content-form">
					<RegisterForm />
				</div>
				<div className="auth__content-change">
					Đã có tài khoản? <Link to="/auth/login">đăng nhập</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
