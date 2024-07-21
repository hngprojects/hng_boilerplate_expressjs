const rateLimit = require("express-rate-limit");

export default rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // 100 requests per 10 minutes
	message: { message: "Too many requests, please try again later" },
});
