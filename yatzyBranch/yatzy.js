// Saves names as objects before replacing the HTML of the page with the game.
//////////////////////////////////////////////////////////////////////////////
let playerList = []
function nameIsSubmitted(){
    let submittedName = document.getElementById('username').value;
    document.getElementById('username').value = '';
    document.getElementById('username').focus();

    playerList.push({
        name: submittedName,
        scores: Array(18).fill('&nbsp;'),
        sum: 0,
        scoreFirstHalf: 0,
        scoreTotal: 0
    })
    //console.log(submittedName);
}

function changeHTML(){
    
    if(playerList.length > 0){
        document.getElementById('mainContent').innerHTML = `
    <button type="button" id="theButton" onclick="throwDices()">Throw Dices</button>
    <button type="button" id="submitButton" onclick="submitDices()">Submit Dices</button>
    <div id="thrownDices"></div>
    <br/><br/><br/><br/>
    <div id="scoreTableDiv"></div>
    `;

        createTable()
    }
    else{alert("You can't play without any players!");}
}




// The main game.
//////////////////////////////////////////////////////////////////////////////
let diceList = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

let thrownDices = [0, 0, 0, 0, 0];
throwCounter = 0;
function throwDices(){
    document.getElementById('theButton').innerHTML = "Reroll Selected"
    if(throwCounter === 1){
        rerollSelected();
        makeDiceElements(true);
    }

    else if(throwCounter === 2){
        rerollSelected();
        makeDiceElements(false);
        document.getElementById('theButton').disabled = true;
    }

    else{
        rerollAll();
        makeDiceElements(true);
    }

    document.getElementById('theButton').disabled = true;
    throwCounter+=1;
    //console.log('This was throw nr: ' + throwCounter);
}

function submitDices(){
    document.getElementById('theButton').innerHTML = "Throw Dices";
    document.getElementById('theButton').disabled = false;
    document.getElementById('thrownDices').innerHTML = ''
    addScore();
    createTable();
    throwCounter = 0;
}


function rerollAll(){
    for(i=0; i<5; i++){
        let randomDice = Math.floor(Math.random()*6);
        thrownDices[i] = randomDice;
    }
}

function rerollSelected(){
    for(i=0; i<5; i++){
        if(document.getElementById(`dice${i}`).classList.contains('highlighted')){
            let randomDice = Math.floor(Math.random()*6);
            thrownDices[i] = randomDice;
        }
    }
}


function makeDiceElements(addOnClick){
    let diceRolls = '';
    let x = '';
    if(addOnClick){
        x = `onclick="selectDice(this)"`
    }
    else{
        x = `style="color: gray;"`;
    }

    for(i=0; i<5; i++){
        diceRolls += `<div id="dice${i}"
        class="dice"
        ${x}>
        ${diceList[thrownDices[i]]}
        </div>`;
    }
    showDices(diceRolls);    
}


function showDices(diceRolls){
    document.getElementById('thrownDices').innerHTML = diceRolls;
}


function selectDice(element){
    element.classList.toggle('highlighted');
    let button = document.getElementById('theButton');
    if(someSelected()){
        document.getElementById('theButton').disabled = false;
        button.innerHTML = 'Reroll Selected';
    }
    else{
        document.getElementById('theButton').disabled = true;
        //console.log('BBBBBBB')

    }
}

function someSelected(){
    let numberOfSelected = 0;
    for(i=0; i<5; i++){
        if(document.getElementById(`dice${i}`).classList.contains('highlighted')){
            numberOfSelected++;
        }
    }
    return(numberOfSelected > 0 ? true : false);
}




////////////////////////////////////////////
let roundNumber = 0;
let playerNumber = 0;

function addScore(){
    playerList[playerNumber].scores[roundNumber] = findRoundScore();

    playerNumber++;

    if(playerNumber > playerList.length-1){
        playerNumber = 0;
        roundNumber++;
    }


    /*
    if(roundNumber == 6){
        for(i in playerList){
            //console.log('playerNumber ' + playerNumber);
            findRoundScore();
            playerNumber++;
        }
        playerNumber = 0;
        roundNumber++;

        for(i in playerList){
            findRoundScore();
            playerNumber++;
        }
        playerNumber = 0;
        roundNumber++;
    }
    */

    createTable();
}
console.log

