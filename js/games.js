/* The six games.
   Part of the portfolio's plain-JS bundle. Files load in dependency order
   from index.html: data -> router -> render -> modal -> tools -> games
   -> forms -> ui -> main. Nothing here needs a build step. */
/* ---------------- Game: Tic-Tac-Toe ---------------- */
let tttState, tttTurn, tttOver;
function initTTT(){
  tttState = Array(9).fill(null);
  tttTurn = 'X';
  tttOver = false;
  document.getElementById('tttStatus').textContent = "Player X's turn";
  const board = document.getElementById('tttBoard');
  board.innerHTML = '';
  tttState.forEach((_, i) => {
    const cell = document.createElement('button');
    cell.className = 'ttt-cell';
    cell.setAttribute('aria-label', 'cell '+i);
    cell.onclick = () => tttMove(i, cell);
    board.appendChild(cell);
  });
}
function tttMove(i, cell){
  if(tttOver || tttState[i]) return;
  tttState[i] = tttTurn;
  cell.textContent = tttTurn;
  cell.classList.add('filled');
  cell.disabled = true;
  const outcome = checkTTTWinner();
  if(outcome){
    tttOver = true;
    document.getElementById('tttStatus').textContent = 'Player ' + outcome.winner + ' wins!';
    const cells = document.querySelectorAll('.ttt-cell');
    outcome.line.forEach(idx => cells[idx].classList.add('win'));
    return;
  }
  if(tttState.every(c => c)){
    tttOver = true;
    document.getElementById('tttStatus').textContent = "It's a draw.";
    return;
  }
  tttTurn = tttTurn === 'X' ? 'O' : 'X';
  document.getElementById('tttStatus').textContent = "Player " + tttTurn + "'s turn";
}
function checkTTTWinner(){
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(const line of lines){
    const [a,b,c] = line;
    if(tttState[a] && tttState[a]===tttState[b] && tttState[a]===tttState[c]) return {winner:tttState[a], line};
  }
  return null;
}

/* ---------------- Game: Memory Match ---------------- */
let memState, memFlipped, memMatched, memMoves, memLock;
function initMemory(){
  const icons = ['🌵','🚀','🎧','📎','🦋','⚙️','🔑','🌊'];
  memState = [...icons, ...icons].sort(() => Math.random()-0.5);
  memFlipped = []; memMatched = []; memMoves = 0; memLock = false;
  document.getElementById('memoryStatus').textContent = 'Moves: 0';
  const board = document.getElementById('memoryBoard');
  board.innerHTML = '';
  memState.forEach((icon, i) => {
    const cell = document.createElement('button');
    cell.className = 'memory-cell';
    cell.dataset.index = i;
    cell.innerHTML = '<div class="memory-card-inner">'
      + '<div class="memory-face memory-front">?</div>'
      + '<div class="memory-face memory-back">' + icon + '</div>'
      + '</div>';
    cell.onclick = () => memFlip(i, cell);
    board.appendChild(cell);
  });
}
function memFlip(i, cell){
  if(memLock || memFlipped.includes(i) || memMatched.includes(i)) return;
  cell.classList.add('flipped');
  memFlipped.push(i);
  if(memFlipped.length === 2){
    memMoves++;
    document.getElementById('memoryStatus').textContent = 'Moves: ' + memMoves;
    memLock = true;
    const [a,b] = memFlipped;
    const cells = document.querySelectorAll('.memory-cell');
    if(memState[a] === memState[b]){
      memMatched.push(a,b);
      cells[a].classList.add('matched');
      cells[b].classList.add('matched');
      memFlipped = []; memLock = false;
      if(memMatched.length === memState.length){
        document.getElementById('memoryStatus').textContent = 'Solved in ' + memMoves + ' moves!';
      }
    } else {
      cells[a].classList.add('mismatch');
      cells[b].classList.add('mismatch');
      setTimeout(() => {
        [a,b].forEach(idx => { cells[idx].classList.remove('flipped'); cells[idx].classList.remove('mismatch'); });
        memFlipped = []; memLock = false;
      }, 750);
    }
  }
}

/* ---------------- Game: Rock Paper Scissors ---------------- */
let rpsYou = 0, rpsCpu = 0;
function playRPS(choice){
  const options = ['rock','paper','scissors'];
  const cpu = options[Math.floor(Math.random()*3)];
  let result, state;
  if(choice === cpu){ result = "Tie — both chose " + choice + '.'; state = 'tie'; }
  else if(
    (choice==='rock' && cpu==='scissors') ||
    (choice==='paper' && cpu==='rock') ||
    (choice==='scissors' && cpu==='paper')
  ){
    rpsYou++; result = 'You win this round — ' + choice + ' beats ' + cpu + '.'; state = 'win';
  } else {
    rpsCpu++; result = 'Computer wins — ' + cpu + ' beats ' + choice + '.'; state = 'lose';
  }
  document.getElementById('rpsScore').textContent = `You: ${rpsYou} — Computer: ${rpsCpu}`;
  const resEl = document.getElementById('rpsResult');
  resEl.textContent = result;
  resEl.className = 'eyebrow ' + state;
  resEl.classList.remove('pop');
  void resEl.offsetWidth;
  resEl.classList.add('pop');
}

