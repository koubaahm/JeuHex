document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("hex-game-board");
    const currentPlayerSpan = document.getElementById("current-player");
    const winnerMessage = document.getElementById("winner-message");
    const resetButton = document.getElementById("reset-button");

    const rows = 11; // Hauteur du plateau
    const cols = 11; // Largeur du plateau
    let currentPlayer = 1;
    let gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));

    function updateCurrentPlayerDisplay() {
        currentPlayerSpan.textContent = `Joueur actuel : Joueur ${currentPlayer}`;
    }

    function checkWin(player) {
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        let win = false;
    
        function dfs(r, c) {
            if (visited[r][c]) return;
            visited[r][c] = true;
    
            // Conditions de victoire spécifiques à chaque joueur
            if (player === 1 && r === rows - 1) {  // Victoire verticale pour le Joueur 1
                win = true;
                return;
            } else if (player === 2 && c === cols - 1) {  // Victoire horizontale pour le Joueur 2
                win = true;
                return;
            }
    
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
            for (let [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gameBoard[nr][nc] === player) {
                    dfs(nr, nc);
                    if (win) return; // Sortie immédiate après la victoire
                }
            }
        }
    
        // Initier la recherche à partir des positions de départ appropriées pour chaque joueur
        for (let i = 0; i < (player === 1 ? cols : rows); i++) {
            if (!win) {
                if (player === 1 && !visited[0][i] && gameBoard[0][i] === player) {
                    dfs(0, i);
                } else if (player === 2 && !visited[i][0] && gameBoard[i][0] === player) {
                    dfs(i, 0);
                }
            }
        }
        return win;
    }
    
    

    function resetGame() {
        gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));
        board.innerHTML = '';
        initializeBoard();
        currentPlayer = 1;
        updateCurrentPlayerDisplay();
        winnerMessage.textContent = '';
        console.log('Game reset');
    }

    function initializeBoard() {
        for (let i = 0; i < rows; i++) {
            let rowContainer = document.createElement("div");
            rowContainer.classList.add("row");
            rowContainer.style.marginLeft = i % 2 === 0 ? '30px' : '0px';
            for (let j = 0; j < cols; j++) {
                const hexagon = document.createElement("div");
                hexagon.className = "hexagon";
                hexagon.dataset.row = i;
                hexagon.dataset.col = j;
                hexagon.addEventListener("click", hexagonClick);
                rowContainer.appendChild(hexagon);
            }
            board.appendChild(rowContainer);
        }
    }

    function hexagonClick() {
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        if (gameBoard[row][col] === 0) {
            gameBoard[row][col] = currentPlayer;
            this.className = `hexagon player${currentPlayer}`;
            if (checkWin(currentPlayer)) {
                winnerMessage.textContent = `Joueur ${currentPlayer} gagne !`;
                alert(`Félicitations ! Joueur ${currentPlayer} gagne !`); // Affiche une alerte lorsqu'un joueur gagne
                resetGame(); // Réinitialisation automatique du jeu après la victoire
            } else {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                updateCurrentPlayerDisplay();
            }
        }
    }

    updateCurrentPlayerDisplay();
    initializeBoard();

    resetButton.addEventListener('click', resetGame);
});
