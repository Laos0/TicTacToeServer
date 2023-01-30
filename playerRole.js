// We are using modules to make our global variables more modular b
// by using modules making our codebase more maintainable

let playerRole = ['X', 'O'];

// assign the role to a player when he is connected to a socket
function assignRole() {
    if(playerRole.length != 0){
        return playerRole.pop();
    }
}

function returnRole(userRole){
    // if the userRole is not undefined, then push it in
    if(userRole){
        playerRole.push(userRole);
    }
}

function availableRole() {
    return playerRole;
}

function isEmpty(){
    if(playerRole.length == 0){
        return true;
    }
    return false;
}


module.exports = { assignRole, returnRole, availableRole, isEmpty};

