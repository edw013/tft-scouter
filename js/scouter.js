'use strict'

const totalPlayers = 7

class Player {
    constructor(name, id) {
        this.name = name
        this.id = id
        this.dead = false
        this.ghostID = -1
    }

}

class Scouter {
    constructor() {
        this.available = new Set()
        this.unavailable = new Set()
        this.players = new Map()
        this.idCounter = 0
        this.aliveCounter = 0
    }

    reset() {
        this.idCounter = 0
        this.available.clear()
        this.unavailable.clear()
        this.players.clear()
        this.aliveCounter = 0
    }

    addPlayer(name) {
        if (this.players.size < 7 || name == "Ghost") {
            let id = this.idCounter
            this.players.set(id, new Player(name, this.idCounter))
            this.available.add(id)
            this.idCounter++
            this.aliveCounter++

            return id
        }

        return -1
    }

    removePlayer(id) {
        this.players.delete(id)
        this.available.delete(id)
        this.unavailable.delete(id)
    }

    addPlayed(id) {
        this.available.delete(id)
        this.unavailable.add(id)

        let dead = totalPlayers - this.aliveCounter
        if (dead == 0) {
            this.makeAvailableUntil(4)
        }
        if (dead == 1) {
            this.makeAvailableUntil(3)
        }
        if (dead == 2 || dead == 3) {
            this.makeAvailableUntil(2)
        }
        if (dead == 4 || dead == 5) {
            this.makeAvailableUntil(2)
        }
    }

    removePlayed(id) {
        this.unavailable.delete(id)
        this.available.add(id)
    }

    makeAvailable() {
        // move 1 back
        for (let pID of this.unavailable.entries()) {
            this.unavailable.delete(pID[0])
            this.available.add(pID[0])
            return
        }
    }

    makeAvailableUntil(remaining) {
        while (this.unavailable.size > remaining) {
            this.makeAvailable()
        }
    }

    killPlayer(id) {
        if (this.players.get(id).dead == true) {
            return
        }

        this.unavailable.delete(id)
        this.available.delete(id)
        this.players.get(id).dead = true
        this.aliveCounter--
        
        let dead = totalPlayers - this.aliveCounter

        if (dead == 1) {
            this.makeAvailableUntil(3)
        }
        if (dead == 2 || dead == 3) {
            this.makeAvailableUntil(2)
        }
        if (dead == 4) {
            this.makeAvailableUntil(1)
        }
        if (dead == 5) {
            this.makeAvailableUntil(0)
        }

        if (dead == 1 || dead == 5) {
            let id = this.addPlayer("Ghost")
            this.aliveCounter--
            this.ghostID = id
        }
        if (dead == 4 || dead == 6) {
            this.removePlayer(this.ghostID)
        }

        this.generateAvailableList()
        this.generateUnavailableList()
    }

    generatePlayerCard(id) {
        let wrapper = document.getElementById("players")
        let player = this.players.get(id)
        let card = document.createElement("li")
        card.setAttribute("class", "playerCard")
        card.setAttribute("data-id", player.id)
        card.setAttribute("data-dead", player.dead)
        card.innerHTML = `${player.name}`
        card.addEventListener("click", () => {
            this.killPlayer(id)
            card.setAttribute("data-dead", true)

        })
        wrapper.appendChild(card)
    }

    generateAvailableList() {
        let wrapper = document.getElementById("available")
        wrapper.innerHTML = ""
        for (let pID of this.available.entries()) {
            let player = this.players.get(pID[0])
            let card = document.createElement("li")
            card.setAttribute("class", "playerCard")
            card.innerHTML = `${player.name}`
            card.addEventListener("click", () => {
                this.addPlayed(pID[0])
                this.generateAvailableList()
                this.generateUnavailableList()
            })
            wrapper.appendChild(card)
        }
    }

    generateUnavailableList() {
        let wrapper = document.getElementById("unavailable")
        wrapper.innerHTML = ""
        let unavailable = this.unavailable.entries()
        for (let pID of unavailable) {
            let player = this.players.get(pID[0])
            let card = document.createElement("li")
            card.setAttribute("class", "playerCard")
            card.innerHTML = `${player.name}`
            wrapper.appendChild(card)
        }
    }
}