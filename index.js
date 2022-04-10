const observer = new MutationObserver(callback);

const target = document.querySelector('div[data-testid="primaryColumn"');
console.log(target);

observer.observe(target, { childList: true, subtree: true });

const username = 'DEV Community';

function callback(mutations) {
  mutations.forEach((mutation) => {
    const { addedNodes } = mutation;
    if (!addedNodes.length) return;

    // if there are added nodes...
    for (const node of addedNodes) {
      if (node.tagName && node.querySelector('article')) {
        const article = node.querySelector('article');

        // (*)
        if (!article.innerText.includes(username)) return;

        // if post is from user...
        const isRetweet = article.innerText.includes(username + 'Retweet');
        const isTweet = !isRetweet;
        if ((removeTweet && isTweet) || (removeRetweet && isRetweet)) {
          article.parentElement.parentElement.parentElement.style.display =
            'none';
        }
        // (**)

        /*
          the code from (*) to (**) can be replaced with 
            if( (removeTweet && article.innerText.includes(username)) || (removeRetweet && article.innerText.includes(username+ ' Retweeted')) ){
              article.parentElement.parentElement.parentElement.style.display =
                'none';
            }
        */
      }
    }
  });
}
