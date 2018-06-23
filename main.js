var main = new Vue({
    el: '#main',
    data: {
        gameData: [],
        pageShow: "games",
        locations: [],
        showLocation: "",
        teams: [],
        selectedData: {
            "games": []
        }
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
                this.showLocation = buttonName
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
                this.showTeam = buttonName
                for (i = 0; i < this.gameData.games.length; i++) {
                    if (this.gameData.games[i].team1 == this.showTeam || this.gameData.games[i].team2 == this.showTeam) {
                        this.selectedData.games.push(this.gameData.games[i])
                    }
                }
            } else {
                this.selectedData = this.gameData;
                this.pageShow = buttonName
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
