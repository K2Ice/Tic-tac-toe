const gameboard = (function () {
	const result = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

	const render = function () {
		document.getElementById("gameboard").innerText = "";
		result.forEach((el, index) => {
			const htmlElement = document.createElement("div");
			htmlElement.setAttribute("data-number", index);
			htmlElement.classList.add("box");
			htmlElement.innerText = el;
			htmlElement.addEventListener("click", function () {
				result[this.dataset.number] = "X";
				render();
			});
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
	const setPlayer = (name) => players.push(player(name));

	const startGame = () => {
		if (players.length < 2) return;
		players[0].sign = "X";
		players[1].sign = "O";
		gameboard.render();
	};
	return { setPlayer, startGame, players };
})();

const submitBtn = document.getElementById("submitName");
const nameInput = document.getElementById("playerName");

submitBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (nameInput === "" && nameInput.length <= 3) return;
	game.setPlayer(nameInput.value);
	game.startGame();
});

gameboard.render();
