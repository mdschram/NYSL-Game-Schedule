var main = new Vue({
    el: '#main',
    data: {
        games: [],
        page: 0
    },
    created: function () {
        this.fetch();
    },
    methods: {
        fetch: function () {
            fetch('https://api.myjson.com/bins/9gjq2')
                .then(r => r.json())
                .then(json => {
                    main.games = json
                })
        }
    },
    pager: function(){
        console.log(this.page)
    }

})