function findRoundScore(){
    let roundScore = 0;
    console.log('hello');
    // sD = sortedDices, it took a lot of space to write the whole thing every time.
    let sD = thrownDices.sort(function(a, b){return b - a}); // I don't know how this works.

    // I don't think I'm using sD before round 7, but something goes wrong if I don't put this loop inside the IF.
    if(roundNumber>7){    
        for(i in sD){
            sD[i]++;
        }
    }

    console.log('sorted dices ' + sD);
    console.log('round ' + roundNumber);
    console.log('player ' + playerNumber);
    switch(roundNumber){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            for(i in thrownDices){
                if(thrownDices[i] == roundNumber){
                    roundScore++;
                }
            }
            roundScore = roundScore*(roundNumber + 1);
            playerList[playerNumber].scoreFirstHalf += roundScore;
            break;
        case 6: // Score of the first half
            roundScore = playerList[playerNumber].scoreFirstHalf;
            break;
        case 7: // Bonus
            if(playerList[playerNumber].scoreFirstHalf >= 63){
                roundScore = 35;
            }
            break;
        case 8: // 1 pair
            for(i=0; i<sD.length-1; i++){
                if(sD[i] == sD[i+1]){
                    roundScore = sD[i]*2;
                    break;
                }
            }
            break;
        case 9: // 2 pairs
            let onePair = 0;
            let anotherPair = 0;
            for(i=0; i<sD.length-1; i++){
                if(onePair==0 && sD[i]==sD[i+1]){
                    onePair = sD[i]*2;
                    i++;
                }
                else if(onePair>0 && sD[i]==sD[i+1]){
                    anotherPair = sD[i]*2
                }

                if(anotherPair>0){
                    roundScore = onePair + anotherPair;
                }
            }
            break;
        case 10: // 3 of a kind
            for(i=0; i<sD.length-2; i++){
                if(sD[i] == sD[i+1] && sD[i] == sD[i+2]){
                    roundScore = sD[i]*3;
                    break;
                }
            }
            break;
        case 11: // 4 of a kind
            for(i=0; i<sD.length-3; i++){
                if(sD[i] == sD[i+1] && sD[i] == sD[i+2] && sD[i] == sD[i+3]){
                    roundScore = sD[i]*4;
                    break;
                }
            }
            break;
        case 12: // Full House
            if(sD[0]==sD[1] && sD[3]==sD[4]){
                if(sD[2]==sD[0] || sD[2]==sD[4]){
                    roundScore = sD[0] + sD[1] + sD[2] + sD[3] + sD[4];
                }
            }
            break;
        case 13: // Small Straight.
            if(sD[0]==(sD[1]-1) && sD[0]==(sD[2]-2) && sD[0]==(sD[3]-3)){
                roundScore = sD[0] + sD[1] + sD[2] + sD[3];
            }
            else if(sD[1]==(sD[2]-1) && sD[1]==(sD[3]-2) && sD[1]==(sD[4]-3)){
                roundScore = sD[1] + sD[2] + sD[3] + sD[4];
            }
            break;
        case 14: // Large Straight
            let consecutiveNumbers = 0;
            for(i=0; i<sD.length-1; i++){
                if(sD[i] == (sD[i+1]-1)){
                    consecutiveNumbers++;
                }
            }
            if(consecutiveNumbers==4){
                roundScore = sD[0] + sD[1] + sD[2] + sD[3] + sD[4];
            }
            break;
        case 15: // Chance
            roundScore = sD[0] + sD[1] + sD[2] + sD[3] + sD[4];
            break;
        case 16: // YATZY
            let check = 0;
            for(i=0; i<sD.length; i++){
                if(sD[0]==sD[i]){
                    check += 1;
                }
            }
            if(check==5){
                roundScore = 50;
            }
            break;
        case 17: // Total Score
            roundScore = playerList[playerNumber].scoreTotal - playerList[playerNumber].scoreFirstHalf;
            break;
    }
    
    playerList[playerNumber].scoreTotal += roundScore;
    return(roundScore);
    //playerList[playerNumber].scores[roundNumber] = roundScore;
    //createTable();
}


function createTable(){
    let tableHTML;

    let scoresHTML = `
    <table id="scoreTable">
        <tr>
    `;
    for(player in playerList){
        scoresHTML += `<th>${playerList[player].name}</th>
        `;
    }

    scoresHTML += `
    </tr>
    `;
    for(i=0; i<18; i++){
        scoresHTML += createRow(i);
    }

    scoresHTML += `</table>
    `;

    tableHTML = leftColumn + scoresHTML;
    document.getElementById('scoreTableDiv').innerHTML = tableHTML;
}


function createRow(currentRow){
    let rowHTML = `<tr>
    `;
    let style;
    for(player in playerList){
        style = 'd';
        if(currentRow == 6 || currentRow == 7 || currentRow == 17){
            style = 'h';
        }
        rowHTML += `<t${style}>${playerList[player].scores[currentRow]}</t${style}>
        `;
    }
    rowHTML += `</tr>
    `;
    return(rowHTML);
}


let leftColumn = `
<table id="leftColumn">
    <tr>
        <th>Names</th>
    </tr>
    <tr>
        <th>One</th>
    </tr>
    <tr>
        <th>Two</th>
    </tr>
    <tr>
        <th>Three</th>
    </tr>
    <tr>
        <th>Four</th>
    </tr>
    <tr>
        <th>Five</th>
    </tr>
    <tr>
        <th>Six</th>
    </tr>
    <tr>
        <th>Total 1</th>
    </tr>
    <tr>
        <th>Bonus</th>
    </tr>
    <tr>
        <th>1 Pair</th>
    </tr>
    <tr>
        <th>2 Pairs</th>
    </tr>
    <tr>
        <th>3 of a kind</th>
    </tr>
    <tr>
        <th>4 of a kind</th>
    </tr>
    <tr>
        <th>Full House</th>
    </tr>
    <tr>
        <th>Sm Straight</th>
    </tr>
    <tr>
        <th>Lg Straight</th>
    </tr>
    <tr>
        <th>Chance</th>
    </tr>
    <tr>
        <th>YATZY</th>
    </tr>
    <tr>
        <th>Total 2</th>
    </tr>
</table>
`;