export const hasUpperCase = (str) => {
	return str.toLowerCase() !== str;
};

export const countTime = (time) => {
	const formatTime = new Date(time);
	const count = new Date().getTime() - formatTime.getTime();

	const day = (count - (count % (1000 * 3600 * 24))) / (1000 * 3600 * 24);
	const mod = (count - day) / (1000 * 3600 * 24);

	if (day > 0) {
		return `${day} ngày trước`;
	} else {
		if (mod * 24 >= 1) {
			return `${Math.round(mod * 24)} giờ trước`;
		} else {
			return `${Math.round(mod * 24 * 60)} phút trước`;
		}
	}
};
