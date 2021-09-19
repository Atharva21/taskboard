// First we need to import axios.js
import axios from "axios";
// Next we make an 'instance' of it
const instance = axios.create({
	// .. where we make our configurations
	// TODO take this from .env
	baseURL: "http://localhost:3001/api/v1",
	withCredentials: true,
});

// // Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common["Authorization"] = "AUTH TOKEN FROM INSTANCE";

// Also add/ configure interceptors && all the other cool stuff

// instance.interceptors.request...

export default instance;
