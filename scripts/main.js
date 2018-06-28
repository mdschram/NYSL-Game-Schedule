var main = new Vue({
    el: '#main',
    data: {
        gameData: [],
        showPage: "games",
        locations: [],
        showLocation: "",
        showTeam: "",
        teams: [],
        selectedData: {
            "games": []
        },
        visitedPages: ["games"],
        address: "",
        url: "",
        gamesButton: true,
        teamsButton: false,
        stadiumsButton: false,
    },
    created: function () {
        this.fetch();
    },
    methods: {
        fetch: function () {
            fetch('https://api.myjson.com/bins/w5c4e')
                .then(r => r.json())
                .then(json => {
                    this.gameData = json
                    this.locationArray()
                    this.teamsArray()
                    this.selectedData = this.gameData
                })
        },
        pageToggler: function (buttonName, direction) {
            console.log(this.showPage)
            console.log(this.visitedPages)
            this.gamesButton = false;
            this.teamsButton = false;
            this.stadiumsButton = false;
            if (this.locations.includes(buttonName)) {
                this.selectedData = {
                    "games": []
                };
                this.stadiumsButton = true
                this.showPage = "location";
                this.showLocation = buttonName;
                if (direction == "forward") {
                    this.visitedPages.push(this.showLocation)
                }
                for (i = 0; i < this.gameData.games.length; i++) {
                    if (this.gameData.games[i].location == this.showLocation) {
                        this.selectedData.games.push(this.gameData.games[i])
                    }
                }
                for (i = 0; i < this.gameData.locations.length; i++) {
                    if (this.gameData.locations[i].name == this.showLocation) {
                        this.address = this.gameData.locations[i].address
                    }; {
                        this.url = this.gameData.locations[i].url
                    }
                }
                console.log(this.address)
            } else
            if (this.teams.includes(buttonName)) {
                this.selectedData = {
                    "games": []
                }
                this.teamsButton = true
                this.showPage = "team";
                this.showTeam = buttonName;
                if (direction == 'forward') {
                    this.visitedPages.push(this.showTeam)
                }
                for (i = 0; i < this.gameData.games.length; i++) {
                    if (this.gameData.games[i].team1 == this.showTeam || this.gameData.games[i].team2 == this.showTeam) {
                        this.selectedData.games.push(this.gameData.games[i])
                    }
                };
            } else if (buttonName == "back") {
                if (this.visitedPages.length > 1) {
                    this.visitedPages.pop();
                    buttonName = this.visitedPages[this.visitedPages.length - 1]
                    this.pageToggler(buttonName, 'backward')
                }
            } else {
                this.selectedData = this.gameData;
                this.showPage = buttonName;
                if (direction == 'forward') {
                    this.visitedPages.push(buttonName)
                }
                if (this.showPage == "locations") {
                    this.stadiumsButton = true
                }
                if (this.showPage == "games") {
                    this.gamesButton = true
                }
                if (this.showPage == "teams") {
                    this.teamsButton = true
                }
            }
        },
        locationArray: function () {
            for (i = 0; i < this.gameData.games.length; i++) {
                if (!this.locations.includes(this.gameData.games[i].location)) {
                    this.locations.push(this.gameData.games[i].location)
                }
            }
        },
        teamsArray: function () {
            for (i = 0; i < this.gameData.games.length; i++) {
                if (!this.teams.includes(this.gameData.games[i].team1)) {
                    this.teams.push(this.gameData.games[i].team1)
                }
                if (!this.teams.includes(this.gameData.games[i].team2)) {
                    this.teams.push(this.gameData.games[i].team2)
                }
            }
            this.teams.sort();
        }
    }
})
