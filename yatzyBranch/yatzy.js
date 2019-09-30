// Saves names as objects before replacing the HTML of the page with the game.
//////////////////////////////////////////////////////////////////////////////
let playerList = []
function nameIsSubmitted(){
    let submittedName = document.getElementById('username').value;
    document.getElementById('username').value = '';

    playerList.push({
        name: submittedName,
        scores: Array(18).fill('&nbsp;'),
        sum: 0,
        scoreFirstHalf: 0,
        scoreTotal: 0
    })
    console.log(submittedName);
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
    console.log('This was throw nr: ' + throwCounter);
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
        console.log('BBBBBBB')

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






//createTable();
function createTable(){

    let tableHTML = `
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



    tableHTML += `
    <table id="scoreTable">
        <tr>
    `;
    for(player in playerList){
        tableHTML += `<th>${playerList[player].name}</th>
        `;
    }
    tableHTML += `</tr>
    `
    for(i=0; i<6; i++){
        tableHTML += `<tr>
        `;
        for(j=0; j< playerList.length; j++){
            tableHTML += `<td>${playerList[j].scores[i]}</td>`;
        }
        tableHTML += `</tr>
        `;
    }


    tableHTML += `<tr>
    `;
    for(i=0; i< playerList.length; i++){
        tableHTML += `<th>${playerList[i].sum}</th>`;
    }
    tableHTML += `</tr>
    `;


    tableHTML += `</table>`;
    console.log(tableHTML);
    document.getElementById('scoreTableDiv').innerHTML = tableHTML;
}

let playerNumber = 0;
let roundNumber = 0;

function addScore(){
    playerList[playerNumber].scores[roundNumber] = findRoundScore();
    playerList[playerNumber].sum += findRoundScore();
    
    playerNumber += 1;

    if(playerNumber > playerList.length-1){
        playerNumber = 0;
        roundNumber +=1;
    }
    if(roundNumber == playerList.length){
        playerSum = 0;

        playerList[playerNumber].scores[6] = 5;
    }
}

function findRoundScore(){
    let roundScore = 0;
    for(i in thrownDices){
        if(thrownDices[i] == roundNumber){
            roundScore += 1;
        }
    }
    roundScore *= (roundNumber + 1);
    return(roundScore);
}






////////////////////////////////////////////
//let roundNumber = 0;


function addScore(){
    playerList[playerNumber].scores[roundNumber] = findRoundScore();

    playerNumber += 1;

    if(playerNumber > playerList.length-1){
        playerNumber = 0;
        roundNumber +=1;
    }
    if(roundNumber == playerList.length){
        playerSum = 0;

        playerList[playerNumber].scores[6] = 5;
    }
}


function findRoundScore(){
    let roundScore = 0;

    let sortedDices = thrownDices.sort(function(a, b){return b - a});
    sortedDices.reverse();
    switch(roundNumber){
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            for(i in thrownDices){
                if(thrownDices[i] == roundNumber){
                    roundScore += 1;
                }
            }
            roundScore *= (roundNumber + 1);
            playerList[playerNumber].scoreFirstHalf += roundScore;
            break;
        case 6: // Score of the first half
            roundscore += playerList[playerNumber].scoreFirstHalf;
            break;
        case 7: // Bonus
            if(playerList[playerNumber].scoreFirstHalf >= 63){
                roundScore += 35;
            }
            break;
        case 8: // 1 pair
            for(i=0; i<sortedDices-1; i++){
                if(sortedDices[i] == sortedDices[i+1]){
                    roundScore += sortedDices[i]*2;
                    break;
                }
            }
            break;
        case 9: // 2 pairs
    }
    playerList[playerNumber].scoreTotal += roundScore;
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
        scoresHTML += `<tr>
        `;
        scoresHTML += createRow();
        scoreHTML += `</tr>
        `;
    }

    scoresHTML += `</table>
    `;

    tableHTML = leftColumn + scoresHTML;
    document.getElementById('scoreTableDiv').innerHTML = tableHTML;
}


function createRow(){
    let rowHTML = `<tr>
    `;
    let style;
    for(player in playerList){
        style = 'd';
        if(roundNumber == 7 || roundNumber == 8 || roundNumber == 18){
            style = 'h';
        }
        rowHTML += `<t${style}>${playerList[player].scores[roundNumber]}</t${style}>
        `;
    }
    rowHTML += `</tr>
    `;
    return(rowHTML);
}
/*

playerList[x].scores[roundNumber]

roundNumber:
0: write names, roundNumber +=1
1: number of 1's
2: number of 2's
3: number of 3's
4: number of 4's
5: number of 5's
6: number of 6's
7: sum1, roundNumber +=1
8: Bonus, roundNumber +=1
9: best pair
10: 2 pairs
11: 3 of a kind
12: 4 of a kind
13: full house
14: sm straight (4 consecutive)
15: lg straight (5 consecutive)
16: chance
17: yatzy
18: Total 2
*/

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