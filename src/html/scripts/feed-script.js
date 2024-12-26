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