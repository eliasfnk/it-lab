window.addEventListener('load', () => {
    minesweeper.init();
});

const minesweeper = {
    


    init() {
        this.logic = localLogic;
        this.generateBody();
        this.newGame('small');
    },

    // ------------------------------------ //
    // -----   Basic Body Structure   ----- //
    // ------------------------------------ //

    generateBody() {
        const body = document.body;
        
        const container = document.createElement('div');
        container.id = 'container';
        body.appendChild(container);

        container.append(this.getHeader(), this.getMain(), this.getButtons(), this.getFooter());
    },

    getHeader() {
        const header = document.createElement('header');
       
        const title = document.createElement('div');
        title.id = 'title';
        header.appendChild(title);
        
        const heading = document.createElement('h1');
        heading.innerText = 'Minesweeper';

        const subheading = document.createElement('p');
        subheading.innerText = 'by Elias Fink';
        
        title.append(heading, subheading);
        
        return header;
    },

    getMain() {
        const main = document.createElement('main');

        return main;
    },

    getButtons() {
        const buttons = document.createElement('div');
        buttons.id = 'buttons';

        const smallButton = this.createButton('small');
        const mediumButton = this.createButton('medium');
        const largeButton = this.createButton('large');

        buttons.append(smallButton, mediumButton, largeButton);

        return buttons;
    },

    getFooter() {
        const footer = document.createElement('footer');
        
        const copyright = document.createElement('span');
        copyright.innerHTML = 'Copyright &copy; 2024 Elias Fink';

        const webLink = document.createElement('span');
        webLink.innerHTML = '<a href="https://studium.eliasfink.de/it-lab/" target="_blank" rel="noopener noreferrer">Web Version</a>';

        const gitLink = document.createElement('span');
        gitLink.innerHTML = '<a href="https://github.com/eliasfnk/it-lab.git" target="_blank" rel="noopener noreferrer">Git Repository</a>';
        
        footer.append(copyright, webLink, gitLink);
        
        return footer;
    },

    // ---------------------------------- //
    // -----   Buttons and Fields   ----- //
    // ---------------------------------- //

    createButton(type) {
        const button = document.createElement('button');
        button.id = type;
        button.innerText = type;

        button.addEventListener('click', () => {
            this.newGame(type);
        });

        return button;
    },

    generatePlayfield(size) {
        const playfield = document.querySelector('main');
        playfield.innerText = '';

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                playfield.appendChild(this.createCell(row, col));
            }
        }
    },

    createCell(row, col) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'covered');

        cell.dataset.x = col;
        cell.dataset.y = row;

        cell.style.width = `calc(100% / ${this.size} - 2px)`;
        cell.style.height = `calc(100% / ${this.size} - 2px)`;
        
        this.cellEventListeners(cell);
        
        return cell;
    },

    cellEventListeners(cell) {
        cell.addEventListener('click', (event) => {
            this.cellLeftClickHandler(event);
        });
        cell.addEventListener('contextmenu', (event) => {
            this.cellRightClickHandler(event);
        });

        cell.addEventListener('touchstart', (event) => {
            this.cellTouchStartHandler(event);
        });
        cell.addEventListener('touchend', (event) => {
            this.cellTouchEndHandler(event);
        });
    },

    // -------------------------- //
    // -----   Game Start   ----- //
    // -------------------------- //

    gameModes: [
        {
            name:  'small',
            size:  9,
            mines: 10
        },
        {
            name:  'medium',
            size:  16,
            mines: 40
        },
        {
            name:  'large',
            size:  24,
            mines: 150
        },
    ],

    newGame(gameMode) {
        for (const mode of this.gameModes) {
            if (mode.name == gameMode) {
                this.size = mode.size;
                this.mines = mode.mines;
            }
        }

        this.generatePlayfield(this.size);

        this.logic.init(this.size, this.mines);
    },

    // ------------------------------------ //
    // -----   Click/Touch Handling   ----- //
    // ------------------------------------ //

    cellLeftClickHandler(event) {
        event.preventDefault();

        const x = event.target.dataset.x;
        const y = event.target.dataset.y;

        result = this.logic.sweep(x, y);
        const mineHit = result.mineHit;
        const minesAround = result.minesAround;
        const emptyCells = result.emptyCells;
        const mines = result.mines;

        if (mineHit) {
            this.logic.gameLost(event, mines);
        } else {
            this.logic.uncoverCell(x, y, minesAround);
            for (const cell of emptyCells) {
                this.logic.uncoverCell(cell.x, cell.y, cell.minesAround);
            }
            if (this.logic.userHasWon()) {
                this.logic.gameWon();
            }
        }
    },

    cellRightClickHandler(event) {
        event.preventDefault();

        event.target.classList.toggle('symbol-f');
    },

    cellTouchStartHandler(event) {
        event.preventDefault();

        this.touchStartTime = new Date().getTime();
    },

    cellTouchEndHandler(event) {
        event.preventDefault();

        const touchDuration = new Date().getTime() - this.touchStartTime;
        if (touchDuration < 500) {
            this.cellLeftClickHandler(event);
        } else {
            this.cellRightClickHandler(event);
        }
    }

};

