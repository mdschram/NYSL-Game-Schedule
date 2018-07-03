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
        accessStatus: "Log in",
        messages: {}
    },
    created: function () {
        this.fetch();

    },
    methods: {
        fetch: function () {
            fetch('https://api.myjson.com/bins/m10dq')
                .then(r => r.json())
                .then(json => {
                    this.gameData = json
                    this.locationArray()
                    this.teamsArray()
                    this.selectedData = this.gameData

                })
        },
        pageToggler: function (buttonName, direction) {
            if (this.showPage == 'chatroom') {
                posts.innerHTML = ""
            };
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

                if (this.showPage == "Log out") {
                    this.logout()
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
        },
        createNewUser: function () {
            this.showPage = "Create Account";
            var email = document.getElementById("email").value
            var password = document.getElementById("password").value
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                })
                .then(function (user) {
                    var user = firebase.auth().currentUser;
                    user.updateProfile({
                        displayName: document.getElementById("name").value
                    });
                }).catch(function (error) {
                    console.log(error);
                })
            this.getPosts()
        },
        login: function () {
            var email = document.getElementById("email").value
            var password = document.getElementById("password").value
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        alert('Wrong password.');
                    } else {
                        alert(errorMessage);
                    }
                    console.log(error);
                })
                .then(function () {
                    console.log(firebase.Promise)
                    main.accessStatus = "Log out"
                    main.showPage = 'chatroom';
                    main.getPosts()
                })

        },
        loginGoogle: function () {

            // https://firebase.google.com/docs/auth/web/google-signin

            // Provider
            var provider = new firebase.auth.GoogleAuthProvider();

            // How to Log In
            firebase.auth().signInWithPopup(provider)
            //            this.accessStatus = "Log out"
            this.showPage = 'chatroom'
            this.accessStatus = "Log out"

            this.getPosts()
        },
        logout: function () {
            firebase.auth().signOut().then(function () {
                // Sign-out successful.
            }).catch(function (error) {
                // An error happened.
            })
            this.showPage = "Log in"
            this.accessStatus = "Log in"
        },
        writeNewPost: function () {

            // https://firebase.google.com/docs/database/web/read-and-write

            // Values
            var text = document.getElementById("textInput").value;
            var userName = firebase.auth().currentUser.displayName;


            // A post entry

            var post = {
                name: userName,
                body: text
            };

            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('NYSLchatroom').push().key;

            //Write data
            var updates = {};
            updates[newPostKey] = post;
            document.getElementById("textInput").value = ""
            return firebase.database().ref('NYSLchatroom').update(updates);
        },
        getPosts: function () {
            firebase.database().ref('NYSLchatroom').on('value', function (data) {
                main.messages = data.val();

            })
            console.log("getting posts");
            var posts = document.getElementById("posts");
            posts.scrollTop = posts.scrollHeight;
        },
        determineUser: function (messageName) {
            var userName = firebase.auth().currentUser.displayName;
            if (userName == messageName) {
                return "rightmessage"
            } else {
                return "leftmessage"
            }

        }
    }
})
