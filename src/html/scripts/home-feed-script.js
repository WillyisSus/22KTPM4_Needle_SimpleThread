//feed
let homeFeedContainer = document.getElementById('home-feed-thread-container');

import('./feed-creator.js').then(({ upgradeToFeedControl, threadPostContent }) =>
    upgradeToFeedControl(homeFeedContainer, '/thread/feed', {}, threadPostContent)
);
