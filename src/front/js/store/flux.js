const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: sessionStorage.getItem("token") || null,
			user: null,
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a function
			syncTokenFromSessionStorage: () => {
				const token = sessionStorage.getItem("token");
				if(token && token != "" && token != undefined) setStore({ token: token });
			},

			logout: () => {
				sessionStorage.removeItem("token");
				setStore({ token: null, user: null });
			},

			login: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password })
					});

					if (!response.ok) {
						throw new Error("Login failed");
					}

					const data = await response.json();
					sessionStorage.setItem("token", data.token);
					setStore({ token: data.token, user: data });
					return true;
				} catch (error) {
					console.error("Error during login:", error);
					return false;
				}
			},

			signup: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password })
					});

					if (!response.ok) {
						throw new Error("Signup failed");
					}

					const data = await response.json();
					return true;
				} catch (error) {
					console.error("Error during signup:", error);
					return false;
				}
			},

			validateToken: async () => {
				const store = getStore();
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/validate-token", {
						headers: {
							"Authorization": "Bearer " + store.token
						}
					});

					if (!response.ok) {
						setStore({ token: null, user: null });
						sessionStorage.removeItem("token");
						return false;
					}

					const data = await response.json();
					setStore({ user: data });
					return true;
				} catch (error) {
					console.error("Error validating token:", error);
					setStore({ token: null, user: null });
					sessionStorage.removeItem("token");
					return false;
				}
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch(error) {
					console.log("Error loading message from backend", error)
				}
			},

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;