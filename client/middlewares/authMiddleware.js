const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1]; //index 1 kyun ki array 0 se start hota hai
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      //decode se encrypt value decrypt hongi
      if (err) {
        return res.status(200).send({
          message: "Auth Failed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};
