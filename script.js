

class Player {
    constructor(name) {
        this.name = name;
        this.currentRoom = null;
        this.cards = [];
    }

    moveTo(room) {
        console.log(`${this.name} se déplace vers ${room}`);
    }

    makeSuggestion(suspect, weapon, room) {
        console.log(`${this.name} suggère que ${suspect} a commis le crime avec ${weapon} dans ${room}`);
    }

    makeAccusation(suspect, weapon, room) {
        console.log(`${this.name} accuse ${suspect} de commettre le crime avec ${weapon} dans ${room}`);
    }
}

const game = {
    players: [
        new Player("Miss Scarlet"),
        new Player("Colonel Mustard"),
        new Player("Mrs. White"),
        new Player("Mr. Green"),
        new Player("Mrs. Peacock"),
        new Player("Professor Plum")
    ],
    suspectCards: ["Miss Scarlet", "Colonel Mustard", "Mrs. White", "Mr. Green", "Mrs. Peacock", "Professor Plum"],
    weaponCards: ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Wrench"],
    roomCards: ["Kitchen", "Ballroom", "Conservatory", "Dining Room", "Library", "Lounge", "Hall", "Study", "Billiard Room"],
    envelope: {
        suspect: null,
        weapon: null,
        room: null
    },

    shuffleCards(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    },

    distributeCards() {
        this.shuffleCards(this.suspectCards);
        this.shuffleCards(this.weaponCards);
        this.shuffleCards(this.roomCards);

        this.envelope.suspect = this.suspectCards.pop();
        this.envelope.weapon = this.weaponCards.pop();
        this.envelope.room = this.roomCards.pop();

        const allCards = [...this.suspectCards, ...this.weaponCards, ...this.roomCards];
        this.shuffleCards(allCards);

        let playerIndex = 0;
        allCards.forEach(card => {
            this.players[playerIndex].cards.push(card);
            playerIndex = (playerIndex + 1) % this.players.length;
        });

        console.log('Les cartes ont été distribuées.');
        // game.players.forEach(player => {
        //     console.log(`${player.name} a les cartes: ${player.cards.join(', ')}`);
        // });
    }
};



// Redirection des console.log vers un élément div
const originalConsoleLog = console.log;
console.log = function(message) {
    const output = document.getElementById('log-output');
    output.innerHTML += '> ' + message + '<br>';
    output.scrollTop = output.scrollHeight;
};


function runUserCode() {
    const userCode = document.getElementById('js-input').value;
    // Valide que le code contient uniquement des appels à console.log
    if (isValidCode(userCode)) {
        try {
            originalConsoleLog(`> ${userCode}`);
            new Function(userCode)();
        } catch (e) {
            console.error('Erreur dans le code utilisateur:', e);
        }
    } else {
        console.error("Seuls les appels à console.log() sont autorisés.");
    }
}

function isValidCode(code) {
    // Nettoie le code pour éviter les fausses alertes dans les chaînes ou commentaires
    const strippedCode = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '').replace(/(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\s\w\'\;]*\n)/g, '');
    // Vérifie que le code ne contient que des console.log et des espaces blancs
    return /^(\s*console\.log\([^\)]*\);\s*)+$/i.test(strippedCode);
}

// Initialise et distribue les cartes au chargement du script
game.distributeCards();
