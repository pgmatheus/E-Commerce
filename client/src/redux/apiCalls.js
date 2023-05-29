import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest } from "../requestMethods";

export const login = async (dispatch, user) => {
	dispatch(loginStart());
	try {
		const res = await publicRequest.post("/auth/login", user);
		dispatch(loginSuccess(res.data));
		return res;
	} catch (err) {
		dispatch(loginFailure());
		return err?.response?.data?.message || err?.response?.data || "Error";
	}
};
