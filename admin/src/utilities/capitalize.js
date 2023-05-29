export const capitalize = (phrase) => {
	try {
		if (!phrase) {
			return { success: false };
		}

		return {
			success: true,
			value: phrase
				.toLowerCase()
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
		};
	} catch (err) {
		return { success: false };
	}
};
