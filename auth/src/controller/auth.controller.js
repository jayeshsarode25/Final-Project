const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");
const { publishToQueue } = require("../broker/borker");

async function RegisterUser(req, res) {
  try {
    const {
      username,
      email,
      password,
      fullName: { firstName, lastName },
      role,
    } = req.body;

    // Check duplicate
    const existing = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existing)
      return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashed,
      fullName: { firstName, lastName },
      role: role || 'user' // default role is 'user'
    });


    // Publish to RabbitMQ
    await Promise.all([
            publishToQueue('AUTH_NOTIFICATION.USER_CREATED', {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
            }),
            publishToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", user)
        ]);

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}


async function googleOAuthCallback(req, res) {
  const user = req.user;

  const isUseralreadyExits = await userModel.findOne({
    $or: [{ email: user.emails[0].value }, { googleId: user.id }],
  });

  if (isUseralreadyExits) {
    const token = jwt.sign(
      { id: isUseralreadyExits._id, role: isUseralreadyExits.role },
      config.JWT_SECRET,
      { expiresIn: "2d" }
    );


    res.cookie("token", token);

     if(isUseralreadyExits.role === "seller"){
    return res.redirect('http://localhost:5173/');
  }


    return res.redirect('http://localhost:5173');
  }

  const newUser = await userModel.create({
    email: user.emails[0].value,
    googleId: user.id,
    fullName: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  await publishToQueue("user_created", {
    id: newUser._id,
    email: newUser.email,
    fullname: newUser.fullName,
    role: newUser.role,
  });

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    config.JWT_SECRET,
    { expiresIn: "2d" }
  );
  res.cookie("token", token);

  res.redirect('http://localhost:5173');
}


async function LoginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    // find by email or username and include password

    const user = await userModel
      .findOne({ $or: [{ email }, { username }] })
      .select("+password");

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password || "");

    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function GetCurrentUser(req, res) {
  return res
    .status(200)
    .json({ message: "User fetched successfully", user: req.user });
}

async function LogoutUser(req, res) {
  const token = req.cookies.token;

  if (token) {
    redis.set(`blacklist_${token}`, "true", "EX", 24 * 60 * 60); // Set with 1 day expiry
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({ message: "Logout successful" });
}

// Addresses: list, add, delete
async function getUserAddresses(req, res) {
  const id = req.user.id;

  const user = await userModel.findById(id).select("addresses");

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    message: "Addresses fetched successfully",
    addresses: user.addresses,
  });
}

async function addUserAddress(req, res) {
  const id = req.user.id;

  const { street, city, state, pincode, country, isDefault } = req.body;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        addresses: {
          street,
          city,
          state,
          pincode,
          country,
          isDefault,
        },
      },
    },
    { new: true }
  );

  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(201).json({
    message: "Address added successfully",
    address: user.addresses[user.addresses.length - 1],
  });
}

async function deleteUserAddress(req, res) {
  const id = req.user.id;
  const { addressId } = req.params;

  const isAddresesExists = await userModel.findOne({ _id: id, "addresses._id": addressId });

  if (!isAddresesExists) {
    return res.status(404).json({ message: "Address not found" });
  }

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const addressExists = user.addresses.some(addr => addr._id.toString() === addressId);
  if (addressExists) {
    return res.status(404).json({ message: "Address not found" });
  }

  return res.status(200).json({ 
    message: "Address deleted successfully",
    addresses: user.addresses
   });
}

module.exports = {
  RegisterUser,
  googleOAuthCallback,
  LoginUser,
  GetCurrentUser,
  LogoutUser,
  getUserAddresses,
  addUserAddress,
  deleteUserAddress,
};
