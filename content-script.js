async function app(){

  let storage = browser.storage.local;

  // get list of blocked users from storage
  let blockedUsers = await storage.get('blockedUsers');
  blockedUsers = blockedUsers.blockedUsers

  browser.storage.onChanged.addListener((changes, area) => {
    blockedUsers = changes.blockedUsers.newValue;
  });

  const observer = new MutationObserver(removeNewTweetsAddedToDOM);
  observer.observe(document.body, { childList: true, subtree: true });

  function removePost(user, post) {
    const { username, shouldRemoveTweet, shouldRemoveRetweet } = user;

    // (*)
    if (!post.innerText.includes(username)) return;

    // if post is from user...
    const isRetweet = post.innerText.includes(username + 'Retweet');
    const isTweet = !isRetweet;
    if ((shouldRemoveTweet && isTweet) || (shouldRemoveRetweet && isRetweet)) {
      post.parentElement.parentElement.parentElement.style.display = 'none';
    }
    // (**)

    /*
          the code from (*) to (**) can be replaced with 
            if( (removeTweet && post.innerText.includes(username)) || (removeRetweet && post.innerText.includes(username+ ' Retweeted')) ){
              post.parentElement.parentElement.parentElement.style.display =
                'none';
            }
        */
  }

  /* TODO  add functionality to remove promoted tweets
   */
  // function removeTweetsAlreadyInDOM(){
  //   feed.children.forEach(childElem => {
  //     if()
  //   })
  // }

  function removeNewTweetsAddedToDOM(mutations) {
    mutations.forEach((mutation) => {
      const { addedNodes } = mutation;
      if (!addedNodes.length) return;

      // if there are added nodes...
      for (const node of addedNodes) {
        if (node.tagName && node.querySelector('article')) {
          const post = node.querySelector('article');
          console.log(post);

          blockedUsers.forEach((user) => removePost(user, post));
        }
      }
    });
  }


}

app()