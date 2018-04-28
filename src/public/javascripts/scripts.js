const http = new XMLHttpRequest();

const updateVotes = () => {
  console.log(http.status, typeof http.status);
  
  if (http.status !== 200) {
    return;
  }

  const response = JSON.parse(http.responseText);

  if (!response || !response['strategyID']) {
    return;
  }

  const strategyID = response['strategyID'];

  const votes = document.getElementsByClassName('vote');

  for (let i = 0; i < votes.length; i++) {
    const vote = votes[i];

    const id = vote.getElementsByTagName('button')[0].id;
    const count = vote.getElementsByClassName('voteCount')[0];

    if (id === strategyID) {
      count.textContent = String(Number(count.textContent) + 1);
      vote.replaceChild(count, vote.getElementsByClassName('voteCount')[0]);
    }

    // document.replaceChild(vote, document.getElementsByClassName('vote')[i]);
  }
};

const upvote = (id) => {
  http.open('GET', `/vote/${id}`);
  http.send();
};

const listenOnVotes = () => {
  const buttons = document.getElementsByClassName('upvote');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', upvote.bind(null, buttons[i].id));
  }

  http.addEventListener('load', updateVotes);
};

document.addEventListener('DOMContentLoaded', listenOnVotes);
