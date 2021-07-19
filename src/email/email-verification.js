const sgMail = require('@sendgrid/mail')
const { modelName } = require('../models/user')

const  SENDGRID_API_KEY = "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"

sgMail.setApiKey(SENDGRID_API_KEY)


const sendConfirmationEmail = async (email, code) => {
  try{
    await sgMail.send({
      to: `${email}`,
      from: 'ahmedmokhtarr55@gmail.com', 
      subject: 'Sending with SendGrid is Fun',
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
   })   
} catch (e) {
    console.log(e.message)
}
}

module.exports = sendConfirmationEmail