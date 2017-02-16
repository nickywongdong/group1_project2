var gameModel;
var didPressScan;

/* On page ready.. */
$( document ).ready(function() {
  // Handler for .ready() called.
  $.getJSON("model", function( json ) {
    gameModel = json;
    console.log( "JSON Data: " + json );
  });

  // Create gameBoards
  createGameBoards();
});

/* Places Ship based on buttons that no longer exist */
function placeShip() {
  console.log($( "#shipSelec" ).val());
  console.log($( "#rowSelec" ).val());
  console.log($( "#colSelec" ).val());
  console.log($( "#orientationSelec" ).val());

  //var menuId = $( "ul.nav" ).first().attr( "id" );
  var request = $.ajax({
    url: "/placeShip/"+$( "#shipSelec" ).val()+"/"+$( "#rowSelec" ).val()+"/"+$( "#colSelec" ).val()+"/"+$( "#orientationSelec" ).val(),
    method: "post",
    data: JSON.stringify(gameModel),
    contentType: "application/json; charset=utf-8",
    dataType: "json"
  });

  request.done(function( currModel ) {
    displayGameState(currModel);
    gameModel = currModel;

  });

  request.fail(function( jqXHR, textStatus ) {
    alert( "Request failed: " + textStatus );
  });
}

/* Fires at coordinates x, y */
function fire(x, y){
  console.log(x);
  console.log(y);
  //var menuId = $( "ul.nav" ).first().attr( "id" );
  var request = $.ajax({
    url: "/fire/"+x+"/"+y,
    method: "post",
    data: JSON.stringify(gameModel),
    contentType: "application/json; charset=utf-8",
    dataType: "json"
  });

  request.done(function( currModel ) {
    displayGameState(currModel);
    gameModel = currModel;

  });

  request.fail(function( jqXHR, textStatus ) {
    alert( "Request failed: " + textStatus );
  });

}

/* Scans around coordinates x, y */
function scan(x, y){
  console.log(x);
  console.log(y);
  //var menuId = $( "ul.nav" ).first().attr( "id" );
  var request = $.ajax({
    url: "/scan/"+x+"/"+y,
    method: "post",
    data: JSON.stringify(gameModel),
    contentType: "application/json; charset=utf-8",
    dataType: "json"
  });

  request.done(function( currModel ) {
    displayGameState(currModel);
    gameModel = currModel;

  });

  request.fail(function( jqXHR, textStatus ) {
    alert( "Request failed: " + textStatus );
  });

}

/* Logs to console */
function log(logContents){
  console.log(logContents);
}

/* Updates view */
function displayGameState(gameModel){

  $( '#MyBoard td'  ).css("background-color", "#25383C");
  $( '#TheirBoard td'  ).css("background-color", "#25383C");

  if(didPressScan) {
    if(gameModel.scanResult){
      alert("Scan found at least one Ship");
    } else {
      alert("Scan found no Ships");
    }
  }

  displayShip(gameModel.aircraftCarrier);
  displayShip(gameModel.battleship);
  displayShip(gameModel.cruiser);
  displayShip(gameModel.destroyer);
  displayShip(gameModel.submarine);

  for (var i = 0; i < gameModel.computerMisses.length; i++) {
    $( '#TheirBoard #' + gameModel.computerMisses[i].Across + '_' + gameModel.computerMisses[i].Down ).css("background-color", "green");
  }
  for (var i = 0; i < gameModel.computerHits.length; i++) {
    $( '#TheirBoard #' + gameModel.computerHits[i].Across + '_' + gameModel.computerHits[i].Down ).css("background-color", "red");
  }

  for (var i = 0; i < gameModel.playerMisses.length; i++) {
    $( '#MyBoard #' + gameModel.playerMisses[i].Across + '_' + gameModel.playerMisses[i].Down ).css("background-color", "green");
  }
  for (var i = 0; i < gameModel.playerHits.length; i++) {
    $( '#MyBoard #' + gameModel.playerHits[i].Across + '_' + gameModel.playerHits[i].Down ).css("background-color", "red");
  }

  displayShip(gameModel.aircraftCarrier);
  displayShip(gameModel.battleship);
  displayShip(gameModel.cruiser);
  displayShip(gameModel.destroyer);
  displayShip(gameModel.submarine);
}

/* Displays ship on MyBoard */
function displayShip(ship){
  startCoordAcross = ship.start.Across;
  startCoordDown = ship.start.Down;
  endCoordAcross = ship.end.Across;
  endCoordDown = ship.end.Down;
  // console.log(startCoordAcross);
  if(startCoordAcross > 0){
    if(startCoordAcross == endCoordAcross){
      for (i = startCoordDown; i <= endCoordDown; i++) {
        $( '#MyBoard #'+startCoordAcross+'_'+i  ).css("background-color", "#25383c");
      }
    } else {
      for (i = startCoordAcross; i <= endCoordAcross; i++) {
        $( '#MyBoard #'+i+'_'+startCoordDown  ).css("background-color", "#25383c");
      }
    }
  }
}

/* Creates grid of 10 squares for MyBoard and TheirBoard */
function createGameBoards() {
  // Create table
  var table = $("<table>").appendTo('.gameBoard');

  // Create squares
  for (var y = 1; y <= 10; y++){
    var tableRow = $("<tr id='Row" + y + "'>").appendTo(table);
    for (var x = 1; x <= 10; x++){
        tableRow.append("<td id='" + y + "_" + x + "'></td>");
    }
    table.append("</tr>");
  }
  $("</table>").appendTo('.gameBoard');

  // Make grid touchable
  $('#TheirBoard').on("click", "td", function() {

    // Parse coords
    var coords = $(this).attr('id').split("_");

    // Display Coords in footer
    $('footer #status').text("Fired at " + coords[0] + ", " + coords[1]);

    // Fire or scan Coord
    if(didPressScan){
      scan(coords[0], coords[1]);
    } else {
      fire(coords[0], coords[1]);
    }
  });
}

/* Is called when the user presses 'scan' button */
function pressedScan(){
  didPressScan = true;
}

/* Is called when the user presses 'fire' button */
function pressedFire(){
  didPressScan = false;
}
