import { userRequest } from "../requestMethods";

export const updateUser = async (obj, _id) => {
	let sendReq = async () => {
		try {
			let res = await userRequest({ token: obj?.token }).put(
				`/users/${_id}`,
				obj
			);
			return res;
		} catch (e) {}
	};
	return sendReq();
};
