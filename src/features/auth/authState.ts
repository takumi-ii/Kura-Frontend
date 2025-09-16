export let authStatus: boolean | null = null;
export let loggingOut = false;

let loggedOut = true;

if (typeof window !== "undefined") {
	loggedOut = localStorage.getItem("loggedOut") === "true";
	const stored = localStorage.getItem("loggedOut");
	if (stored !== null) {
		loggedOut = stored === "true";
	}
}

export const setAuthStatusFlag = (value: boolean | null): void => {
	authStatus = value;
};

export const getAuthStatusFlag = (): boolean | null => authStatus;

export const setLoggingOutFlag = (value: boolean): void => {
	loggingOut = value;
};

export const getLoggingOutFlag = (): boolean => {
	return loggingOut;
};

export const setLoggedOutFlag = (value: boolean): void => {
	loggedOut = value;
	if (typeof window !== "undefined") {
		if (value) {
			localStorage.setItem("loggedOut", "true");
		} else {
			localStorage.removeItem("loggedOut");
		}
	}
};

export const getLoggedOutFlag = (): boolean => {
	return loggedOut;
};
