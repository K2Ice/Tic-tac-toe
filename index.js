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

	document.querySelector("dialog").addEventListener("click", function (e) {
		if (this !== e.target) return;
		this.close();
	});

	document.querySelector(".resetBtn").addEventListener("click", () => {
		game.resetGame();
	});

	const resetGameboard = () => {
		result.forEach((el, index) => (result[index] = " "));
		render();
	};

	const checkWinStructure = () => {
		let winningStructure = null;
		winningCombinations.some((arr) => {
			const sign1 = result[arr[0]];
			const sign2 = result[arr[1]];
			const sign3 = result[arr[2]];
			if (
				sign1 === sign2 &&
				sign2 === sign3 &&
				sign1 === sign3 &&
				sign1 !== " " &&
				sign2 !== " " &&
				sign3 !== " "
			) {
				winningStructure = arr;
				return true;
			} else false;
		});
		return winningStructure;
	};

	const isChanceToWin = () => {
		return winningCombinations.some((arr) => {
			const sign1 = result[arr[0]];
			const sign2 = result[arr[1]];
			const sign3 = result[arr[2]];

			if (sign1 === sign2 && sign3 === " ") return true;
			else if (sign2 === sign3 && sign1 === " ") return true;
			else if (sign1 === sign3 && sign2 === " ") return true;
			else if (
				(sign1 === " " && sign2 === " ") ||
				(sign2 === " " && sign3 === " ") ||
				(sign1 === " " && sign3 === " ")
			)
				return true;
			else return false;
		});
	};

	const createStructure = () => {
		result.forEach((el, index) => {
			const htmlElement = document.createElement("div");
			htmlElement.setAttribute("data-number", index);
			htmlElement.classList.add("box");
			htmlElement.innerText = el;

			htmlElement.addEventListener("click", game.markPosition);

			document.getElementById("gameboard").appendChild(htmlElement);
		});
	};

	const render = function () {
		elements.gameboard.innerText = "";
		createStructure();

		const winningPositions = checkWinStructure();

		if (winningPositions === null && isChanceToWin() === false) {
			document.getElementById("winner").innerText = `Tie`;
			document.querySelector("dialog").showModal();
			document.querySelector(".resetBtn>button").innerHTML = "New Game";
		} else if (winningPositions?.length === 3) {
			const tile1 = document.querySelector(
				`[data-number='${winningPositions[0]}']`,
			);
			const tile2 = document.querySelector(
				`[data-number='${winningPositions[1]}']`,
			);
			const tile3 = document.querySelector(
				`[data-number='${winningPositions[2]}']`,
			);

			document
				.querySelectorAll(".box")
				.forEach((el) => el.classList.add("not-click"));

			tile1.classList.add("win");
			tile2.classList.add("win");
			tile3.classList.add("win");

			const winnerName = game.showCurrentPlayer().name;

			document.getElementById("winner").innerText = `${winnerName} won`;
			document.querySelector("dialog").showModal();
			document.querySelector(".resetBtn>button").innerHTML = "New Game";
		}
	};

	return { render, result, resetGameboard };
})();

const player = function (playerName) {
	const name = playerName;
	return { name };
};

const game = (function () {
	const players = [];
	let currentPlayerMove = null;
	const showCurrentPlayer = () => currentPlayerMove;
	const setPlayer = (name) => players.push(player(name));
	const getPlayers = () => players;

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
		getPlayers().forEach((player) => {
			const p = document.createElement("p");
			p.setAttribute("data-player", player.name);
			p.innerText = player.name;
			elements.namesBox.appendChild(p);
		});
	};

	const disapperNameForm = () => {
		const form = document.getElementById("getPlayersNames");
		form.style.animationPlayState = "running";
		form.addEventListener("animationend", function () {
			this.style.display = "none";
			showGameBoard();
		});
	};

	const showGameBoard = () => {
		elements.gameboard.style.animationPlayState = "running";
		elements.gameboard.style.display = "grid";
		elements.namesBox.style.animationPlayState = "running";
	};

	const formNameAnimation = () => {
		elements.nameNo.innerText = "Second";
	};

	const markPosition = (e) => {
		if (gameboard.result[e.target.dataset.number] !== " ") return;

		document.querySelector(".resetBtn").style.display = "block";
		document.querySelector(".resetBtn").style.animationPlayState = "running";

		gameboard.result[e.target.dataset.number] = currentPlayerMove.sign;
		gameboard.render();
		setCurrentPlayerMove(
			currentPlayerMove === players[0] ? players[1] : players[0],
		);
	};

	const startGame = () => {
		elements.nameInput.value = "";
		if (players.length < 2) return;

		players[0].sign = "X";
		players[1].sign = "O";

		createPlayersNames();
		setCurrentPlayerMove(players[0]);
		disapperNameForm();

		gameboard.render();
	};

	const resetGame = () => {
		setCurrentPlayerMove(players[0]);
		document.querySelector(".resetBtn>button").innerHTML = "Reset";
		document.querySelector(".resetBtn").style.display = "none";
		gameboard.resetGameboard();
	};

	return {
		formNameAnimation,
		markPosition,
		resetGame,
		setPlayer,
		startGame,
		getPlayers,
		showCurrentPlayer,
	};
})();

elements.submitBtn.addEventListener("click", (e) => {
	e.preventDefault();

	if (
		elements.nameInput.value.trim() === "" ||
		elements.nameInput.value.trim().length < 3
	)
		return;

	game.setPlayer(elements.nameInput.value);

	if (game.getPlayers().length === 1) game.formNameAnimation();

	game.startGame();
});

gameboard.render();
