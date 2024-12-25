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
            console.log('following');
            followersEl.style.fontWeight = 'normal';
            if (!followerModalBody.classList.contains('d-none')) followerModalBody.classList.add('d-none');
            followingModalBody.classList.remove('d-none');
        } else {
            console.log('followers');
            followingEl.style.fontWeight = 'normal';
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

async function saveAvatarChange() {
    try {

        const FILE_STORAGE_URL = "http://4.217.254.66:8000";
        const file = document.getElementById('pickedPicture').files[0];
        if (file) {
            let formData = new FormData();
            formData.append("file", file);
            const response = await fetch(FILE_STORAGE_URL + '/upload', { method: "POST", body: formData });
            if (response.status !== 200) {
                throw new Error(await response.text());
            }
            const data = response.json();


            const url = FILE_STORAGE_URL + data.path;

            const res = await fetch("/cur-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ avatar: url })
            });


            if (res.status === 200) {
                return window.location.reload();
            }
            throw new Error(await res.text());

        }
    } catch (error) {
        document.getElementById('saveAvatarError').innerText = error.message;

    }
}

// Follow Modal

let currentPageFollowers = 0;
let isFetchingFollowers = false;

let currentPageFollowing = 0;
let isFetchingFollowing = false;

async function fetchFollowers(page = 0) {
    if (isFetchingFollowers) return;
    isFetchingFollowers = true;

    try {
        const response = await fetch(`/cur-profile/followers?page=${page}`);
        const posts = await response.json();

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML =
                `<div class="d-flex justify-content-between">
                <div class="d-flex gap-3">
                    <img src="${post.avatar}" alt="avatar" class="border border-1 border-dark rounded-circle"
                        style="width: 36px; height:36px;">
                        <div class="d-flex flex-column">
                            <div><b>${post.display_name}</b></div>
                            <div>${post.username}</div>
                        </div>
                </div>
            </div>`;
            followerModalBody.appendChild(postElement);
        });

        isFetchingFollowers = false;
    } catch (error) {
        console.error('Error fetching feed:', error);
        isFetchingFollowers = false;
    }
}


async function fetchFollowees(page = 0) {
    if (isFetchingFollowing) return;
    isFetchingFollowing = true;

    try {
        const response = await fetch(`/cur-profile/followees?page=${page}`);
        const posts = await response.json();


        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML =
                `<div class="d-flex justify-content-between">
                    <div class="d-flex gap-3">
                        <img src="${post.avatar}" alt="avatar" class="border border-1 border-dark rounded-circle"
                            style="width: 36px; height:36px;">
                            <div class="d-flex flex-column">
                                <div><b>${post.display_name}</b></div>
                                <div>${post.username}</div>
                            </div>
                    </div>

                    <button type="button" data-username="${post.username}" class="btn btn-outline-dark col-3"
                        onclick="followClicked(this)">Unfollow</button>


                </div>`;
            followingModalBody.appendChild(postElement);
        });

        isFetchingFollowing = false;
    } catch (error) {
        console.error('Error fetching feed:', error);
        isFetchingFollowing = false;
    }
}

function setupInfiniteScroll() {
    followerModalBody.addEventListener('scroll', () => {
        const scrollableHeight = followerModalBody.scrollHeight - followerModalBody.clientHeight;
        const scrolled = followerModalBody.scrollTop;

        if (scrolled >= scrollableHeight - 100 && !isFetchingFollowers) {
            currentPageFollowers++;
            fetchFollowers(currentPageFollowers);
        }
    });

    followingModalBody.addEventListener('scroll', () => {
        const scrollableHeight = followingModalBody.scrollHeight - followingModalBody.clientHeight;
        const scrolled = followingModalBody.scrollTop;

        if (scrolled >= scrollableHeight - 100 && !isFetchingFollowing) {
            currentPageFollowing++;
            fetchFollowees(currentPageFollowing);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchFollowers();
    fetchFollowees();
    setupInfiniteScroll();
});

