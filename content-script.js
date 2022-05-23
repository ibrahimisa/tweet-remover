async function app(){

  let storage = browser.storage.local;

  // get list of blocked users from storage
  let blockedUsers = await storage.get('blockedUsers');
  blockedUsers = blockedUsers.blockedUsers;
  console.log(blockedUsers);
  // storage.get('blockedUsers').then(value => {
  //   blockedUsers = value

  // });

  browser.storage.onChanged.addListener((changes, area) => {
    blockedUsers = changes.blockedUsers.newValue;
    // console.log(blockedUsers);

    // browser.runtime.onMessage.addListener((request) => {
    //   document.body.innerHTML = request.username;
    // });
  });

  // const feed = document.querySelector('div[data-testid="primaryColumn"');
  // const feed = document.querySelector(
  //   '.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c'
  // );
  // console.log(feed);

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



function callback(mutations) {
  // mutations.forEach((mutation) => {
  //   const { addedNodes } = mutation;
  //   if (!addedNodes.length) return;
  //   // if there are added nodes...
  //   for (const node of addedNodes) {
  //     if (node.tagName && node.querySelector('article')) {
  //       const article = node.querySelector('article');
  //       // (*)
  //       if (!article.innerText.includes(username)) return;
  //       // if post is from user...
  //       const isRetweet = article.innerText.includes(username + 'Retweet');
  //       const isTweet = !isRetweet;
  //       if ((removeTweet && isTweet) || (removeRetweet && isRetweet)) {
  //         article.parentElement.parentElement.parentElement.style.display =
  //           'none';
  //       }
  //       // (**)
  //       /*
  //         the code from (*) to (**) can be replaced with
  //           if( (removeTweet && article.innerText.includes(username)) || (removeRetweet && article.innerText.includes(username+ ' Retweeted')) ){
  //             article.parentElement.parentElement.parentElement.style.display =
  //               'none';
  //           }
  //       */
  //     }
  //   }
  // });
}