/* ---------------- Game: reaction timer ---------------- */
let reactionState = 'idle', reactionAt = 0, reactionTimer = null, reactionBest = null;
function resetReaction(){
  clearTimeout(reactionTimer);
  reactionState = 'idle';
  const pad = document.getElementById('reactionPad');
  pad.className = 'reaction-pad';
  pad.textContent = 'Click to start';
}
function reactionClick(){
  const pad = document.getElementById('reactionPad');
  if(reactionState === 'idle'){
    reactionState = 'waiting';
    pad.className = 'reaction-pad waiting';
    pad.textContent = 'Wait for it…';
    reactionTimer = setTimeout(() => {
      reactionState = 'go';
      reactionAt = performance.now();
      pad.className = 'reaction-pad go';
      pad.textContent = 'Now!';
    }, 1200 + Math.random() * 2800);
    return;
  }
  if(reactionState === 'waiting'){
    clearTimeout(reactionTimer);
    reactionState = 'idle';
    pad.className = 'reaction-pad early';
    pad.textContent = 'Too early — click to try again';
    return;
  }
  if(reactionState === 'go'){
    const ms = Math.round(performance.now() - reactionAt);
    if(reactionBest === null || ms < reactionBest) reactionBest = ms;
    reactionState = 'idle';
    pad.className = 'reaction-pad';
    pad.textContent = ms + ' ms — click to go again';
    document.getElementById('reactionBest').textContent = 'Best: ' + reactionBest + ' ms';
  }
}

/* ---------------- Game: guess the number ---------------- */
let guessTarget = 0, guessCount = 0, guessLog = [];
function resetGuess(){
  guessTarget = 1 + Math.floor(Math.random() * 100);
  guessCount = 0;
  guessLog = [];
  document.getElementById('guessInput').value = '';
  document.getElementById('guessResult').textContent = 'Pick a number to begin.';
  document.getElementById('guessHistory').textContent = '';
}
function submitGuess(){
  const field = document.getElementById('guessInput');
  const n = parseInt(field.value, 10);
  const res = document.getElementById('guessResult');
  if(!Number.isInteger(n) || n < 1 || n > 100){
    res.textContent = 'Enter a whole number between 1 and 100.';
    return;
  }
  guessCount++;
  guessLog.push(n);
  document.getElementById('guessHistory').textContent = 'Tried: ' + guessLog.join(', ');
  if(n === guessTarget){
    res.textContent = 'Got it — ' + n + ' in ' + guessCount + (guessCount === 1 ? ' guess.' : ' guesses.');
  } else {
    res.textContent = n < guessTarget ? n + ' is too low. Go higher.' : n + ' is too high. Go lower.';
  }
  field.value = '';
  field.focus();
}

/* ---------------- Game: simon says ---------------- */
const SIMON_PADS = 4;
let simonSeq = [], simonStep = 0, simonAccepting = false;
function resetSimon(){
  simonSeq = [];
  simonStep = 0;
  simonAccepting = false;
  const board = document.getElementById('simonBoard');
  board.innerHTML = '';
  for(let i = 0; i < SIMON_PADS; i++){
    const pad = document.createElement('button');
    pad.className = 'simon-pad p' + i;
    pad.setAttribute('aria-label', 'pad ' + (i+1));
    pad.onclick = () => simonPress(i);
    board.appendChild(pad);
  }
  document.getElementById('simonStatus').textContent = 'Press start to play.';
}
function flashPad(i){
  const pad = document.querySelectorAll('#simonBoard .simon-pad')[i];
  if(!pad) return;
  pad.classList.add('lit');
  setTimeout(() => pad.classList.remove('lit'), 320);
}
function playSimonSeq(){
  simonAccepting = false;
  document.getElementById('simonStatus').textContent = 'Watch…';
  simonSeq.forEach((v, idx) => setTimeout(() => flashPad(v), idx * 520 + 300));
  setTimeout(() => {
    simonAccepting = true;
    simonStep = 0;
    document.getElementById('simonStatus').textContent = 'Your turn — ' + simonSeq.length + ' to repeat.';
  }, simonSeq.length * 520 + 400);
}
function startSimon(){
  if(!document.querySelectorAll('#simonBoard .simon-pad').length) resetSimon();
  simonSeq.push(Math.floor(Math.random() * SIMON_PADS));
  playSimonSeq();
}
function simonPress(i){
  if(!simonAccepting) return;
  flashPad(i);
  if(simonSeq[simonStep] === i){
    simonStep++;
    if(simonStep === simonSeq.length){
      simonAccepting = false;
      document.getElementById('simonStatus').textContent =
        'Round ' + simonSeq.length + ' cleared. Press start for the next.';
    }
    return;
  }
  simonAccepting = false;
  document.getElementById('simonStatus').textContent =
    'Wrong pad — you reached round ' + simonSeq.length + '. Press start to try again.';
  simonSeq = [];
}

