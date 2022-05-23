const form = document.querySelector('#form');
const input = form['user-name'];
form.addEventListener('submit', blockUser);
input.addEventListener('keypress', async (e) => {
  if (e.key == 'Enter') form.submit();
});

let storage = browser.storage.local;

let blockedUsers = [];
async function init() {
  let item = await storage.get('blockedUsers');
  if (!item.blockedUsers) {
    // initialize blockedUsers to an empty array if it is not present previously
    await storage.set({
      blockedUsers,
    });
  } else {
    blockedUsers = item.blockedUsers.slice();
  }
}

// initialize blockedUsers variable before doing anything else
init();

async function blockUser(e) {
  e.preventDefault();

  if (!input.value) {
    return;
  }
  const username = input.value;
  input.value = ''

  const shouldRemoveTweet = form['block-tweet'].checked;
  const shouldRemoveRetweet = form['block-retweet'].checked;

  blockedUsers = blockedUsers.filter((user) => user.username !== username); // filter returns a new array
  const user = { username, shouldRemoveRetweet, shouldRemoveTweet };
  blockedUsers.push(user); // push returns the pushed argument

  await storage.set({
    blockedUsers,
  });

  let message = `You will no longer see <i class="text-red-600" style="color: 'red'">${username}'s</i> ${
    shouldRemoveTweet ? 'retweets' : ''
  } ${shouldRemoveTweet && shouldRemoveRetweet ? 'and' : ''} ${
    shouldRemoveRetweet ? 'tweets' : ''
  } on your feed.`;
  showInfo(message);

  let updatedItem = await storage.get('blockedUsers');
  console.log(updatedItem);
}

function showInfo(message) {
  const infoBox = document.getElementById('info');
  infoBox.style.display = 'block';
  infoBox.innerHTML = message;
  setTimeout(() => {
    infoBox.style.display = 'none';
  }, 3000);
}

async function unBlock(user) {
  blockedUsers = blockedUsers.filter((u) => u.username !== user.username);
  await storage.set({
    blockedUsers,
  });
  updateBlockedListHTML();
  showInfo(`${user.username} has been unblocked.`);
}

const blockedListDiv = document.getElementById('blocked-list');
function updateBlockedListHTML() {
  blockedListDiv.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'list-none flex flex-col gap-y-2';
  blockedUsers.forEach((user) => {
    const li = document.createElement('li');
    const unBlockBtn = document.createElement('button');
    unBlockBtn.innerText = 'unblock';
    unBlockBtn.className = 'rounded bg-green-400 px-2 text-slate-900 hover:bg-green-900';
    unBlockBtn.addEventListener('click', () => {
      unBlock(user);
    });
    li.innerHTML = `<span>→${user.username}</span>`;
    li.append(unBlockBtn);
    li.className = 'flex flex-row justify-between';
    ul.append(li);
  });
  blockedListDiv.append(ul);
}

const blockedListBtn = document.getElementById('blocked-list-btn');
let isOpen = false;
blockedListBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (isOpen) {
    blockedListDiv.classList.add('hidden');
    isOpen = false;
    return;
  }
  isOpen = true;
  updateBlockedListHTML();
  blockedListDiv.classList.remove('hidden');
});
