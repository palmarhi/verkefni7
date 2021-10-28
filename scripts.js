/**
 * Skæri, blað, steinn.
 * Spilað gegnum console.
 */

/** Hámarks fjöldi best-of leikja, ætti að vera jákvæð heiltala stærri en 0 */
const MAX_BEST_OF = 10;

/** Global breyta sem heldur utan um heildar sigra */
let wins = 0;

/** Global breyta sem heldur utan um heildar töp */
let losses = 0;

/**
 * Athugar hvort gefin tala sé gild sem best-of gildi.
 * @param {number} bestOf Tala sem skal athuga
 * @return {boolean} true eða false
 */
function isValidBestOf(bestOf) {
  if (bestOf < 0 || bestOf > MAX_BEST_OF) {
    return false;
  }
  else if (bestOf % 2 === 1) {
    return true;
  }
  else {
    return false;
  }
}
console.assert(isValidBestOf(1) === true, '1 er valid best of');
console.assert(isValidBestOf(2) === false, '2 er ekki er valid best of');
console.assert(isValidBestOf(9) === true, '9 er valid best of');
console.assert(isValidBestOf(11) === false, '11 er valid best of');
console.assert(isValidBestOf('a') === false, 'a er ekki valid best of');

function playAsText(play) {
  let ret = '';
  switch (play) {
    case '1':
      ret = 'Skæri';
      break;
    case '2':
      ret = 'Blað';
      break;
    case '3':
      ret = 'Steinn';
      break;
    default:
      ret = 'Óþekkt';
      break;
  }
  return ret;
}
console.assert(playAsText('1') === 'Skæri', '1 táknar skæri');
console.assert(playAsText('2') === 'Blað', '2 táknar blað');
console.assert(playAsText('3') === 'Steinn', '3 táknar steinn');
console.assert(playAsText('foo') === 'Óþekkt', 'Annað er óþekkt');

/**
 * Athugar hvort spilari eða tölva vinnur.
 * @param {number} player Það sem spilari spilaði
 * @param {number} computer Það sem tölva spilaði
 * @returns -1 ef tölva vann, 0 ef jafntefli, 1 ef spilari vann
 */
function checkGame(player, computer) {
  if (player == '1' && computer == '2'
        || player == '2' && computer == '3'
        || player == '3' && computer == '1') {
    return 1;
  }
  else if (player == '2' && computer == '1'
        || player == '3' && computer == '2'
        || player == '1' && computer == '3') {
    return -1;
  }
  else {
    return 0;
  }
}
console.assert(checkGame('1', '2') === 1, 'Skæri vinnur blað');
console.assert(checkGame('2', '3') === 1, 'Blað vinnur stein');
console.assert(checkGame('3', '1') === 1, 'Steinn vinnur skæri');
console.assert(checkGame('1', '1') === 0, 'Skæri og skæri eru jafntefli');
console.assert(checkGame('1', '3') === -1, 'Skæri tapar fyrir stein');

/**
 * Spilar einn leik.
 * @return {boolean} -1 ef tölva vann, 0 ef jafntefli, 1 ef spilari vann
 */
function round() {
  // 1. Spyrja um hvað spilað, ef cancel, hætta
  let playerAttack = window.prompt('Hvað setur þú út? Skæri (1), blað (2) eða steinn (3)');
  if (playerAttack === null) {
    return;
  }
  // 2. Ef ógilt, tölva vinnur
  if (!(playerAttack === "1" || playerAttack === "2" || playerAttack === "3")) {
    return -1;
  }
  // 3. Velja gildi fyrir tölvu með `Math.floor(Math.random() * 3) + 1` sem skilar heiltölu á [1, 3]
  let computerAttack = (Math.floor(Math.random() * 3) + 1).toString();
  // 4. Nota `checkGame()` til að finna hver vann
  let roundWinner = checkGame(playerAttack, computerAttack);
  if (roundWinner === 0) {
    return 0;
  }
  // 5. Birta hver vann
  let playerAttackText = playAsText(playerAttack);
  let computerAttackText = playAsText(computerAttack);
  let roundWinnerText = '';
  switch (roundWinner) {
    case 1:
      roundWinnerText = 'Þú';
      break;
    case -1:
      roundWinnerText = 'Tölvan';
      break;
  }

  alert(`Þú spilaðir: ${playerAttackText}.
Tölvan spilaði: ${computerAttackText}.
${roundWinnerText} sigrar`);
  // 6. Skila hver vann
  return roundWinner;
}
// Hér getum við ekki skrifað test þar sem fallið mun biðja notanda um inntak!

/**
 * Spilar leik og bætir útkomu (sigur eða tap) við í viðeigandi global breytu.
 */
function play() {
  let computerRoundWins = 0;
  let playerRoundWins = 0;
  // 1. Spyrja um fjölda leikja
  let rounds = window.prompt('Besta af hve mörgum leikjum? Verður að vera jákvæð oddatala minni en 10.');
  // 2. Staðfesta að fjöldi leikja sé gilt gildi
  if (isValidBestOf(rounds) === false) {
    console.log('%s er ekki löglegt gildi.', rounds);
    return;
  }
  // 3. Keyra fjölda leikja og spila umferð þar til sigurvegari er krýndur
  for (let i = 0; i < rounds; i++) {
    if (Math.abs(computerRoundWins - playerRoundWins) > rounds - i) {
      break;
    }
    switch (round()) {
      case -1:
        computerRoundWins++;
        break;
      case 0:
        i--;
        break;
      case 1:
        playerRoundWins++;
        break;
      default:
        return;
    }
  }
  // 4. Birta hvort spilari eða tölva vann
  if (computerRoundWins > playerRoundWins) {
    losses++;
  }
  else {
    wins++;
  }
}
// Hér getum við ekki skrifað test þar sem fallið mun biðja notanda um inntak!

/**
 * Birtir stöðu spilara.
 */
function games() {
  console.log(`Þú hefur spilað ${wins + losses} leiki.`);
  let winPercentage = wins + losses === 0 ? 0 : parseFloat(wins / (wins + losses)*100);
  let lossPercentage = wins + losses === 0 ? 0 : parseFloat(losses / (wins + losses)*100);
  console.log(`Þú hefur unnið ${wins}, eða ${winPercentage.toFixed(2)}%`);
  console.log(`Þú hefur tapað ${losses}, eða ${lossPercentage.toFixed(2)}%`);
}
// Hér getum við ekki skrifað test þar sem fallið les úr global state
