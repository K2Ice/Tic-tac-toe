const elements = (function () {
	const gameboard = document.getElementById("gameboard");
	const namesBox = document.getElementById("namesBox");
	const nameInput = document.getElementById("playerName");
	const nameNo = document.getElementById("playerNo");
	const submitBtn = document.getElementById("submitName");

	return { gameboard, submitBtn, namesBox, nameInput, nameNo };
})();

const gameboard = (function () {
	const result = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	const render = function () {
		elements.gameboard.innerText = "";
		result.forEach((el, index) => {
			const htmlElement = document.createElement("div");
			htmlElement.setAttribute("data-number", index);
			htmlElement.classList.add("box");
			htmlElement.innerText = el;

			htmlElement.addEventListener("click", game.markPosition);

			document.getElementById("gameboard").appendChild(htmlElement);
		});

		// checkStructure()
	};

	return { render, result };
})();

const player = function (playerName) {
	const name = playerName;
	return { name };
};

const game = (function () {
	const players = [];
	let currentPlayerMove = null;
	const setPlayer = (name) => players.push(player(name));

	function setCurrentPlayerMove(player) {
		currentPlayerMove = player;
		document
			.querySelectorAll(`[data-player]`)
			.forEach((el) => el.classList.remove("active"));
		document
			.querySelector(`[data-player="${player.name}"`)
			.classList.add("active");
	}

	const createPlayersNames = function () {
		players.forEach((player) => {
			const p = document.createElement("p");
			p.setAttribute("data-player", player.name);
			p.innerText = player.name;
			elements.namesBox.appendChild(p);
		});
	};

	const formNameAnimation = () => {
		elements.nameNo.innerText = "Second";
	};

	const markPosition = (e) => {
		if (gameboard.result[e.target.dataset.number] !== " ") return;

		gameboard.result[e.target.dataset.number] = currentPlayerMove.sign;
		gameboard.render();
		setCurrentPlayerMove(
			currentPlayerMove === players[0] ? players[1] : players[0],
		);
	};

	const startGame = () => {
		elements.nameInput.value = "";
		if (players.length < 2) return;
		document.getElementById("getPlayersNames").style.display = "none";
		players[0].sign = "X";
		players[1].sign = "O";
		createPlayersNames();
		setCurrentPlayerMove(players[0]);
		gameboard.render();
	};
	return { formNameAnimation, markPosition, setPlayer, startGame, players };
})();

elements.submitBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (elements.nameInput === "" && elements.nameInput.length <= 3) return;
	game.setPlayer(elements.nameInput.value);
	if (game.players.length === 1) game.formNameAnimation();
	game.startGame();
});

gameboard.render();
