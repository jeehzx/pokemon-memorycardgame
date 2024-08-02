import cards from "./cards.js";

// selectors
const cardGrid = document.querySelector(".card-grid");
const modal = document.querySelector(".modal");
const modalContent = modal.querySelector("p");
const modalButton = modal.querySelector("button");

let flippedCards = [];
let matchedCards = [];
let flipCount = 0;
let duration = 0;
let timer = 0;

const startGame = () => {
  // random 8 card front
  const fronts = cards.sort(() => 0.5 - Math.random()).slice(0, 8);

  // double the cards, shuffle then add to card grip
  cardGrid.innerHTML = [...fronts, ...fronts]
    .map(({ name, image }) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.name = name;
      card.innerHTML = `
    <img src="./images/pk-backcard.png" alt="" class="back"/>
    <img src="${image}" alt="${name}" class="front" />
        `;
      return card.outerHTML;
    })
    .sort(() => 0.5 - Math.random())
    .join("");

  // initialize the timer
  startTimer();
};

const resetGame = () => {
  matchedCards = [];
  flipCount = 0;
  duration = 0;
  modal.hidden = true;
  startGame();
};

const startTimer = () => {
  timer = setInterval(() => {
    duration++;
  }, 1000);
};
const stopTimer = () => {
  clearInterval(timer);
};

const initApp = () => {
  startGame();

  // listen for clicks
  cardGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    card && flipCard(card);
  });

  //listen the event in 'play again' button
  modalButton.addEventListener("click", resetGame);
};

const flipCard = (card) => {
  const isCardFlipped = card.classList.contains("flipped");

  // check if current card is not flipped
  if (!isCardFlipped && flippedCards.length < 2) {
    // add the current card to flipped card
    card.classList.add("flipped");
    flippedCards.push(card);

    // increment flip count
    flipCount++;

    // once there 2 flipped check for match
    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
};

const checkMatch = () => {
  const [card1, card2] = flippedCards;
  if (card1.dataset.name === card2.dataset.name) {
    // add to matched list
    matchedCards.push(card1, card2);
    // check to complete game
    checkGameCompletation();
  } else {
    // unflip it if not matched
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
  }
  flippedCards = [];
};

const checkGameCompletation = () => {
  if (cardGrid.children.length === matchedCards.length) {
    //stop timer
    stopTimer();
    // update the modal content
    updateModalContent();

    // display modal
    modal.hidden = false;
  }
};

const updateModalContent = () => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const timeSpent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  modalContent.textContent = `You completed the game in ${timeSpent} with ${flipCount} flips.`;
};
// initialize
initApp();
