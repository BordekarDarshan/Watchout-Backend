let urm = require("../../mongodb/UserRegistration");
let nodemailer = require("nodemailer");
let express = require("express");
let router = express.Router();
let crypto = require("crypto");

router.post("/mail", async (req, res) => {
  try {
  } catch (error) {}
  let resetToken = crypto.randomBytes(32).toString("hex");

  let currentUser = await urm.uRegisModel.findOne({
    "userlogin.emailId": req.body.userlogin.emailId
  });

  if (!currentUser) {
    res.status(402).send("Such email-id doesn't exist..");
  }
  currentUser.resetPasswordToken = resetToken;
  currentUser.resetTokenExpires = Date.now() + 3600000;
  currentUser = await currentUser.save();

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bordekardarshan@gmail.com",
      pass: "PASHABiceps@4.0"
    },
    tls: { rejectUnauthorized: false },
    debug: true
  });

  if (!transporter)
    res.status(401).send({
      message: "something went wrong"
    });

  let mailOptions = {
    from: '"Souled Out: " <bordekardarshan@gmail.com>', // sender address
    to: currentUser.userlogin.emailId, // list of receivers end
    subject: "Reset Your Password", // Subject line
    text:
      "open this link to change your password http://localhost:4000/api/reset/" +
      resetToken // plain text body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });

  res.send({ message: "please check your mail box", Data: currentUser });
});

module.exports = router;
