// Most of this was grabbed from an example of how to use the chessboard library. Will update as needed

var board,
game = new Chess(),
statusEl = $('#status'),
timeE1 = $('#time'),
movesE1 = $('#moves'),
fenEl = $('#fen'),
pgnEl = $('#pgn');

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
	  (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
	  (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
	return false;
  }
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
	from: source,
	to: target,
	promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';
  updateStatus();
  playAI(game);
};
var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);

// Updates the status at the bottom of the page
var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
	moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
	status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
	status = 'Game over, drawn position';
  }

  // game still on
  else {
	status = moveColor + ' to move';

	// check?
	if (game.in_check() === true) {
	  status += ', ' + moveColor + ' is in check';
	}
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

console.log("Current Value " + evaluateBoard(game));
updateStatus();