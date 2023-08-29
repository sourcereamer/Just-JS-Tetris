// прдключение и параметры эл-та canvas (поле)
const canvas = document.getElementById('game_view');
const ctx = canvas.getContext('2d');
canvas.width="320";
canvas.height="640"

const canvasS = document.getElementById('score');
const ctxS = canvasS.getContext('2d');
canvasS.width="100";
canvasS.height="20"
let score = 0;

const grid = 32; // размер квадратика фигуры
var figureSequence = []; // массив с последовательностями фигур

var gameField = [];
// заполнение массива игрового поля пустыми ячейками
for (let row = -2; row < 20; row++) {
    gameField[row] = [];

    for (let col = 0; col < 10; col++) {
        gameField[row][col] = 0;
    }
}

const figures = {
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],

    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],

    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],

    'O': [
        [1,1],
        [1,1],
    ],

    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],

    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ],

    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ]
};

const colors = {
    'J': 'rgb(65, 105, 225)',
    'I': 'rgb(255, 215, 0)',
    'L': 'rgba(140,2,159,0.8)',
    'O': 'rgb(106, 90, 205)',
    'S': 'rgb(24,124,70)',
    'T': 'rgba(0,0,0,0.6)',
    'Z': 'rgb(252,68,68)',
};

let count       = 0;
let figure      = getNextFigure();
let animation   = null;
let gameOver    = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// последовательность фигур в игре
function createSequence() {
    const sequence = ['J', 'I', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        // берем случайую фигуру
        const random = getRandomInt(0, sequence.length - 1);
        const name   = sequence.splice(random, 1)[0];
        figureSequence.push(name); // вставляем в массив последовательности фигур
    }
}

function getNextFigure() {
    // если массив пустой, генерируем новый
    if (figureSequence.length === 0) {
        createSequence();
    }

    const name   = figureSequence.pop(); // берём первую фигуру из массива
    const matrix = figures[name];

    // начальное положение фигур
    const col = gameField[0].length / 2 - 2;
    const row = (name === 'I' ? -1 : -2);

    return {
        name: name,
        matrix: matrix,
        row: row,
        col: col
    };
}

// поворот матрицы с фигурой на 90
function rotate(matrix) {
    const D = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[D - j][i])
    );
    return result;
}

// проверка, что фигура корректно сдвинулась в ячейку
function isMoveCorrect(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (cellCol + col < 0 ||
                cellCol + col >= gameField[0].length ||
                cellRow + row >= gameField.length ||
                gameField[cellRow + row][cellCol + col])) {
                return false;
            }
        }
    }
    return true;
}

// когда фигура встала на место
function placeFigure() {
    for (let row = 0; row < figure.matrix.length; row++) {
        for (let col = 0; col < figure.matrix[row].length; col++) {
            if (figure.matrix[row][col]) {
                if (figure.row + row < 0) {
                    return gameOverMsg();
                }
                gameField[figure.row + row][figure.col + col] = figure.name;
            }
        }
    }
    for (let row = gameField.length - 1; row >= 0; ) {
        // если нижний ряд полностью заполнен, очищаем
        if (gameField[row].every(cell => !!cell)) {
            score += 1;
            for (let k = row; k >= 0; k--) {
                for (let i = 0; i < gameField[k].length; i++) {
                    gameField[k][i] = gameField[k-1][i];
                }
            }
        }
        else {
            row--;
        }
    }
    figure = getNextFigure();
}

function fieldScore() {
    ctxS.clearRect(0, 0, canvasS.width, canvasS.height);
    //ctxS.fillRect(0, 0, canvasS.width, canvasS.height);
    ctxS.fillStyle = 'black';
    ctxS.font = '20px sans serif';
    ctxS.textAlign = "left";
    ctxS.textBaseline="bottom";
    //ctxS.strokeText('Score:  ' + score, 0,22);
    ctxS.fillText('Score: ' + score, 0,22);
}

// конец игры
function gameOverMsg() {
    cancelAnimationFrame(animation);
    gameOver = true;

    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 55);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '40px georgia bold';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
}

function loop() {
    animation = requestAnimationFrame(loop);

    ctx.clearRect(0,0,canvas.width,canvas.height); //очищаем canvas в самом начале

    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (gameField[row][col]) {
                const name = gameField[row][col];
                ctx.fillStyle = colors[name];
                ctx.fillRect(col * grid, row * grid, grid-1, grid-1); // делаем поле в клетку
            }
        }
    }

    fieldScore();

    if (figure) {
        // кадры движения вниз = 30
        if (++count > 30 - Math.floor(score/5)) {
            figure.row++;
            count = 0;
            // вставляем фигуру, проверяем возможно ли удаление строки
            if (!isMoveCorrect(figure.matrix, figure.row, figure.col)) {
                figure.row--;
                placeFigure();
            }
        }

        ctx.fillStyle = colors[figure.name];

        for (let row = 0; row < figure.matrix.length; row++) {
            for (let col = 0; col < figure.matrix[row].length; col++) {
                if (figure.matrix[row][col]) {
                    ctx.fillRect((figure.col + col) * grid, (figure.row + row) * grid, grid-1, grid-1);
                }
            }
        }
    }
}

animation = requestAnimationFrame(loop);
