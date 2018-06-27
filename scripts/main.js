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
        visitedPages: ["games"],
        adress: "",
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
            fetch('https://api.myjson.com/bins/9m23q')
                .then(r => r.json())
                .then(json => {
                    this.gameData = json
                    this.locationArray()
                    this.teamsArray()
                    this.selectedData = this.gameData
                })
        },
        pageToggler: function (buttonName) {
            this.gamesButton = false;
                this.teamsButton= false;
                this.stadiumsButton= false;
                if (this.locations.includes(buttonName)) {
                    this.selectedData = {
                        "games": []
                    };
                    this.stadiumsButton= true
                    this.pageShow = "location";
                    this.showLocation = buttonName;
                    this.visitedPages.unshift(this.showLocation)
                    for (i = 0; i < this.gameData.games.length; i++) {
                        if (this.gameData.games[i].location == this.showLocation) {
                            this.selectedData.games.push(this.gameData.games[i])
                        }
                    }
                    for (i = 0; i < this.gameData.locations.length; i++) {
                        if (this.gameData.locations[i].name == this.showLocation) {
                            this.adress = this.gameData.locations[i].adress
                        }; {
                            this.url = this.gameData.locations[i].url
                        }
                    }
                } else
            if (this.teams.includes(buttonName)) {
                this.selectedData = {
                    "games": []
                }
                this.teamsButton= true
                this.pageShow = "team";
                this.showTeam = buttonName;
                this.visitedPages.unshift(this.showTeam);
                for (i = 0; i < this.gameData.games.length; i++) {
                    if (this.gameData.games[i].team1 == this.showTeam || this.gameData.games[i].team2 == this.showTeam) {
                        this.selectedData.games.push(this.gameData.games[i])
                    }
                };
            } else if (buttonName == "back") {

                if (this.visitedPages.length > 1) {
                    this.visitedPages.shift();
                }
                if (this.locations.includes(this.visitedPages[0])) {
                    this.selectedData = {
                        "games": []
                    };
                    this.pageShow = "location";
                    this.stadiumsButton = true;
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
                    this.teamsButton = true;
                    this.showTeam = this.visitedPages[0];
                    for (i = 0; i < this.gameData.games.length; i++) {
                        if (this.gameData.games[i].team1 == this.showTeam || this.gameData.games[i].team2 == this.showTeam) {
                            this.selectedData.games.push(this.gameData.games[i])
                        }
                    }
                } else {
                    this.pageShow = this.visitedPages[0];
                    this.selectedData = this.gameData
                    if (this.pageShow == "locations") {this.stadiumsButton = true}
                if (this.pageShow == "games"){this.gamesButton = true}
                if (this.pageShow == "teams"){this.teamsButton = true}
                    
                }
            } else {
                this.selectedData = this.gameData;
                this.pageShow = buttonName;
                this.visitedPages.unshift(this.pageShow)
                if (this.pageShow == "locations") {this.stadiumsButton = true}
                if (this.pageShow == "games"){this.gamesButton = true}
                if (this.pageShow == "teams"){this.teamsButton = true}
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
