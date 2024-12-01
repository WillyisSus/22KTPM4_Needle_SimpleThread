let threadInputImage =  document.getElementById("create-thread-body-image");
let inputFile =  document.getElementById('thread-image');
inputFile.onchange = function(){
    threadInputImage.src = URL.createObjectURL(inputFile.files[0])
    // Reveal parent
    let parentDiv = threadInputImage.parentElement;
    parentDiv.style.display = "block";
    let deleteButton = document.createElement('button')
    deleteButton.className = "btn btn-close";
    deleteButton.onclick = function(){
        threadInputImage.src = "";
        parentDiv.style.display = 'none';
        this.remove();
    }
    parentDiv.appendChild(deleteButton)
}

function clearThreadForm(){
    threadInputImage.src = "";
    let threadBody = document.getElementById("create-thread-body");
    threadBody.value = '';
    let deleteButton = document.querySelector("#postThread .modal-body .image-card button");
    if (deleteButton){
        deleteButton.remove();
    }
    let parentDiv = threadInputImage.parentElement;
    parentDiv.style.display = "none";
}
function getImageOfThread(e){
    e.preventDefault();
    console.log(e.target);
    let threadDiv = e.target.parentElement.parentElement;
    let threadImage = threadDiv.querySelector('.card-body img');
    let repliedThreadInFormImage = document.querySelector("#replyThread .modal-body .card-body img");

    if (threadImage){
        repliedThreadInFormImage.src = threadImage.src;
        repliedThreadInFormImage.parentElement.style.display = "block";
    }else{
        repliedThreadInFormImage.src = "";
        repliedThreadInFormImage.parentElement.style.display = "none";
    }
}




function changeFollowStatus(e){
    e.preventDefault();
    let button = e.target;
    button.className = ((button.innerText == "Following" || button.innerText == "Unfollow" )?  "btn btn-dark": "btn btn-outline-dark");
    button.innerText =  ((button.innerText == "Following" || button.innerText == "Unfollow" )? "Follow @username" : "Following");
    if (button.innerText == "Following"){
        button.onmouseover =  function() {
            button.innerText = "Unfollow"
        }
        button.onmouseleave = function() {
            button.innerText = "Following"
        }
    }else{
        button.onmouseleave = null;
        button.onmouseover = null;
    }
    
}

function closeModalAndTriggerToast(e){
    e.preventDefault();
    const toastLiveExample = document.getElementById('liveToast')
    setTimeout(()=>{    
        const toast = new bootstrap.Toast(toastLiveExample)
        toast.show()
    }, 1500)
}

