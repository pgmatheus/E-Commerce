import axios from "axios";

/* let HOST_URL = "https://taliskafashion.herokuapp.com"; */

let HOST_URL = "http://localhost:5000";

let base_url = HOST_URL || "http://localhost:5000";

const BASE_URL = base_url + "/api/";
/* const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.user)
  ?.currentUser?.accessToken; */

export const publicRequest = axios.create({
	baseURL: BASE_URL,
});

export const userRequest = (obj) => {
	if (obj?.token) {
		return axios.create({
			baseURL: BASE_URL,
			headers: { token: `Bearer ${obj?.token}` },
		});
	}
};

/* export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
}); */
