import jwt from "jsonwebtoken";
export default function(req, res, next){
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing auth" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
    next();
  } catch(e){
    res.status(401).json({ error: "Invalid token" });
  }
}
