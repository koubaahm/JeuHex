function alphaBeta(node, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || node.isTerminal()) {
        return evaluate(node);
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let child of node.getChildren()) {
            let eval = alphaBeta(child, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) {
                break; // Coupure Beta
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let child of node.getChildren()) {
            let eval = alphaBeta(child, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) {
                break; // Coupure Alpha
            }
        }
        return minEval;
    }
}

function bestMove() {
    let bestEval = -Infinity;
    let bestMove;

    let moves = generateMoves(); // Générer tous les coups possibles pour l'IA
    for (let move of moves) {
        let newBoard = makeMove(move); // Applique le coup sur une copie du plateau
        let eval = alphaBeta(newBoard, depth, -Infinity, Infinity, false);
        if (eval > bestEval) {
            bestEval = eval;
            bestMove = move;
        }
    }

    return bestMove; // Retourne le coup avec la meilleure évaluation
}
function iaPlay() {
    let move = bestMove();
    applyMove(move); // Appliquez le meilleur coup trouvé par l'IA
    checkGameStatus(); // Vérifiez si le jeu est terminé
}


function evaluate() {
    // Exemple simplifié pour évaluation
    // Vous pouvez développer avec des heuristiques plus complexes pour évaluer les positions
    return Math.random(); // Retourne une valeur aléatoire pour l'évaluation (à remplacer par votre logique)
}
function isTerminal(gameBoard) {
    // Vous pouvez utiliser la fonction checkWin ici pour voir si le jeu est terminé
    return checkWin(1, gameBoard) || checkWin(2, gameBoard);
}
function getChildren(gameBoard, player) {
    let children = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameBoard[i][j] === 0) { // Si la case est vide
                let newBoard = gameBoard.map(row => [...row]); // Copie du plateau
                newBoard[i][j] = player; // Fait le mouvement
                children.push(newBoard);
            }
        }
    }
    return children;
}
function generateMoves(gameBoard) {
    let moves = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameBoard[i][j] === 0) { // Si la case est vide
                moves.push({row: i, col: j});
            }
        }
    }
    return moves;
}
function applyMove(move) {
    gameBoard[move.row][move.col] = currentPlayer;
    document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`).classList.add(currentPlayer === 1 ? 'player1' : 'player2');
    if (checkWin(currentPlayer)) {
        displayFireworks();
        setTimeout(resetGame, 1500);
    } else {
        currentPlayer = 1; // Retour au joueur humain
        updateCurrentPlayerDisplay();
    }
}



//////////////////////////////////////////////////////////////////////



// fontion avec IA
function hexagonClick() {
    const row = parseInt(this.dataset.row);
    const col = parseInt(this.dataset.col);
    if (gameBoard[row][col] === 0) {
        gameBoard[row][col] = currentPlayer;
        this.classList.remove('bg-gray-300', 'hover:bg-gray-400');
        this.classList.add(currentPlayer === 1 ? 'player1' : 'player2');

        if (checkWin(currentPlayer)) {
            displayFireworks();
            setTimeout(resetGame, 1500);
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateCurrentPlayerDisplay();
            if (currentPlayer === 2) {
                setTimeout(() => {
                    iaPlay(); // Fonction que l'IA utilise pour déterminer et jouer son coup
                }, 1000); // Délai pour simuler le temps de réflexion de l'IA
            }
        }
    }
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
