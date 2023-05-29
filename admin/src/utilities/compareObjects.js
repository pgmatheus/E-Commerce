export const compareObjects = (arr1, arr2) => {
	if (!arr2) {
		return { success: false };
	}
	for (const key in arr1) {
		if (arr1[key] !== arr2[key]) {
			return { success: false };
		}
	}
	return { success: true };
};
