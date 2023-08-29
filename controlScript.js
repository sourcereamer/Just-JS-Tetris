// Listener считывает нажатия на клавиатуре
document.addEventListener('keydown', function(e) {
    if (gameOver) return;

    if (e.keyCode === 37 || e.keyCode === 39) { // стрелка влево и вправо
        const col = (e.keyCode === 37 ? figure.col - 1 : figure.col + 1);

        if (isMoveCorrect(figure.matrix, figure.row, col)) {
            figure.col = col;
        }
    }

    if (e.keyCode === 38) { // стрелка вверх
        const matrix = rotate(figure.matrix);

        if (isMoveCorrect(matrix, figure.row, figure.col)) {
            figure.matrix = matrix;
        }
    }

    if(e.keyCode === 40) { // вниз
        const row = figure.row + 1;
        if (!isMoveCorrect(figure.matrix, row, figure.col)) {
            figure.row = row - 1;
            placeFigure();
            return;
        }
        figure.row = row;
    }
});
