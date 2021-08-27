const mailer = require('nodemailer')

const transporter = mailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'test123455dd@outlook.com',
    pass:'01097312566Mobile'
  }
})



const sendConfirmationEmail = async (email, code ) => {
  
  const options = {
    from: 'test123455dd@outlook.com',
    to: `${email}`,
    subject: "Verification mail",
    html: 
    `
    <div style = 'border-radius:5px;width:70wv;margin:0 auto'>
          <img style='margin-top: 10px;float:right' width=50px;height=50px src="https://icon-library.com/images/tweeter-icon/tweeter-icon-19.jpg">
          <div style='clear:both'></div>
          <h3>Confirm your email address</h3>
          <p style='font-size:20px'>
          There’s one quick step you need to
          complete before creating your Twitter 
          account. Let’s make sure this is the right 
          email address for you — please confirm 
          this is the right address to use for your 
          new account.
          </p>
          <h3>verification code: ${code} </h3>
          <div>Thanks,</div>
          <span>Twitter</span>
   </div>
    `
}

transporter.sendMail(options, function(err,info){
    if(err){
      return console.log(err)
      
    } 
    console.log(info.response)
})

}

module.exports = sendConfirmationEmail