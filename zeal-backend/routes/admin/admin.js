const Admin = require("../../models/Admin"); // Ensure the path is correct
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecret = secret;
const defaultAdminUsername = ZealTourisam;
const defaultAdminPassword = Admin1234567;

// Login an admin
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the credentials match the default admin
    if (
      username === defaultAdminUsername &&
      password === defaultAdminPassword
    ) {
      const token = jwt.sign(
        { id: "default_admin", isAdmin: true },
        jwtSecret,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({
          success: true,
          token,
          message: "Login successful as default admin",
        });
    }

    // Find admin by username in the database
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create and send JWT
    const token = jwt.sign(
      { id: admin._id, isAdmin: admin.isAdmin },
      jwtSecret,
      { expiresIn: "1h" }
    );
    res.status(200).json({ success: true, token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.protected = (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are accessing a protected route!",
  });
};

module.exports.AdminLogout = async (req, res) => {
  try {

    res
      .status(200)
      .json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    console.error(error); // Better practice to use console.error for logging errors
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while logging out.",
      });
  }
};
