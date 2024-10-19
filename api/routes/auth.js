const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	})

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(newUser.password, salt);
		newUser.password = hashedPass;
		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
})

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(400).json("Неправильные учетные данные!");
		}

		const validated = await bcrypt.compare(req.body.password, user.password);
		if (!validated) {
			return res.status(400).json("Неправильные учетные данные!");
		}

		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router
