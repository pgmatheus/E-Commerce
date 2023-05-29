import axios from "axios";

let HOST_URL = "https://www.taliskafashion.com.br";

let base_url = HOST_URL || "http://localhost:5000";

/* let base_url = "http://localhost:5000"; */

const BASE_URL = base_url + "/api/";

/* "http://localhost:3000/api/" || "http://localhost:5000/api/"; */
// const TOKEN =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     .accessToken || "";

/* const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken; */

export const publicRequest = axios.create({
	baseURL: BASE_URL,
});

/* export const userRequest = axios.create({
	baseURL: BASE_URL,
	headers: { token: `bearer ${TOKEN}` },
}); */

export const userRequest = (obj) => {
	let token = obj?.token;
	if (token) {
		return axios.create({
			baseURL: BASE_URL,
			headers: { token: `bearer ${token}` },
		});
	}
};
