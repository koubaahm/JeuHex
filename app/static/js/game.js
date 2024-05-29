document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("hex-game-board");
    const currentPlayerSpan = document.getElementById("current-player");
    const winnerMessage = document.getElementById("winner-message");
    const resetButton = document.getElementById("reset-button");
    const difficultySelect = document.getElementById("difficulty-select");

     // Vérifier si la page actuelle est alphabeta_game.html
    const isAlphaBeta = window.location.pathname.includes("alphabeta_game.html");

    //modifie a 1 pour rendre le joueur
    let numberPlayers=1;
    const player1Name = sessionStorage.getItem("player1Name") || "Joueur 1";
    const player2Name = sessionStorage.getItem("player2Name") || "Joueur 2";
    let rows = 7    ; // Height of the board
    let cols = 7; // Width of the board
    let currentPlayer = 1;
    let opponent = currentPlayer === 1 ? 2 : 1 ;
    let gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));
    let validMoves = [];
    let playerMoves = {
        1: [], // Moves of Player 1 (Red)
        2: []  // Moves of Player 2 (Blue)
    };

    // Fonction pour mettre à jour la taille du plateau en fonction du choix de difficulté
    function updateBoardSize() {
        rows = parseInt(difficultySelect.value);
        cols = parseInt(difficultySelect.value);
        resetGame(); // Réinitialiser le jeu avec la nouvelle taille du plateau
    }
    // Ajouter un écouteur d'événement pour détecter les changements de taille du plateau
    difficultySelect.addEventListener("change", updateBoardSize);

    //montre le joueur courant
    function updateCurrentPlayerDisplay() {
        currentPlayerSpan.textContent = `Joueur actuel : Joueur ${currentPlayer}`;
        const header = document.getElementById('game-header');
        if (currentPlayer === 1) {
            header.classList.remove('bg-blue-500');
            header.classList.add('bg-red-500');
        } else {
            header.classList.remove('bg-red-500');
            header.classList.add('bg-blue-500');
        }
    }
    //c'est fini?
    function checkWin(player) {
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        let win = false;

        function dfs(r, c) {
            if (visited[r][c]) return;
            visited[r][c] = true;

            if (player === 1 && r === rows - 1) {
                win = true;
                return;
            } else if (player === 2 && c === cols - 1) {
                win = true;
                return;
            }

            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
            for (let [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gameBoard[nr][nc] === player) {
                    dfs(nr, nc);
                    if (win) return;
                }
            }
        }

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
    // booléen si il ya une victoire en un coup
    function canWinInOneMove(player) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (gameBoard[r][c] === 0) {
                    gameBoard[r][c] = player;
                    if (checkWin(player)) {
                        gameBoard[r][c] = 0;
                        return true;
                    }
                    gameBoard[r][c] = 0;
                }
            }
        }
        return false;
    }

    //rafraichir la partie
    function resetGame() {
        gameBoard = Array.from({ length: rows }, () => Array(cols).fill(0));
        board.innerHTML = '';
        initializeBoard();
        currentPlayer = 1;
        updateCurrentPlayerDisplay();
        winnerMessage.textContent = '';
        console.log('Game reset');
    }

    //Initialisation de la partie
    function initializeBoard() {
        validMoves = [];
        playerMoves = {
            1: [],
            2: []
        };
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                validMoves.push({ r, c });
            }
        }
        const board = document.getElementById("hex-game-board");
        board.innerHTML = '';
        let leftMargin;
        for (let i = 0; i < rows; i++) {
            leftMargin = `${(i + 1) * 52}px`;
            let rowContainer = document.createElement("div");
            rowContainer.classList.add("flex", "justify-center");
            rowContainer.style.marginLeft = leftMargin;
            rowContainer.style.marginBottom = "-12px";
            rowContainer.style.position = "relative";

            for (let j = 0; j < cols; j++) {
                const hexagon = document.createElement("div");
                hexagon.classList.add("hexagon", "w-16", "h-14", "bg-gray-300", "cursor-pointer", "flex", "justify-center", "items-center", "transform", "transition", "duration-200", "hover:scale-110");
                hexagon.dataset.row = i;
                hexagon.dataset.col = j;
                hexagon.addEventListener("click", hexagonClick);
                if (i === 0) {
                    hexagon.style.borderTop = "10px solid red";
                }
                if (i === rows - 1) {
                    hexagon.style.borderBottom = "10px solid red";
                }
                if (j === 0) {
                    hexagon.style.borderLeft = "10px solid blue";
                }
                if (j === cols - 1) {
                    hexagon.style.borderRight = "10px solid blue";
                }
                rowContainer.appendChild(hexagon);
            }
            board.appendChild(rowContainer);
        }
    }

    // Animation de victoire
    function displayFireworks() {
        const totalFireworks = 12;
        let count = 0;
        const fireworkImageUrl = document.body.getAttribute('data-firework-image');

        winnerMessage.textContent = `Félicitations ! Joueur ${currentPlayer} gagne !`;
        winnerMessage.style.color = currentPlayer === 1 ? 'red' : 'blue';
        winnerMessage.style.opacity = 1;

        const positions = [
            { top: '10%', left: '10%' },
            { top: '10%', left: '80%' },
            { top: '80%', left: '10%' },
            { top: '80%', left: '80%' },
            { top: '50%', left: '50%' }
        ];

        const interval = setInterval(() => {
            const size = Math.random() * 100 + 500;
            const firework = document.createElement('div');
            firework.classList.add('firework');
            const position = positions[Math.floor(Math.random() * positions.length)];
            firework.style.position = 'fixed';
            firework.style.top = position.top;
            firework.style.left = position.left;
            firework.style.width = `${size}px`;
            firework.style.height = `${size}px`;
            firework.style.background = `url('${fireworkImageUrl}') no-repeat center center`;
            firework.style.backgroundSize = 'cover';

            document.body.appendChild(firework);

            setTimeout(() => {
                document.body.removeChild(firework);
            }, 900);

            count++;
            if (count >= totalFireworks) {
                clearInterval(interval);
                setTimeout(() => {
                    winnerMessage.style.opacity = 0;
                }, 1000);
            }
        }, 1000);
        //  score du joueur gagnant
    const scoreElement = document.getElementById(`score${currentPlayer}`);
    let score = parseInt(scoreElement.textContent);
    score++;
    scoreElement.textContent = score;
    }

    //Clique
    function hexagonClick() {
        if (winnerMessage.textContent !== '') {
        // Si le message de victoire est affiché, cela signifie que le jeu est en cours de réinitialisation
        // Donc, empêcher les joueurs de jouer
        return;
    }
        const row = parseInt(this.dataset.row);
        const col = parseInt(this.dataset.col);
        if (gameBoard[row][col] === 0) {
            gameBoard[row][col] = currentPlayer;
            this.classList.remove('bg-gray-300', 'hover:bg-gray-400');
            this.classList.add(currentPlayer === 1 ? 'player1' : 'player2');
            validMoves = validMoves.filter(m => !(m.r === row && m.c === col));
            playerMoves[currentPlayer].push([row, col]);

            if (checkWin(currentPlayer)) {
                 displayFireworks();  // Afficher les feux d'artifice au lieu de l'alert
            setTimeout(resetGame, 9000);  // Attendre 9 secondes avant de réinitialiser le jeu
            } else {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                updateCurrentPlayerDisplay();
            }
            if (currentPlayer === 2 && numberPlayers === 1) {
                setTimeout(makeAiMove, 500);
            }
        }
    }

    function shortestPathToVictory(player) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]
        ];
        let queue = [];
        let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        let connectedToEnd = false;

        // Initialize the queue with the player's moves
        for (const [r, c] of playerMoves[player]) {
            queue.push([r, c, 0]); // Initialize with distance 0
            visited[r][c] = true;
        }

        // Perform BFS
        while (queue.length > 0) {
            const [r, c, dist] = queue.shift();

            // Check if we've reached the target
            if ((player === 1 && r === rows - 1) || (player === 2 && c === cols - 1)) {
                connectedToEnd = true;
            }
            if ((player === 1 && r === 0 && connectedToEnd) || (player === 2 && c === 0 && connectedToEnd)) {
                return dist;
            }

            // Explore neighbors
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                    if (gameBoard[nr][nc] === 0) {
                        queue.push([nr, nc, dist + 1]); // distance 1
                    } else if (gameBoard[nr][nc] === player) {
                        queue.push([nr, nc, dist]); // distance 0
                    }
                    visited[nr][nc] = true;
                }
            }
        }
        return -1; // No path found
    }


    function connectedParts(player) {
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]
        ];
        let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        let connectedParts = [];

        // Helper function to perform BFS from a given start position
        function bfs(r, c) {
            let queue = [[r, c]];
            let component = [];
            visited[r][c] = true;
            component.push({ r, c });

            while (queue.length > 0) {
                const [cr, cc] = queue.shift();
                for (const [dr, dc] of directions) {
                    const nr = cr + dr;
                    const nc = cc + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gameBoard[nr][nc] === player) {
                        queue.push([nr, nc]);
                        visited[nr][nc] = true;
                        component.push({ r: nr, c: nc });
                    }
                }
            }
            return component;
        }

        // Iterate over all player moves to find connected components
        for (const [r, c] of playerMoves[player]) {
            if (!visited[r][c] && gameBoard[r][c] === player) {
                const component = bfs(r, c);
                if (component.length > 0) {
                    connectedParts.push(component);
                }
            }
        }

        return connectedParts; // Return all connected components
    }

    //case capturé
    function isCapturedTile(r, c, player) {
        const opponent = player === 1 ? 2 : 1;
        const directions = player === 1 ? [[-1, 0], [1, 0],[-1,1],[1,-1]] : [[0, -1], [0, 1],[-1,1],[1,-1]]; // Top and bottom for player 1, right and left for player 2
        let opponentCount = 0;
        let isCaptured = true;
        //check if the tiles neighbours are opponents
        for (let [dr, dc] of directions) {
            let nr1 = r + dr;
            let nc1 = c + dc;
            if(nr1 >= rows || nr1 < 0  || nc1 >= cols || nc1<0)
                continue ;
            if(board[nr1,nc1] !== opponent  )
            {
                isCaptured = false;
                break ;
            }
        }

        return isCaptured || countConnectedNeighbors(r, c, opponent) >= 4;
    }

    //un movement qui bloque l'adverssaire
    function isBlockingMove(r, c, player) {
        //for look ahead if a move is blocking
        const opponent = player === 1 ? 2 : 1;
        const directions = player === 1 ? [[-1, 0], [1, 0],[-1,1],[1,-1]] : [[0, -1], [0, 1],[-1,1],[1,-1]]; // Top and bottom for player 1, right and left for player 2
        let opponentCount = 0;
        /*for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {

                for (let [dr, dc] of directions) {
                    let nr1 = r + dr;
                    let nc1 = c + dc;
                    if(nr1 >= rows || nr1 < 1  || nc1 >= cols || nc1<0)
                        continue ;
                    if(board[nr1,nc1] !== opponent  )
                    {
                        break ;
                    }
                }
            }
        }*/

    }

    //un mouvement qui capture une chaine
    function isDirectionalCapturingMove(row, col, opponent) {
        // Check if this move captures the opponent by blocking both relevant paths
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
        let topHalfCount = 0;
        let bottomHalfCount = 0;

        // Count opponent's tiles in the top and bottom halves
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (gameBoard[r][c] === opponent) {
                    if (r < Math.floor(rows / 2)) {
                        topHalfCount++;
                    } else {
                        bottomHalfCount++;
                    }
                }
            }
        }

        // Check for capturing move
        let capture = false;
        for (let [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gameBoard[nr][nc] === opponent) {
                const oppositeNr = row - dr;
                const oppositeNc = col - dc;
                if (oppositeNr >= 0 && oppositeNr < rows && oppositeNc >= 0 && oppositeNc < cols && gameBoard[oppositeNr][oppositeNc] === opponent) {
                    if ((topHalfCount > bottomHalfCount && row >= Math.floor(rows / 2)) ||
                        (bottomHalfCount >= topHalfCount && row < Math.floor(rows / 2))) {
                        capture = true;
                        break;
                    }
                }
            }
        }

        return capture;
    }
    //plus court chemin bfs
    function shortestPathToVictory(player) {
        const queue = [];
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        let minDistance = Infinity;

        // Enqueue all starting positions based on player
        if (player === 1) {
            for (let c = 0; c < cols; c++) {
                if (gameBoard[0][c] === player) {
                    queue.push([0, c, 0]);
                    visited[0][c] = true;
                }
            }
        } else {
            for (let r = 0; r < rows; r++) {
                if (gameBoard[r][0] === player) {
                    queue.push([r, 0, 0]);
                    visited[r][0] = true;
                }
            }
        }

        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];

        while (queue.length > 0) {
            const [r, c, d] = queue.shift();
            if ((player === 1 && r === rows - 1) || (player === 2 && c === cols - 1)) {
                minDistance = Math.min(minDistance, d);
            }

            for (let [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gameBoard[nr][nc] !== (player === 1 ? 2 : 1)) {
                    queue.push([nr, nc, d + 1]);
                    visited[nr][nc] = true;
                }
            }
        }

        return minDistance === Infinity ? 0 : minDistance;
    }

    //blockage critique (arrete un coup de victoire en 1)
    function isCriticalBlock(row, col, opponent) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];

        gameBoard[row][col] = opponent; // Temporarily make the move for opponent
        const originalWin = checkWin(opponent); // Check if this creates a win path
        gameBoard[row][col] = 0; // Undo the move

        if (!originalWin) {
            return false; // Not critical if it doesn't block a winning path
        }

        gameBoard[row][col] = 1; // Temporarily block the move for opponent
        const stillWin = checkWin(opponent); // Check if there's still a winning path

        if (!stillWin) {
            // Check neighbors to ensure no neighboring tiles are critical blocks
            for (let [dr, dc] of directions) {
                const nr = row + dr;
                const nc = col + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gameBoard[nr][nc] === 0) {
                    gameBoard[nr][nc] = opponent; // Temporarily make the move for opponent
                    const neighborWin = checkWin(opponent);
                    gameBoard[nr][nc] = 0; // Undo the move
                    if (neighborWin) {
                        gameBoard[row][col] = 0; // Undo the block
                        return false; // Not critical if a neighbor is a critical block
                    }
                }
            }
        }

        gameBoard[row][col] = 0; // Undo the block
        return !stillWin; // Critical if blocking this move prevents the win
    }

    //Evaluation d'une case
    function evaluateMove(row, col, player) {
        if (gameBoard[row][col] !== 0) return -Infinity; // Already occupied tiles should not be evaluated

        let score = 0;
        let logDetails = [];

        // Initial preference for center control
        const centerRow = Math.floor(rows / 2);
        const centerCol = Math.floor(cols / 2);
        const distanceToCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol); // make it with 0.
        score -= distanceToCenter; // Closer to the center is better

        // Check for winning move
        gameBoard[row][col] = player; // Temporarily make the move
        if (checkWin(player)) {
            score += 100; // High score for a winning move
            logDetails.push('Winning Move');
        }
        gameBoard[row][col] = 0; // Undo the move

        // Evaluate the shortest path to victory for the current player
        const opponent = player === 1 ? 2 : 1;
        const playerPathBefore = shortestPathToVictory(player);
        const opponentPathBefore = shortestPathToVictory(opponent);

        gameBoard[row][col] = player; // Temporarily make the move
        playerMoves[player].push([row, col]);
        const playerPathAfter = shortestPathToVictory(player);
        const opponentPathAfter = shortestPathToVictory(opponent);
        gameBoard[row][col] = 0; // Undo the move
        playerMoves[player].pop();

        const playerPathDelta = (playerPathBefore === -1) ? 0 : playerPathBefore - playerPathAfter;
        const opponentPathDelta = (opponentPathBefore === -1) ? 0 : opponentPathBefore - opponentPathAfter;
        score += playerPathDelta * 5; // Shorten our path to victory
        score -= opponentPathDelta * 5; // Lengthen opponent's path to victory

        logDetails.push(`Shortest Path to Victory: ${playerPathAfter}, Opponent Path: ${opponentPathAfter}`);

        // Blocking opponent's critical path
        gameBoard[row][col] = opponent; // Temporarily make the move for opponent
        if (checkWin(opponent)) {
            score += 90; // High score for blocking opponent's winning move
            logDetails.push('Blocking Opponent Winning Move');
        }
        gameBoard[row][col] = 0; // Undo the move

        // Emphasize blocking critical paths and capturing
        if (isCriticalBlock(row, col, opponent)) {
            score += 80; // Emphasize blocking critical paths
            logDetails.push('Critical Block');
        }
        if (isDirectionalCapturingMove(row, col, opponent)) {
            score += 85; // High score for directional capturing moves
            logDetails.push('Directional Capture');
        }
        if (isCapturedTile(row, col, player)) {
            score -= 80;
            logDetails.push('Captured tile');
        }

        // Potential bridges and strategic positions for player
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
        for (let [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (gameBoard[nr][nc] === player) {
                    score += 7; // Lower score for creating bridges or connecting pieces
                } else if (gameBoard[nr][nc] === opponent) {
                    // Block opponent's strategic position
                    const furtherNr = nr + dr;
                    const furtherNc = nc + dc;
                    if (furtherNr >= 0 && furtherNr < rows && furtherNc >= 0 && furtherNc < cols && gameBoard[furtherNr][furtherNc] === opponent) {
                        score += 10; // Reward for blocking potential bridges
                    }
                }
            }
        }

        return { score, logDetails };
    }

    //Algorithme Alphabeta
    function alphaBeta(row, col, player, depth = 3, alpha = -Infinity, beta = Infinity, isMaximizingPlayer = true) {
        let { score, logDetails } = evaluateMove(row, col, player);

        const opponent = player === 1 ? 2 : 1;

        // If depth is greater than 1, simulate opponent's move
        if (depth > 1) {
            let opponentBestScore = -Infinity;
            gameBoard[row][col] = player;
            const opponentMoves = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (gameBoard[r][c] === 0) {
                        opponentMoves.push({ r, c });
                    }
                }
            }

            for (let move of opponentMoves) {
                const { r, c } = move;
                const opponentScore = alphaBeta(r, c, opponent, depth - 1, alpha, beta, !isMaximizingPlayer);
                if (opponentScore > opponentBestScore) {
                    opponentBestScore = opponentScore;
                }
                if (isMaximizingPlayer) {
                    alpha = Math.max(alpha, opponentBestScore);
                } else {
                    beta = Math.min(beta, opponentBestScore);
                }
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            score -= opponentBestScore; // Subtract the opponent's best score to simulate blocking
            gameBoard[row][col] = 0; // Undo the current player's move
        }

        console.log(`Tile (${row}, ${col}): Score = ${score}, Details: ${logDetails.join(', ')}`);

        return score;
    }

    //Algorithme SSS*
    function SSSstar(row, col, player, depth = 3) {
        let { score, logDetails } = evaluateMove(row, col, player);

        const opponent = player === 1 ? 2 : 1;

        // If depth is greater than 1, simulate opponent's move
        if (depth > 1) {
            let opponentBestScore = -Infinity;
            gameBoard[row][col] = player; // Temporarily make the move for the current player
            const opponentMoves = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (gameBoard[r][c] === 0) {
                        opponentMoves.push({ r, c });
                    }
                }
            }

            for (let move of opponentMoves) {
                const { r, c } = move;
                const opponentScore = SSSstar(r, c, opponent, depth - 1);
                if (opponentScore > opponentBestScore) {
                    opponentBestScore = opponentScore;
                }
            }
            score -= opponentBestScore; // Subtract the opponent's best score to simulate blocking
            gameBoard[row][col] = 0; // Undo the current player's move
        }

        console.log(`Tile (${row}, ${col}): Score = ${score}, Details: ${logDetails.join(', ')}`);

        return score;
    }



    //plus court chemin glouton
    function greedyShortestPathToVictory(player) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
        const opponent = player === 1 ? 2 : 1;
        const queue = [];
        const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

        // Initialize the queue with the player's existing tiles and simulate their distance
        playerMoves[player].forEach(([r, c]) => {
            queue.push([r, c]);
            if (player === 1) {
                distances[r][c] = r; // Distance to the bottom row
            } else {
                distances[r][c] = c; // Distance to the right column
            }
            visited[r][c] = true;
        });

        while (queue.length > 0) {
            const [r, c] = queue.shift();

            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && gameBoard[nr][nc] !== opponent) {
                    const newDistance = distances[r][c] + 1;
                    if (newDistance < distances[nr][nc]) {
                        distances[nr][nc] = newDistance;
                        queue.push([nr, nc]);
                        visited[nr][nc] = true;
                    }
                }
            }
        }

        // Find the shortest path to the goal
        let shortestPath = Infinity;
        if (player === 1) {
            for (let c = 0; c < cols; c++) {
                if (distances[rows - 1][c] < shortestPath) {
                    shortestPath = distances[rows - 1][c];
                }
            }
        } else {
            for (let r = 0; r < rows; r++) {
                if (distances[r][cols - 1] < shortestPath) {
                    shortestPath = distances[r][cols - 1];
                }
            }
        }

        return shortestPath === Infinity ? -1 : shortestPath; // Return -1 if no path is found
    }

    //IA qui fait un geste
    function makeAiMove() {
        if (validMoves.length === 0) return; // No moves available

        let bestMove = null;
        let bestScore = -Infinity;
        let candidateMoves = new Set();

        // Add neighbors of valued tiles and their neighbors to candidate moves
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (gameBoard[r][c] === 0) {
                    candidateMoves.add(`${r},${c}`);
                    getNeighbours(r, c).forEach(([nr, nc]) => {
                        if (gameBoard[nr][nc] === 0) {
                            candidateMoves.add(`${nr},${nc}`);
                            getNeighbours(nr, nc).forEach(([nnr, nnc]) => {
                                if (gameBoard[nnr][nnc] === 0) {
                                    candidateMoves.add(`${nnr},${nnc}`);
                                }
                            });
                        }
                    });
                }
            }
        }

        candidateMoves = Array.from(candidateMoves).map(m => {
            const [r, c] = m.split(',').map(Number);
            return { r, c };
        });

        // Evaluate all candidate moves and pick the best one
        let evaluationBoard = [];
        for (let move of candidateMoves) {
            const { r, c } = move;
            let score;
            if (isAlphaBeta) {
                score = alphaBeta(r, c, currentPlayer, 2, -Infinity, Infinity, true);
            } else {
                score = SSSstar(r, c, currentPlayer, 2);
            }
            if (!evaluationBoard[r]) {
                evaluationBoard[r] = [];
            }
            evaluationBoard[r][c] = score;
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        console.log('Evaluation Board:');
        console.table(evaluationBoard);

        if (bestMove) {
            const { r, c } = bestMove;
            gameBoard[r][c] = currentPlayer;

            let hexagon = board.querySelector(`div[data-row='${r}'][data-col='${c}']`);
            hexagon.classList.remove('bg-gray-300', 'hover:bg-gray-400');
            hexagon.classList.add(currentPlayer === 1 ? 'player1' : 'player2');
            playerMoves[currentPlayer].push([r, c]);
            validMoves = validMoves.filter(m => !(m.r === r && m.c === c)); // Remove the chosen move from validMoves

            if (checkWin(currentPlayer)) {
                displayFireworks();  // Display fireworks
                setTimeout(resetGame, 1500);  // Wait 1.5 seconds before resetting the game
            } else {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                updateCurrentPlayerDisplay();
            }
        }
    }




    //les coups joués
    function getMoves() {
        const moves = [];
        for (let r = 1; r < rows - 1; r++) {
            for (let c = 1; c < cols - 1; c++) {
                if (gameBoard[r][c] === 0) {
                    moves.push({ r, c });
                }
            }
        }
        moves.sort((a, b) => a.value - b.value);
        return moves;
    }

    // Les voisins de la case
    function getNeighbours(r, c) {
        const neighbours = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
        for (let [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                neighbours.push([nr, nc]);
            }
        }
        return neighbours;
    }

    // Les voisins connécté
    function countConnectedNeighbors(row, col, player) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
        let connectedCount = 0;

        for (let [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gameBoard[nr][nc] === player) {
                connectedCount++;
            }
        }

        return connectedCount;
    }

    //distance vers les deux cotés de la ma[
    function distanceToGoal(r, c, player) {
        const opponent = player === 1 ? 2 : 1;
        const queue = [[r, c, 0]];
        const visited = new Set();
        visited.add(`${r},${c}`);

        while (queue.length > 0) {
            const [cr, cc, dist] = queue.shift();
            if ((player === 1 && cr === rows - 1) || (player === 2 && cc === cols - 1)) {
                return dist;
            }
            for (let [nr, nc] of getNeighbours(cr, cc)) {
                if (!visited.has(`${nr},${nc}`) && gameBoard[nr][nc] !== opponent) {
                    visited.add(`${nr},${nc}`);
                    queue.push([nr, nc, dist + 1]);
                }
            }
        }
        return Infinity;
    }





    updateCurrentPlayerDisplay();
    initializeBoard();
    resetButton.addEventListener('click', resetGame);
});