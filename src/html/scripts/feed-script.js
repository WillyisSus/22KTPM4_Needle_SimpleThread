//feed
let homeFeedContainer = document.getElementById('home-feed-thread-container');

import('./feed-creator.js').then(({ upgradeToFeedControl, threadPostContent }) =>
    upgradeToFeedControl(homeFeedContainer, '/thread/feed', { only_following: true }, threadPostContent)
);

let forYourPageContainer = document.getElementById('for-your-page-thread-container');

import('./feed-creator.js').then(({ upgradeToFeedControl, threadPostContent }) =>
    upgradeToFeedControl(forYourPageContainer, '/thread/feed', { only_following: false }, threadPostContent)
);

let curProfileFeedContainer = document.getElementById('cur-profile-thread-container');

import('./feed-creator.js').then(({ upgradeToFeedControl, threadPostContent }) =>
    upgradeToFeedControl(curProfileFeedContainer, '/thread/cur-profile', {}, threadPostContent)
);

let profileFeedContainer = document.getElementById('profile-thread-container');
import('./feed-creator.js').then(({ upgradeToFeedControl, threadPostContent }) =>
    upgradeToFeedControl(profileFeedContainer, `/thread/profile/${profileFeedContainer.dataset.userId}`, {}, threadPostContent)
);

let threadRepliesContainer = document.getElementById('thread-replies-container');
import('./feed-creator.js').then(({ upgradeToFeedControl, threadPostContent }) => {
    upgradeToFeedControl(threadRepliesContainer, `/thread/api/${threadRepliesContainer.dataset.threadId}`, {}, threadPostContent).then(() => {
        let repliesDiv = document.createElement('div');
        repliesDiv.innerHTML = `<div class="thread-card d-flex flex-row" style="justify-content: center; padding: 0.25rem;">
                <h3>Replies</h3>
            </div>`;

        let firstThread = document.getElementById(`thread-${threadRepliesContainer.dataset.threadId}`);
        console.log(firstThread);
        firstThread.insertAdjacentElement("afterend", repliesDiv);
    });




});

async function like(thread_id, heart_btn) {
    let el = document.getElementById(`thread_id_${thread_id}`);
    let str = el.innerText.trim();
    let nlikes = parseInt(str.split(" ")[0]);

    const res = await fetch(`/thread/like/${thread_id}`, { method: 'POST' })
    if (res.ok) {
        el.innerText = `${nlikes + 1} Likes`;
        heart_btn.classList.remove("bi-heart");
        heart_btn.classList.add("bi-heart-fill");
        heart_btn.classList.add("text-danger");
        return;
    }
    await fetch(`/thread/like/${thread_id}`, { method: 'DELETE' });
    el.innerText = `${nlikes - 1} Likes`;
    heart_btn.classList.remove("bi-heart-fill");
    heart_btn.classList.remove("text-danger");
    heart_btn.classList.add("bi-heart");


}