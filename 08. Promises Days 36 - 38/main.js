// Avoid global scope
(function () {
	/* ==========  Variables  ========== */
	// fixed parameters
	const weatherApiKey = "c81e60446f394ac3b6efb4b5c187cafa";
	const weatherEndpoint = "https://api.weatherbit.io/v2.0/current?";
	const app = document.querySelector("#app");

	/* ==========  Functions  ========== */

	/**
	 * Handle any errors during the fetches
	 * @param   {Object}  error  The type of error
	 * @return  {String}         The error message to render
	 */
	function handleError(error) {
		app.innerHTML = `<h2>We're sorry. Something went wrong fetching your weather information.</h2>`;
		console.error(error);
	}

	/**
	 * Updates the message rendered in HTML by Weather plugin function
	 * @param   {Object}  settings     The options passed in by the user when called
	 * @param   {Object}  weatherData  The data returned from the API call
	 * @return  {String}               The update message to render (with updated parameters)
	 */
	function updateMessage(settings, weatherData) {
		return settings.message
			.replace("{{temp}}", weatherData.temp)
			.replace("{{conditions}}", weatherData.weather.description.toLowerCase())
			.replace("{{city}}", weatherData.city_name);
	}

	/**
	 * Enables the icon to be shown or not
	 * @param   {Object}  settings     The options passed in by the user when called
	 * @param   {Object}  weatherData  The data returned from the API call
	 * @return  {String}               The update message to render (with updated parameters)
	 */
	function includeIcon(settings, weatherData) {
		return settings.icon ? `<img src="icons/${weatherData.weather.icon}.png" alt=""/>` : ``;
	}

	/**
	 * Render required information from an object to HTML
	 * @param   {Object}  weather  The weatherData object returned by getWeather
	 * @return  {String}           The HTML to render
	 */
	function renderHTML(settings, weatherData) {
		app.innerHTML = `
			<div>${includeIcon(settings, weatherData)}</div>
			<h2>${updateMessage(settings, weatherData)}</h2>`;
	}

	function weatherPlugin(options, weatherData) {
		// default options
		const defaults = {
			message: "It is currently {{temp}} &degC with {{conditions}} in {{city}} right now.",
			icon: true,
			error: "Sorry, we can't get the weather for you right now",
		};
		const settings = Object.assign(defaults, options);
		renderHTML(settings, weatherData);
	}

	function retrieveCoords() {
		return new Promise(function (resolve, reject) {
			navigator.geolocation.getCurrentPosition(resolve, reject);
		});
	}

	/**
	 * Get fetch a users location and call the weatherbit API based on first values fetched
	 * @return  {Object}  The object returned by the weatherbit ajax call
	 */
	async function getWeather(options) {
		const coords = {};
		const position = await retrieveCoords();
		coords.latitude = position.coords.latitude;
		coords.longitude = position.coords.longitude;

		const weatherResponse = await fetch(
			`${weatherEndpoint}lat=${coords.latitude}&lon=${coords.longitude}&key=${weatherApiKey}`
		);
		const weatherData = await weatherResponse.json();
		weatherPlugin(options, weatherData.data[0]);
	}

	getWeather().catch(handleError);
	// Close void global scope
})();
