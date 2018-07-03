function start() {
    console.log(1);

    var fetchConfig =
        fetch("https://www.strava.com/api/v3/activities/1226961013/?access_token=d553a093fcbbbdc439986a9b45b6505c966ba1c5", {
            method: "GET",

//            headers: new Headers({
//                'Access-Control-Allow-Credentials': true,
//                'Access-Control-Allow-Origin': 'localhost',
//                'Access-Control-Allow-Methods': 'GET',
//                'Access-Control-Allow-Headers': 'application/json',
//            })

        })
        .then(onDataFetched)
        .catch(onDataFetchFailed);

    console.log(3);
}

function onDataFetched(response) {
    response.json()
        .then(onConversionToJsonSuccessful)
        .catch(onConversionToJsonFailed);
    console.log(2);
}

function onDataFetchFailed(error) {
    console.log("I have failed in life.", error);
}

function onConversionToJsonSuccessful(json) {
    console.log("success!!!!", json);
    serverData = json;
    console.log(serverData)
}

function onConversionToJsonFailed() {
    console.log("Not a json mate!");
}


start()

////https://www.strava.com/api/v3/activities/1226961013/?access_token=d553a093fcbbbdc439986a9b45b6505c966ba1c5
