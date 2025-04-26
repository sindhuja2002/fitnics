const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		"/api",
		createProxyMiddleware({
			target: ["http://localhost:9000", 'https://backend.fitnics.space'],
			changeOrigin: true,
		})
	);
};
