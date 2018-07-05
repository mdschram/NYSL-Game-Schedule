var main = new Vue({
    el: '#main',
    data: {
        gameData: [],
        showPage: "games",
        locations: [],
        showLocation: "",
        showTeam: "general",
        teams: [],
        selectedData: {
            "games": []
        },
        visitedPages: ["games", "general"],
        address: "",
        url: "",
        gamesButton: true,
        teamsButton: false,
        stadiumsButton: false,
        accessStatus: "Log in",
        messages: {},
        currentTeamChat: [],
        userName: "",
        posts: [],
    },
    created: function () {
        this.fetch();
//        this.messages = {}

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
            console.log(this.visitedPages)
        
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
                    this.visitedPages.push(this.showLocation, this.showTeam)
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
                    this.visitedPages.push(this.showPage, this.showTeam)
                }
                for (i = 0; i < this.gameData.games.length; i++) {
                    if (this.gameData.games[i].team1 == this.showTeam || this.gameData.games[i].team2 == this.showTeam) {
                        this.selectedData.games.push(this.gameData.games[i])
                    }
                };
            } else if (buttonName == "back") {
                if (this.visitedPages.length > 2) {
                    this.visitedPages.pop();
                    this.visitedPages.pop();
                    buttonName = this.visitedPages[this.visitedPages.length - 2]
                    this.showTeam = this.visitedPages[this.visitedPages.length - 1]
                    
                    
                    this.pageToggler(buttonName, 'backward')
                }
            } else {
                this.selectedData = this.gameData;
                if (buttonName !== 'Log out' || buttonName !== "general"){
                this.showPage = buttonName;}
                if (direction == 'forward') {
                    this.visitedPages.push(buttonName,this.showTeam)

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

                if (this.showPage == "chatroom") {
                    this.getPosts(this.showTeam)
                }
                if (buttonName == "Log out") {
                    this.logout()
                    
                }
            }
                    console.log("team",this.showTeam)
            console.log("page",this.showPage)
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
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: document.getElementById("name").value
                })
                main.accessStatus = "Log out"
                main.pageToggler('chatroom', 'forward')
                main.userName = firebase.auth().currentUser.displayName;;
            }).catch(function (error) {
                console.log(error);
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
            })
        },
        login: function () {
            var email = document.getElementById("email").value
            var password = document.getElementById("password").value
            firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
                    console.log(firebase.Promise)
                    main.accessStatus = "Log out"
                    main.pageToggler('chatroom', 'forward')
                main.showTeam = "general"
                    main.userName = firebase.auth().currentUser.displayName;
                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert(errorMessage)
                })

        },
        loginGoogle: function () {

            // https://firebase.google.com/docs/auth/web/google-signin

            // Provider
            var provider = new firebase.auth.GoogleAuthProvider();

            // How to Log In
            firebase.auth().signInWithPopup(provider).then(function () {
                main.userName = firebase.auth().currentUser.displayName;
                main.pageToggler('chatroom', 'forward')
                main.showTeam = "general"
            })
            this.accessStatus = "Log out"

        },
        logout: function () {
            firebase.auth().signOut().then(function () {

            main.accessStatus = "Log in";
            main.showTeam = "general"

                
            }).catch(function (error) {
                // An error happened.
            })
            
        },
        writeNewPost: function (team) {
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
            var newPostKey = firebase.database().ref().child('NYSLchatroom/' + team).push().key;

            //Write data
            var updates = {};
            updates['NYSLchatroom/' + team + '/' + newPostKey] = post;
            document.getElementById("textInput").value = ""
            return firebase.database().ref().update(updates);
        },
        getPosts: function (team) {
            firebase.database().ref('NYSLchatroom/'+team).on('value', function (data) {
                const posts= data.val();
                let array = []
                for (let key in posts) {

                    var det = main.determineUser(posts[key].name);
                    var diver = document.createElement('div');
                    var div = document.createElement('div');
                    var name = document.createElement('div');
                    var text = document.createElement('div');
                    
                    div.append(name)
                    div.append(text)
                    diver.append(div)
                    document.getElementById('posts').append(diver);
                    name.classList.add('name')
                    text.classList.add('userText')
                    div.classList.add('textandname')
                    diver.classList.add(det)
                    diver.classList.add("message")
                    name.innerHTML = posts[key].name;
                    text.innerHTML = posts[key].body;
                    var chatbox = document.getElementById("posts");
            chatbox.scrollTop = chatbox.scrollHeight;
                }
 
            })
        },
        determineUser: function (messageName) {
            if (this.userName == messageName) {
                return "rightmessage"
            } else {
                return "leftmessage"
            }
        },
        scrollDown: function () {
            var posts = document.getElementById("posts");
            posts.scrollTop = posts.scrollHeight;
        },
    },
    mounted() {
        this.scrollDown()
    },
    updated() {
        this.scrollDown()
    }

})
