const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/send-email', (req, res) => {
  const output = `
    <p>You have a new warranty application</p>
    <h3>Company Information</h3>
    <ul>
      <li>Company: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Part Number: ${req.body.part_number}</li>
    </ul>
    <h3>Issue Description</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your-email@example.com', // generated ethereal user
        pass: 'your-password'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Warranty Application" <your-email@example.com>', // sender address
      to: 'seanmcmahon860@gmail.com', // list of receivers
      subject: 'New Warranty Application', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
