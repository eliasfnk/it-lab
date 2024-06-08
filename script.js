window.addEventListener('load', () => {
    minesweeper.init();
});

const minesweeper = {

    init() {
        this.logic = remoteLogic;
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

    async newGame(gameMode) {
        for (const mode of this.gameModes) {
            if (mode.name == gameMode) {
                this.size = mode.size;
                this.mines = mode.mines;
            }
        }

        this.generatePlayfield(this.size);

        await this.logic.init(this.size, this.mines);
    },

    // ------------------------------------ //
    // -----   Click/Touch Handling   ----- //
    // ------------------------------------ //

    async cellLeftClickHandler(event) {
        event.preventDefault();

        const x = event.target.dataset.x;
        const y = event.target.dataset.y;

        const result = await this.logic.sweep(x, y);

        if (result.minehit) {
            this.logic.gameLost(event, result.mines);
        } else {
            this.logic.uncoverCell(x, y, result.minesAround);
            for (const cell of result.emptyCells) {
                this.logic.uncoverCell(cell.x, cell.y, cell.minesAround);
            }
            if (result.userwins) {
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





const remoteLogic = {

    // ----------------------------- //
    // -----   Field Filling   ----- //
    // ----------------------------- //

    async init(size, mines) {
        this.serverUrl = 'https://www2.hs-esslingen.de/~melcher/it/minesweeper/?';
        const request = `request=init&size=${size}&mines=${mines}&userid=elfiit00`;
        const response = await this.fetchAndDecode(request);
        this.token = response.token;
    },

    async fetchAndDecode(request) {
        return fetch(this.serverUrl + request).then(response => response.json());
    },

    // ------------------------------- //
    // -----   Move Processing   ----- //
    // ------------------------------- //

    async sweep(x, y) {
        const request = `request=sweep&token=${this.token}&x=${x}&y=${y}`;
        return this.fetchAndDecode(request);
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
    },

    // ------------------------ //
    // -----   Game End   ----- //
    // ------------------------ //

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