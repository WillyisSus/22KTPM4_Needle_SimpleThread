let followerModalBody = document.getElementById('followerModalBody');
let followingModalBody = document.getElementById('followingModalBody');


let followersEl = document.getElementById('followersCol');
let followingEl = document.getElementById('followingCol');
[followersEl, followingEl].forEach((el) => {
    el.addEventListener('click', () => {
        if (el.style.fontWeight === 'bold') {
            return;
        }

        el.style.fontWeight = 'bold';
        if (el === followingEl) {
            followingEl.style.fontWeight = 'normal';
            if (!followerModalBody.classList.contains('d-none')) followerModalBody.classList.add('d-none');
            followingModalBody.classList.remove('d-none');
        } else {
            followersEl.style.fontWeight = 'normal';
            followerModalBody.classList.remove('d-none');
            if (!followingModalBody.classList.contains('d-none')) followingModalBody.classList.add('d-none');
        }
    });
});

async function editUser(e) {
    e.preventDefault();
    try {
        const formData = new FormData(document.querySelector("#editProfileForm"));
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        const res = await fetch("/cur-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (res.status === 200) {
            return window.location.reload();
        }
        const resText = await res.text();
        throw new Error(resText);

    } catch (error) {
        // document.querySelector("#errorMessageEdit").innerText = error.message;
        console.error(error);
    }
}

function pickPicture(e) {
    const preview = document.getElementById('changeAvatarImage');
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

function removeAvatar() {
    if (confirm("Press OK to confirm")) {
        fetch("/cur-profile/avatar", {
            method: "DELETE",
        }).then((res) => {
            if (res.status === 200) {
                return window.location.reload();
            }
            throw new Error("Internal server error");
        }).catch((error) => {
            console.error(error);
        });
    }
}

function saveAvatarChange() {
    const FILE_STORAGE_URL = "http://4.217.254.66:8000";
    const file = document.getElementById('pickedPicture').files[0];
    if (file) {
        let formData = new FormData();

        formData.append("file", file);
        fetch(FILE_STORAGE_URL + '/upload', { method: "POST", body: formData })
            .then(response => response.json())
            .then(data => {
                const url = FILE_STORAGE_URL + data.path;
                fetch("/cur-profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ avatar: url }),
                }).then((res) => {
                    if (res.status === 200) {
                        return window.location.reload();
                    }
                    throw new Error("Internal server error");
                }).catch((error) => {
                    console.error(error);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }
}

