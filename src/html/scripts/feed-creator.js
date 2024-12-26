async function upgradeToFeedControl(container, url, options, renderPostContent) {
    let isFetching = false;
    let min_thread_id = 0;
    let max_thread_id = 0;

    async function fetchData() {
        if (isFetching) return;
        isFetching = true;

        try {
            const params = new URLSearchParams({ ...options, min_thread_id, max_thread_id });
            const response = await fetch(`${url}?${params.toString()}`);
            const posts = await response.json();

            console.log(posts);

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.id = `thread-${post.thread_id}`;
                postElement.innerHTML = renderPostContent(post);
                container.appendChild(postElement);
                min_thread_id = Math.min(min_thread_id, post.thread_id);
                max_thread_id = Math.max(max_thread_id, post.thread_id);
            });

            isFetching = false;
        } catch (error) {
            console.error('Error fetching data:', error);
            isFetching = false;
        }
    }

    container.addEventListener('scroll', () => {
        const scrollableHeight = container.scrollHeight - container.clientHeight;
        const scrolled = container.scrollTop;

        if (scrolled >= scrollableHeight - 100 && !isFetching) {
            fetchData().then(() => console.log('Fetched'));
        }
    });

    await fetchData();
}

function threadPostContent(post) {
    const { thread_id, text, picture, created_at, nfollowers, nreplies, nlikes, is_following, display_name, username, avatar } = post;


    return `
    <div class="thread-card d-flex flex-row">
        <div class="avatar-and-follow-icon">
            <a href="/profile/${username}">
                <img src="${avatar}" alt="avatar" class="border border-1 border-dark rounded-circle"
                    style="width: 36px; height:36px;">
            </a>
            <i class="follow-icon-avatar bi bi-plus-circle ${is_following ? 'd-none' : ''}" data-bs-toggle="modal" data-bs-target="#followPopup"></i>

        </div>
        <div class="card-content border border-0">
            <div class="card-header border-0 bg-white border-black rounded-0 p-0 "
                onclick="javascript:window.location.href='/thread/${thread_id}'">
                <div class="username-date d-flex justify-content-between">
                    <span>
                        <p class="fw-bold d-inline-block my-0">${display_name}</p>
                        <i class="bi bi-clock"></i>
                        <span>${new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </span>
                </div>
            </div>
            <div class="card-body p-0" onclick="javascript:window.location.href='/thread/${thread_id}'">
                <div class="">${text}</div>
                ${(picture) ? `
                    <div class="overflow-hidden rounded-2 border border-1 border-dark" style="margin-top: 8px;">
                        <img src="${picture}" alt="Image of thread" style="width: 100%;">
                    </div>
                ` : ""}
            </div>

            <div class="card-footer bg-white border-top-0">
                <p class="d-inline-block" data-bs-toggle="modal" data-bs-target="#replyThread"
                    onclick="getImageOfThread(event)"><i class="bi bi-chat-left-text"></i> ${nreplies} Replies</p>
                <p class="d-inline-block" id="${"thread_id_" + thread_id}"><i class="bi bi-heart" onclick='like(${thread_id})'></i> ${nlikes} Likes</p>
            </div>
        </div>

        <div class="modal fade" id="followPopup" tabindex="-1" role="dialog" aria-labelledby="followPopup"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="followPopupId">
                            Follow a user
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid d-grid">
                            <div class="row">
                                <div class="col-9">
                                    <h4>${display_name}</h4>
                                    <h6 class="fw-light">@${username}</h6>
                                    <p class="w-100 px-2">bio</p>
                                </div>
                                <div class="col-3">
                                    <img src="${avatar}" alt="user-avatar"
                                        class=" border border-1 border-dark rounded-circle w-100">
                                </div>
                            </div>
                            <div class="row">
                                <p class="py-2">${nfollowers} followers</p>
                                <button class="btn btn-dark" data-username="${username}" onclick="followClicked(this)">Follow
                                    @${username}</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>


    </div>`;
}

export { upgradeToFeedControl, threadPostContent };
