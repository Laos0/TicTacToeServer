let xScore = 0;
let oScore = 0;


function incrementScore(player){

    // null check
    if(player){
        
        if(player === 'X'){
            xScore++;
        }else if(player === 'O'){
            oScore++;
        }else{ // if there is a tie
            // nothing happens :D
        }
    }else{
        console.log("Player is null");
    }
    
}

function getXScore(){
    return xScore;
}

function getOScore(){
    return oScore;
}

module.exports = {incrementScore, getXScore, getOScore};