// -------------------------------------------------- //
// -------------------------------------------------- //
// -------------------------------------------------- //

const localLogic = {

    // ----------------------------- //
    // -----   Field Filling   ----- //
    // ----------------------------- //

    init(size, mines) {
        this.field = [];
        this.size = size;
        this.mines = mines;
        this.moves = 0;
        this.uncoveredCells = [];
        
        for (let row = 0; row < size; row++) {
            fieldRow = [];
            for (let col = 0; col < size; col++) {
                fieldRow.push(false);
            }
            this.field.push(fieldRow);
        }

        // todo funktion machen
        for (let row = 0; row < size; row++) {
            fieldRow = [];
            for (let col = 0; col < size; col++) {
                fieldRow.push(false);
            }
            this.uncoveredCells.push(fieldRow);
        }
    },

    // ------------------------------- //
    // -----   Move Processing   ----- //
    // ------------------------------- //

    sweep(x, y) {
        x = parseInt(x);
        y = parseInt(y);
        const mineHit = this.field[x][y];

        if (!mineHit) {
            var minesAround = this.countMinesAround(x, y);
        }

        if (this.moves === 0) {
            this.placeMines(x, y);
        }
        this.moves++;

        return {
            mineHit: mineHit,
            minesAround: minesAround,
            emptyCells: minesAround === 0 ? this.getEmptyCells(x, y) : [],
            mines: mineHit ? this.getMines() : []
        }
    },

    // ---------------------------- //
    // -----   Mine Placing   ----- //
    // ---------------------------- //

    placeMines(x, y) {
        for (let i = 0; i < this.mines; i++) {
            this.placeSingleMine(x, y);
        }
    },

    placeSingleMine(x, y) {
        while (true) {
            tryX = Math.floor(Math.random() * this.size);
            tryY = Math.floor(Math.random() * this.size);

            if (tryX === x && tryY === y || this.field[tryX][tryY]) {
                continue;
            }

            this.field[tryX][tryY] = true;
            return;
        }
    },

    // ------------------------------- //
    // -----   Cell Uncovering   ----- //
    // ------------------------------- //

    getCell(x, y) {
        return document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    },

    uncoverCell(x, y, symbol) {
        this.getCell(x, y).classList.remove('covered');

        if (symbol) {
            this.getCell(x, y).classList.add(`symbol-${symbol}`);
        }

        this.uncoveredCells[x][y] = true;
    },

    // case: no mine hit

    countMinesAround(x, y) {
        let minesAround = 0;

        for (let dX = -1; dX <= 1; dX++) {
            for (let dY = -1; dY <= 1; dY++) {
                if (this.accessCellSafely(x + dX, y + dY)) {
                    minesAround++;
                }
            }
        }

        return minesAround;
    },

    accessCellSafely(x, y) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
            return undefined;
        } else {
            return this.field[x][y];
        }
    },

    // case: no mine hit and no mines around

    getEmptyCells(x, y) {
        const toDo = [];
        const done = [];
        
        toDo.push({
            x: x,
            y: y,
            minesAround: 0
        });

        while (toDo.length) {
            const current = toDo.shift();
            done.push(current);
            const neighbors = this.getNeighbors(current.x, current.y);
            for (const n of neighbors) {
                if (this.isInList(done, n)) {
                    continue;
                }
                if (n.minesAround) {
                    done.push(n);
                    continue;
                }
                if (!this.isInList(toDo, n)) {
                    toDo.push(n);
                }
            }
        }
        
        return done;
    },

    getNeighbors(x, y) {
        const neighbors = [];

        for (let dX = -1; dX <= 1; dX++) {
            for (let dY = -1; dY <= 1; dY++) {
                const cell = this.accessCellSafely(x + dX, y + dY);
                if (cell === false) {
                    neighbors.push({
                        x: x + dX,
                        y: y + dY,
                        minesAround: this.countMinesAround(x + dX, y + dY)
                    });
                }
            }
        }

        return neighbors;
    },

    isInList(list, element) {
        return list.some(item => item.x === element.x && item.y === element.y);
    },

    // case: mine hit

    getMines() {
        const mines = [];

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.field[x][y]) {
                    mines.push({
                        x: x,
                        y: y
                    });
                }
            }
        }

        return mines;
    },

    // ------------------------ //
    // -----   Game End   ----- //
    // ------------------------ //

    userHasWon() {
        let count = 0;

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.uncoveredCells[x][y]) {
                    count++;
                }
            }
        }

        return count === this.size * this.size - this.mines;
    },

    gameLost(event, mines) {
        event.target.id = 'mine-hit';
        for (const m of mines) {
            this.uncoverCell(m.x, m.y, 'm');
        }
        this.displayOverlay('Game Over');
    },

    gameWon() {
        this.displayOverlay('Victory');
    },

    displayOverlay(text) {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';

        const div = document.createElement('div');
        div.innerText = text;
        overlay.appendChild(div);
        
        const main = document.querySelector('main');
        main.appendChild(overlay);
    }

};