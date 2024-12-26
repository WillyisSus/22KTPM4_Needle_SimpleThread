function checkPasswordConstraint(password) {
    var regexLiteral = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%\.])[a-zA-Z0-9!@#$%\.]{8,32}$/i;
    return regexLiteral.test(password);
}

async function sendPasswordResetBody(event) {
    event.preventDefault();
    const form = document.querySelector("#resetPasswordForm")
    const newPw = document.querySelector("#NewPw").value;
    const confirmPassword = document.querySelector("#ConfirmPw").value;
    const action = form.action;
    const errorMessage = document.querySelector("#clientErrorMessage");
    if (newPw === confirmPassword){
        console.log("matches")
        if (checkPasswordConstraint(newPw)){
            console.log("meet constraints")
            try {
                const res  = await fetch(action, {
                    method: 'POST',
                    headers:{
                        "Content-type":'application/json'
                    },
                    body: JSON.stringify({
                        password: newPw
                    })
                })
                if (res.status == 200){
                    errorMessage.innerHTML = "<span class=\"text-success\">Password has been changed, you can return to login page</span>"
                    document.querySelector('#toLogin').innerHTML = 'Back to login now<a href="/auth/login" class="text-decoration-none">Sign in'
                }else{
                    errorMessage.innerHTML = "<span class=\"text-danger\">Something bad happened</span>"
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            errorMessage.innerHTML = "<span class=\"text-danger\">Password must be between 8 to 32 characters and contain at least one letter, one number, and one special character.</span>"
        }
    }else{  
        errorMessage.innerHTML = "<span class=\"text-danger\">Password and Confirmed password do not match</span>"
    }

}