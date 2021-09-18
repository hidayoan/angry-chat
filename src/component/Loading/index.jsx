import React from "react";
import "./style/index.scss";

const Loading = ({ text = "Loading..." }) => {
	return (
		<div className="loading">
			<h1 className="jt --debug">
				<span className="jt__row">
					<span className="row__text">{text}</span>
				</span>
				<span className="jt__row">
					<span className="row__text">{text}</span>
				</span>
				<span className="jt__row">
					<span className="row__text">{text}</span>
				</span>
				<span className="jt__row">
					<span className="row__text">{text}</span>
				</span>
			</h1>
		</div>
	);
};

export default Loading;
