const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {JWT_SECRET_KEY} = require('../config/config')
const User = require('../models/user.model')

const signup = async (req, res) => {
  try {
    console.log("SIGNUP");
    const { firstName, lastName, email, password} = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      firstName?.length == 0 ||
      lastName?.length == 0 ||
      email?.length == 0 ||
      password?.length == 0 
    )
      return res.status(400).json({ error: "All fields are required" });

    const userExists = await User.exists({ email });
    console.log(userExists);

    if (userExists) return res.status(409).json({ error: "User already exists" });

    const newPassword = await bcrypt.hash(password, 11);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: newPassword,
    });

    const token = jwt.sign(
      { userId: user._id, username: user.firstName + " " + user.lastName },
      JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    console.log(token);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.set("Access-Control-Expose-Headers", "Authorization");
    res.status(200).json({ succuss: true, message: "Signin succussful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email?.length == 0 || password?.length == 0)
      return res.status(400).json({ error: "All fields are required" });

    let user = await User.findOne({ email }).lean();

    if (!user) return res.status(400).json({ error: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) return res.status(400).json({ error: "Password is incorrect" });

    const tokenVal = { userId: user._id, username: user.firstName + " " + user.lastName };
    if (user.profileImage) tokenVal.profileImage = user.profileImage;

    const token = jwt.sign(tokenVal, JWT_SECRET_KEY, { expiresIn: "24h" });
    console.log(token);
    res.setHeader("Authorization", `Bearer ${token}`);
    res.set("Access-Control-Expose-Headers", "Authorization");
    res.status(200).json({ succuss: true, message: "Signin succussfull" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { signin, signup };
