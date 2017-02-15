var gameModel;

$( document ).ready(function() {
  // Handler for .ready() called.
  $.getJSON("model", function( json ) {
    gameModel = json;
    console.log( "JSON Data: " + json );
  });

  // Create gameBoards
  createGameBoards();
});

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

function fire(){
  console.log($( "#colFire" ).val());
  console.log($( "#rowFire" ).val());
  //var menuId = $( "ul.nav" ).first().attr( "id" );
  var request = $.ajax({
    url: "/fire/"+$( "#colFire" ).val()+"/"+$( "#rowFire" ).val(),
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

function scan(){
  console.log($( "#colScan" ).val());
  console.log($( "#rowScan" ).val());
  //var menuId = $( "ul.nav" ).first().attr( "id" );
  var request = $.ajax({
    url: "/scan/"+$( "#colScan" ).val()+"/"+$( "#rowScan" ).val(),
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


function log(logContents){
  console.log(logContents);
}

function displayGameState(gameModel){

  $( '#MyBoard td'  ).css("background-color", "#84ccd6");
  $( '#TheirBoard td'  ).css("background-color", "#84ccd6");

  if(gameModel.scanResult){
    alert("Scan found at least one Ship");
  } else {
    alert("Scan found no Ships");
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

function createGameBoards() {
  // Create table
  var table = $("<table>").appendTo('.gameBoard');

  // Create squares
  for (var y = 1; y <= 10; y++){
    var tableRow = $("<tr id='Row" + y + "'>").appendTo(table);
    for (var x = 1; x <= 10; x++){
        tableRow.append("<td id='" + y + "_" + x + "'>");
    }
    table.append("</tr>");
  }
  $("</table>").appendTo('.gameBoard');
}
