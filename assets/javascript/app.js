var config = {
    apiKey: "AIzaSyD25C3FGEHZRGA_hMgA1y_LTFBXVuNj0Ew",
    authDomain: "train-scheduler-a6b89.firebaseapp.com",
    databaseURL: "https://train-scheduler-a6b89.firebaseio.com",
    projectId: "train-scheduler-a6b89",
    storageBucket: "",
    messagingSenderId: "507021190415"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#submit-btn").on("click", function (event) {
    event.preventDefault();

    var name = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var time = moment($("#time-input").val(),"HH:mm").format("HH:mm"); // first train time
    var frequency = parseInt($("#frequency-input").val().trim());

    database.ref().push({
        name,
        destination,
        time,
        frequency
    });

    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    var timeArr = childSnapshot.val().time.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var differenceTimes = moment().diff(trainTime, "minutes");
    var minAway = childSnapshot.val().frequency - moment().diff(trainTime, "minutes") % childSnapshot.val().frequency;
    var nextArrival = moment().add(minAway, "minutes").format("hh:mm A"); // .format("HH:mm");

    var tr = $("<tr>");
    var nameTd = $("<td>").text(childSnapshot.val().name);
    var destinationTd = $("<td>").text(childSnapshot.val().destination);
    // var timeTd = $("<td>").text(childSnapshot.val().time);
    var frequencyTd = $("<td>").text(childSnapshot.val().frequency);
    var arrivalTd = $("<td>").text(nextArrival);
    var minAwayTd = $("<td>").text(minAway);

    tr.append(nameTd, destinationTd, frequencyTd, arrivalTd, minAwayTd);
    $("tbody").append(tr);
}, function (errorObject) { // Create Error Handling
    console.log("The read failed: " + errorObject.code);
});