async function followClicked(e) {
    const username = e.dataset.username;
    if (e.innerText.startsWith("Follow")) {
        await fetch(`/profile/follow/${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Followed");
        e.innerText = e.innerText.replace("Follow", "Unfollow");
        e.classList.remove("btn-dark");
        e.classList.add("btn-outline-dark");
    } else {
        await fetch(`/profile/follow/${username} `, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        e.innerText = e.innerText.replace("Unfollow", "Follow");
        e.classList.remove("btn-outline-dark");
        e.classList.add("btn-dark");
    }
}

