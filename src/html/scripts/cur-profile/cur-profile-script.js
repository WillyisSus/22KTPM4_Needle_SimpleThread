
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
        if (el === followersEl) {
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

