var main = new Vue({
    el: '#main',
    data: {
        gameData: [],
        pageShow: "games",
        locations: [],
        showLocation: "",
        showTeam: "",
        teams: [],
        selectedData: {
            "games": []
        },
        visitedPages: ["games"]

    },
    created: function () {
        this.fetch();
    },
    methods: {
        fetch: function () {
            fetch('https://api.myjson.com/bins/pu872')
                .then(r => r.json())
                .then(json => {
                    this.gameData = json
                    this.locationArray()
                    this.teamsArray()
                    this.selectedData = this.gameData
                })
        },
        pageToggler: function (buttonName) {
            if (this.locations.includes(buttonName)) {
                this.selectedData = {
                    "games": []
                };
                this.pageShow = "location";
                this.showLocation = buttonName;
                this.visitedPages.unshift(this.showLocation)
                for (i = 0; i < this.gameData.games.length; i++) {
                    if (this.gameData.games[i].location == this.showLocation) {
                        this.selectedData.games.push(this.gameData.games[i])
                    }
                }
            } else if (this.teams.includes(buttonName)) {
                this.selectedData = {
                    "games": []
                }
                this.pageShow = "team";
                this.showTeam = buttonName;
                this.visitedPages.unshift(this.showTeam);
                for (i = 0; i < this.gameData.games.length; i++) {
                    if (this.gameData.games[i].team1 == this.showTeam || this.gameData.games[i].team2 == this.showTeam) {
                        this.selectedData.games.push(this.gameData.games[i])
                    }
                };
            } else if (buttonName == "back") {
                this.visitedPages.shift();
                if (this.locations.includes(this.visitedPages[0])) {
                    this.selectedData = {
                        "games": []
                    };
                    this.pageShow = "location";
                    this.showLocation = this.visitedPages[0];
                    for (i = 0; i < this.gameData.games.length; i++) {
                        if (this.gameData.games[i].location == this.showLocation) {
                            this.selectedData.games.push(this.gameData.games[i])
                        }
                    }
                } else if (this.teams.includes(this.visitedPages[0])) {
                    this.selectedData = {
                        "games": []
                    };
                    this.pageShow = "team";
                    this.showTeam = this.visitedPages[0];
                    for (i = 0; i < this.gameData.games.length; i++) {
                        if (this.gameData.games[i].team1 == this.showTeam || this.gameData.games[i].team2 == this.showTeam) {
                            this.selectedData.games.push(this.gameData.games[i])
                        }
                    }
                } else {
                    this.pageShow = this.visitedPages[0]
                }
            } else {
                this.selectedData = this.gameData;
                this.pageShow = buttonName;
                this.visitedPages.unshift(this.pageShow)
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
