// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAsMLBqkhXZzUuVg-BuQfKF5Fj4YRyvhZ4",
    authDomain: "dumbtrains.firebaseapp.com",
    databaseURL: "https://dumbtrains.firebaseio.com",
    projectId: "dumbtrains",
    storageBucket: "",
    messagingSenderId: "792863783585"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// event handler for add trains button
$("#add-train").on("click", function(event) {
  event.preventDefault();
  alert('click')

  // Grabs user input
  var trainName = $("#train-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainTime = moment($("#time-input").val().trim(), "DD/MM/YY").format("X");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.role);
  console.log(newTrain.start);
  console.log(newTrain.rate);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Prettify the employee start
  var trainStartPretty = moment.unix(trainTime).format("HH:mm");
  console.log(trainStartPretty);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + trainStartPretty + "</td><td>" + trainTime);
});
