import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 hari
    httpOnly: true,                     // tidak bisa diakses JS client
    sameSite: "none",                   // ⬅️ izinkan cross-site
    secure: process.env.NODE_ENV !== "development", // ⬅️ butuh Secure untuk SameSite=None
    path: "/",                          // ⬅️ berlaku di semua endpoint
  });

  return token;
};
