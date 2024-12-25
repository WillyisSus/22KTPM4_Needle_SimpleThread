const emailer = require('./email-config'); 

async function  main(){
    const sendOptions = {
        to: "vovietlong0845927889@gmail.com",
    }
    emailer.sendResetMail(sendOptions);
}

main()