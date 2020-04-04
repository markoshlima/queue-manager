var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: process.env.HOST_SMTP,
    port: 587,
    secure: false, 
    auth: {
        user: process.env.USER_SMTP,
        pass: process.env.PASS_SMTP
    }
});

exports.handler = async (event, context, callback) => {
  
  let email = JSON.parse(event['Records'][0]['body'])
  let error = false
  
  //validate emailTo
  if(!email.emailTo){
    console.log("nao tem email para")
    error = true
  }
  
  //validate subject
  if(!email.subject){
    console.log("nao tem assunto")
    error = true
  }
  
  //validate html
  if(!email.html){
    console.log("nao tem html")
    error = true
  }

  if(!error){
    try {
      let info = await transporter.sendMail({
        from: "sistema.fila.aws@gmail.com", 
        to: email.emailTo,
        subject: email.subject, 
        text: "", 
        html: email.html
      });
    } catch (e) {
      console.log(e)
      throw (e)
    }
    console.log("Email enviado com sucesso")
  }else{
    console.log("Body:")
    console.log(email)
  }
  
};
