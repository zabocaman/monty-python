// Simple interactive Monty Hall game

let carDoor = null;
let playerChoice = null;
let openedDoor = null;
let state = "pick"; // "pick" | "reveal" | "finished"

const doorsContainer = document.getElementById("doors");
const doorButtons = Array.from(document.querySelectorAll(".door"));
const messageEl = document.getElementById("message");

const btnStay = document.getElementById("btnStay");
const btnSwitch = document.getElementById("btnSwitch");
const btnNext = document.getElementById("btnNext");

const roundsEl = document.getElementById("rounds");
const stayWinsEl = document.getElementById("stayWins");
const switchWinsEl = document.getElementById("switchWins");
const stayPctEl = document.getElementById("stayPct");
const switchPctEl = document.getElementById("switchPct");

const stats = {
    rounds: 0,
    stayWins: 0,
    switchWins: 0
};

function randomDoor() {
    return Math.ceil(Math.random() * 3);
}

function resetDoorsUI() {
    doorButtons.forEach(btn => {
        btn.disabled = false;
        btn.className = "door";
        btn.textContent = "Door " + btn.dataset.door;
    });
}

function updateStatsUI() {
    roundsEl.textContent = stats.rounds;
    stayWinsEl.textContent = stats.stayWins;
    switchWinsEl.textContent = stats.switchWins;

    if (stats.rounds === 0) {
        stayPctEl.textContent = "0";
        switchPctEl.textContent = "0";
    } else {
        stayPctEl.textContent = Math.round((stats.stayWins / stats.rounds) * 100);
        switchPctEl.textContent = Math.round((stats.switchWins / stats.rounds) * 100);
    }
}

function startRound() {
    state = "pick";
    carDoor = randomDoor();
    playerChoice = null;
    openedDoor = null;
    resetDoorsUI();
    btnStay.disabled = true;
    btnSwitch.disabled = true;
    btnNext.disabled = true;
    messageEl.textContent = "Choose a door to start.";
}

function chooseDoor(doorNumber) {
    if (state !== "pick") return;
    playerChoice = doorNumber;

    // Highlight chosen door
    doorButtons.forEach(btn => {
        if (Number(btn.dataset.door) === doorNumber) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });

    // Host opens a door that is not the car and not the player's choice
    const candidates = [1, 2, 3].filter(d => d !== carDoor && d !== playerChoice);
    openedDoor = candidates[Math.floor(Math.random() * candidates.length)];

    const openedBtn = doorButtons.find(btn => Number(btn.dataset.door) === openedDoor);
    openedBtn.classList.add("opened");
    openedBtn.textContent = "Goat 🐐";
    openedBtn.disabled = true;

    messageEl.textContent = "The host opened a door with a goat. Stay or switch?";
    btnStay.disabled = false;
    btnSwitch.disabled = false;
    state = "reveal";
}

function finishRound(didSwitch) {
    if (state !== "reveal") return;
    state = "finished";

    let finalChoice = playerChoice;
    if (didSwitch) {
        finalChoice = [1, 2, 3].find(d => d !== playerChoice && d !== openedDoor);
    }

    stats.rounds++;
    const won = finalChoice === carDoor;

    if (didSwitch) {
        if (won) stats.switchWins++;
    } else {
        if (won) stats.stayWins++;
    }

    // Reveal where the car was
    doorButtons.forEach(btn => {
        const doorNum = Number(btn.dataset.door);
        if (doorNum === carDoor) {
            btn.classList.add("car");
            btn.textContent = "🚗 Car!";
        } else if (!btn.classList.contains("opened")) {
            btn.textContent = "Goat 🐐";
        }
        btn.disabled = true;
    });

    if (won && didSwitch) {
        messageEl.textContent = "You switched and won the car! 🎉";
    } else if (won && !didSwitch) {
        messageEl.textContent = "You stayed and won the car! 🎉";
    } else if (!won && didSwitch) {
        messageEl.textContent = "You switched and got a goat. 🐐";
    } else {
        messageEl.textContent = "You stayed and got a goat. 🐐";
    }

    updateStatsUI();
    btnStay.disabled = true;
    btnSwitch.disabled = true;
    btnNext.disabled = false;
}

// Event listeners
doorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const doorNum = Number(btn.dataset.door);
        chooseDoor(doorNum);
    });
});

btnStay.addEventListener("click", () => {
    finishRound(false);
});

btnSwitch.addEventListener("click", () => {
    finishRound(true);
});

btnNext.addEventListener("click", () => {
    startRound();
});

// Initialize
updateStatsUI();
startRound();
