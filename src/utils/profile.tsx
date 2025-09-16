import axios from "../services/axios";
import type { UserItems } from "../types/calendar";

const BASE_URL = "http://localhost:8000/api";
//const WEATHER_URL = `${BASE_URL}/weather/`;
const USER_PROFILE_URL = `${BASE_URL}/user/profile/`;

export const get_user_profile = async (): Promise<UserItems> => {
	try {
		const response = await axios.get<UserItems>(USER_PROFILE_URL, {
			withCredentials: true,
		});
		// console.log("User profile fetched:", response.data);
		return response.data as UserItems;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
