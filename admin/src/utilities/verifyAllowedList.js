export const verifyAllowedList = (arrCompare, categoryAllowed) => {
	if (!arrCompare || !categoryAllowed) {
		return { success: false };
	}

	return { success: arrCompare?.every((v) => categoryAllowed?.includes(v)) };
};
