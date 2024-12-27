async function upgradeToFeedControl(container, url, options, renderPostContent) {
    let isFetching = false;
    let min_thread_id = 1000000000;
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
    const { thread_id, text, picture, created_at, nfollowers, nreplies, nlikes, is_following, display_name, username, avatar, have_liked, cur_user_avatar } = post;


    return `
    <div class="thread-card d-flex flex-row">
        <div class="avatar-and-follow-icon">
            <a href="/profile/${username}">
                <img src="${avatar ? avatar : '/images/avatar.png'}" alt="avatar" class="border border-1 border-dark rounded-circle"
                    style="width: 36px; height:36px;">
            </a>
            <i class="follow-icon-avatar bi bi-plus-circle ${is_following ? 'd-none' : ''}" data-bs-toggle="modal" data-bs-target="#followPopup${thread_id}"></i>

        </div>
        <div class="card-content border border-0">
            <div class="card-header border-0 bg-white border-black rounded-0 p-0 "
                onclick="javascript:window.location.href='/thread/${thread_id}'">
                <div class="username-date d-flex justify-content-between">
                    <span>
                        <p class="fw-bold d-inline-block my-0">${username}</p>
                        <i class="bi bi-clock"></i>
                        <span>${(new Date(created_at)).toLocaleDateString() == (new Date(Date.now())).toLocaleDateString() ? 
                            new Date(created_at).toLocaleTimeString('en-GB') 
                            :new Date(created_at).toLocaleString('en-GB')}</span>
                    </span>
                </div>
            </div>
            <div class="card-body p-0" onclick="javascript:window.location.href='/thread/${thread_id}'">
                <div class="">${text}</div>
                <div class="overflow-hidden rounded-2 border border-1 border-dark" 
                    style="margin-top: 8px;  ${picture != null ? '' : 'display: none;'}">
                    <img src="${picture}" alt="Image of thread" style="width: 100%;">
                </div>
            </div>

            <div class="card-footer bg-white border-top-0">
                <p class="d-inline-block" data-bs-toggle="modal" data-bs-target="#replyThread${thread_id}"
                    onclick="getImageOfThread(event)"><i class="bi bi-chat-left-text"></i> ${nreplies} Replies</p>
                <p class="d-inline-block" ><i class="bi ${have_liked ? "bi-heart-fill text-danger" : "bi-heart"}" onclick='like(${thread_id}, this)'></i> <span id="${"thread_id_" + thread_id}"> ${nlikes} Likes</span></p>
            </div>
        </div>

        <div class="modal fade" id="followPopup${thread_id}" tabindex="-1" role="dialog" aria-labelledby="followPopup"
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
                                    <img src="${avatar ? avatar : '/images/avatar.png'}" alt="user-avatar"
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
        <div class="modal fade" id="replyThread${thread_id}" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <form id="form_reply_thread_${thread_id}" data-id="${thread_id}" onsubmit=postAThreadReply(event)> 
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalTitleId">
                                Replying a thread
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="d-flex flex-row">
                                    <div class="avatar-is-replied">
                                        <div class="avatar-and-follow-icon ">
                                            <img src="${avatar ? avatar : '/images/avatar.png'}" alt="avatar"
                                                class="border border-1 border-dark rounded-circle"
                                                style="width: 36px; height:36px;">
                                            <i class="follow-icon-avatar bi bi-plus-circle ${is_following ? 'd-none' : ''}"></i>
                                        </div>
                                        <div class="vertical-reply-bar"></div>
                                    </div>

                                    <div class="card-content border border-0 px-2">
                                        <div class="card-header border-0 bg-white border-black rounded-0 p-0 ">
                                            <div class="username-date d-flex justify-content-between">
                                                <span>
                                                    <p class="fw-bold d-inline-block my-0">${display_name}</p>
                                                    <i class="bi bi-clock"></i>
                                                    <span>${new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="card-body p-0">
                                            <div class="">${text}</div>
                                            <div class="overflow-hidden rounded-2 border border-1 border-dark"
                                                style="margin-top: 8px; ${picture ? '' : 'display: none;'}">
                                                <img src="${picture}" alt="Image of thread" style="width: 100%;">
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="d-flex flex-row">
                                    <div class="avatar-and-follow-icon">
                                        <img src="${cur_user_avatar}" alt="avatar"
                                            class="border border-1 border-dark rounded-circle"
                                            style="width: 36px; height:36px;">
                                    </div>
                                    <div
                                        class="card-content border border-0 d-flex flex-column justify-content-between w-100 px-2">
                                        <p class="fw-bold d-inline-block my-1">You are <span
                                                class="text-primary fw-medium">replying @${username}</span></p>

                                        <textarea name="thread-body" placeholder="Replying..." id="reply-thread-body"
                                            maxlength="1000"></textarea>

                                        <div class="image-card">
                                            <img id="create-thread-body-image" src="" alt="">
                                        </div>
                                    </div>

                                </div>
                                </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal"
                                onclick="clearThreadForm()">
                                Close
                            </button>
                            <button type="submit" class="btn btn-dark" data-bs-dismiss="modal">Post</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>`;
}

export { upgradeToFeedControl, threadPostContent };
