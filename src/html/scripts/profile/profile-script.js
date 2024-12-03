function followClicked(e) {
    if (e.innerText.startsWith("Follow")) {
        console.log("Followed");
        e.innerText = e.innerText.replace("Follow", "Unfollow");
        e.classList.remove("btn-dark");
        e.classList.add("btn-outline-dark");
    } else {
        e.innerText = e.innerText.replace("Unfollow", "Follow");
        e.classList.remove("btn-outline-dark");
        e.classList.add("btn-dark");
    }
}

