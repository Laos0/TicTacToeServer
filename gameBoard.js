
// our game board in which we will continue to update as user select the tiles
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

let winningTiles = [];

let winner = '';
let isGameOver = false;
let isSuccessfulSelect = true;
let isTie = false;
let isBoardFilled = false;

// we pass in the user's role the selected row and column
function insertIntoBoard(userRole, row, col){
    //console.log("INSERT " + userRole)

    // can only play the game when the game is not over
    if(!isGameOver){

        if(gameBoard[row][col] == ''){
            gameBoard[row][col] = userRole;
            successfulSelection();
    
            checkWinner(userRole);
            if(isGameOver && isBoardFilled){
                // if the game is over and the board is filled
                setWinner('TIE');
            }else{
                setWinner(userRole)
            }
    
        }else{
            failSelection();
        }
    }

    
}

function checkWinner(userRole) {

    if(gameBoard[0][0] == userRole && gameBoard[0][1] == userRole && gameBoard[0][2] == userRole)
    {
        setWinner(userRole);
        setWinningTiles(0,0,0,1,0,2);
        gameOver();
    }else if(gameBoard[1][0] == userRole && gameBoard[1][1] == userRole && gameBoard[1][2] == userRole){
        setWinner(userRole);
        setWinningTiles(1,0,1,1,1,2);
        isGameOver = true;
    }else if(gameBoard[2][0] == userRole && gameBoard[2][1] == userRole && gameBoard[2][2] == userRole){
        setWinner(userRole);
        setWinningTiles(2,0,2,1,2,2);
        isGameOver = true;
    }else if(gameBoard[0][0] == userRole && gameBoard[1][0] == userRole && gameBoard[2][0] == userRole){
        setWinner(userRole);
        setWinningTiles(0,0,1,0,2,0);
        isGameOver = true;
    }else if(gameBoard[0][1] == userRole && gameBoard[1][1] == userRole && gameBoard[2][1] == userRole){
        setWinner(userRole);
        setWinningTiles(0,1,1,1,2,1);
        isGameOver = true;
    }else if(gameBoard[0][2] == userRole && gameBoard[1][2] == userRole && gameBoard[2][2] == userRole){
        setWinner(userRole);
        setWinningTiles(0,2,1,2,2,2);
        isGameOver = true;
    }else if(gameBoard[0][0] == userRole && gameBoard[1][1] == userRole && gameBoard[2][2] == userRole){
        setWinner(userRole);
        setWinningTiles(0,0,1,1,2,2);
        isGameOver = true;
    }else if(gameBoard[0][2] == userRole && gameBoard[1][1] == userRole && gameBoard[2][0] == userRole){
        setWinner(userRole);
        setWinningTiles(0,2,1,1,2,0);
        isGameOver = true;
    }else{
        
        // checking if all the elements in the gameBoard is not equal to '' 
        // if no elements equals to '' then the board is filled
        setIsBoardFilled(gameBoard.every(function(subArray) {
            return subArray.every(function(element) {
                return element !== '';
            });
        }));

        

        // checking if the board is filled
        if(isBoardFilled){
            // if the board is filled we need to trigger isGameOver
            isGameOver = true;
            console.log("TIE GAME!");
        }
    }
}

function printBoard(){
    console.log(gameBoard);
}

function successfulSelection(){
    isSuccessfulSelect = true;
}

function failSelection(){
    isSuccessfulSelect = false;
}

function getIsSucessfulSelect(){
    return isSuccessfulSelect;
}

function gameOver(){
    isGameOver = true;
}

function getIsGameOver(){
    return isGameOver;
}

function getGameBoard(){
    return gameBoard;
}

function setWinner(player){
    winner = player;
}

function getWinner(){
    return winner;
}

function resetGameOver(){
    isGameOver = false;
    isTie = false;
}

function setIsTie(trueOrFalse){
    isTie = trueOrFalse;
}

function setIsBoardFilled(trueOrFalse){
    isBoardFilled = trueOrFalse;
}

// boardGame[a][b], boardGame[c][d], boardGame[e][f]
function setWinningTiles(a,b,c,d,e,f){
    winningTiles.push(a);
    winningTiles.push(b);
    winningTiles.push(c);
    winningTiles.push(d);
    winningTiles.push(e);
    winningTiles.push(f);
}

function getWinningTiles(){
    return winningTiles;
}

function clearWinTiles(){
    winningTiles = [];
}

function clearBoard(){
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
          gameBoard[i][j] = "";
        }
      }

    console.log("The game board after clear: ",gameBoard);
}

// TODO: Check for Tie game

module.exports = {insertIntoBoard, printBoard, getIsSucessfulSelect, 
    getIsGameOver, getGameBoard, getWinner, 
    resetGameOver, getWinningTiles, clearBoard, clearWinTiles};