window.addEventListener('load', () => {
    minesweeper.init();
});

const minesweeper = {
    
    init() {
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
        
        return cell;
    },

    // -------------------------- //
    // -----   Game Logic   ----- //
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
    },

    cellLeftClickHandler(event) {
        event.preventDefault();
        const x = event.target.dataset.x;
        const y = event.target.dataset.y;
        alert('x: ' + x + ', y: ' + y);
    },

    cellRightClickHandler(event) {
        event.preventDefault();
        const x = event.target.dataset.x;
        const y = event.target.dataset.y;
        alert('right click x: ' + x + ', y: ' + y);
    },

    cellTouchStartHandler(event) {
        //event.preventDefault();
        this.testvar = new Date.getTime();
        this.touchStartTime = new Date.getTime();
        alert(this.touchStartTime);
        alert(touchStartTime);
        alert(new Date.getTime());
        alert(this.testvar);
    },

    cellTouchEndHandler(event) {
        event.preventDefault();
        const abc = new Date.getTime() - this.start;
        alert(abc);
    },

};