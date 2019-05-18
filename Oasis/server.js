const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 8080;

/**
 * CONFIGURATIONS
 */
app.set("view engine", "ejs"); // set view engine
app.use(bodyParser.urlencoded({ extended: true })); // body-parser
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public")); // css

// get
app.get("/email", (req, res) => {
  res.render("contact");
});

// post
app.post("/send", (req, res) => {
  //   console.log(req.body);
  const output = `
    <p>You have a new message</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Name: ${req.body.email}</li>
    <li>Name: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "oasislisting07@gmail.com", // generated ethereal user
      pass: "9385164@c*Sc648!" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send email data with unicode symbols
  let mailOptions = {
    from: '"OASIS" <oasislisting07@gmail.com>', // sender address
    to: "rluv4u@gmail.com", // list of receivers
    subject: "Property viewing request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("thankyourenter");
  });
});

// listen to port
app.listen(port, () => console.log(`Server listening on port ${port}...`));
