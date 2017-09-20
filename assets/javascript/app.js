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

  // Grabs user input
  var trainName = $("#train-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainTime = $("#time-input").val().trim();
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

  // Clears all of the text-boxes
  $("#train-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store attributes from firebase into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = parseInt(childSnapshot.val().frequency);


  // Store the current time into a variable
  var timeNow = moment().format("HH:mm");

  // convert train start time into minutes
  var timeStartMinutes = moment.duration(trainTime).asMinutes();

  // convert current time into minutes
  var timeNowMinutes = moment.duration(timeNow).asMinutes();

  // time till next train is the frequency - the modulo of the difference between now and the start time
  var timeTillNext = trainFrequency - ((timeNowMinutes - timeStartMinutes) % trainFrequency);

  // next arrival is now plus time until next
  var nextArrival = (timeNowMinutes + timeTillNext);

  // grab next arrival hours
  var nextArrivalHours = nextArrival/60;

  // grab next arrival minutes
  var nextArrivalMinutes = nextArrival%60;

  // Convert next arrival into 12 hour clock.  
  // If less than 720 minutes its AM
  // If more than 1440 (or 24 hours) its still AM but must subtract the day
  // Else its PM
  if (nextArrival < 720) {
  	var formattedNextArrival = moment(nextArrivalHours+":"+nextArrivalMinutes, 'hh:mm').format('hh:mm a');
  } else if (nextArrival > 1440) {
  	nextArrivalHours -= 24;
  	var formattedNextArrival = moment(nextArrivalHours+":"+nextArrivalMinutes, 'hh:mm').format('hh:mm a');
  } else {
  	var formattedNextArrival = moment(nextArrivalHours+":"+nextArrivalMinutes, 'hh:mm').format('hh:mm p');
  }

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + formattedNextArrival + "</td><td>" + timeTillNext);
});
