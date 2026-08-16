function openQuestion(id){
  if(!BANK[id] || !canOpen(id)) return;
  openQ=id; pinnedQ=id;
  S.reached[id]=true;              // the sheet starts responding right away
  /* register the standing value so the record is explicit rather than implied
     by a fallback; S.touched tells us whether the person actually chose */
  if(S.answers[id]===undefined) S.answers[id]=BANK[id].default;
  renderCard();
  card.classList.add('open');
  card.setAttribute('aria-hidden','false');
  placeCard();
  card.style.animation='none'; void card.offsetWidth; card.style.animation='';
  holdWorld(true);
  renderDots();
  draw();
  const first=card.querySelector('button,input');
  if(first) setTimeout(()=>first.focus(),80);
}

function closeCard(markDone){
  if(markDone && openQ) S.done[openQ]=true;
  openQ=null; pinnedQ=null; cardBox=null;
  card.classList.remove('open');
  card.setAttribute('aria-hidden','true');
  holdWorld(false);
  renderDots(); renderStatus(); draw();
}

/* ---------------------------------------------------------------------
   THE END OF THE ASKING.

   Pressing Create on the tenth question banks that answer like any other
   Next — and then this. There is no finish CARD any more: the floating
   popup the old "Create Poster" button opened is gone with the button, and
   what happens instead is that the interface takes the questions away and
   inverts its own ground, so the only lit thing left on the board is the
   poster and the three ways to keep it.

   NOTHING ABOUT THE POSTER CHANGES HERE. Not the sheet, not the format, not
   a single layer — no redraw is even asked for. The making was finished the
   moment the last answer landed; this is the interface stepping back from it.
   --------------------------------------------------------------------- */
function showFinish(){
  if(posterDone) return;
  posterDone=true;
  snakeAt=null;                       // no revisit held open behind the ending
  renderFinish.shown=false;           // re-arm the arrival stagger
  /* THE ONE REDRAW, and it is the record's text rather than the poster's marks:
     the two durations and the timestamp are only knowable at this press, so the
     band has to be re-set with them before anything is shown. Not the marks —
     the making WAS finished when the last answer landed. */
  stampRecord();
  drawNow();
  /* AND THE CLASS GOES ON AFTER THAT PAINT, not with it. The retreat is a CSS
     transition on the group that was just written into the DOM; setting the
     class in the same frame gives the browser one element with one computed
     transform and nothing to move from, and the artwork would jump back rather
     than travel. Two frames is imperceptible and is the whole of the fix. */
  const turn=()=>document.body.classList.add('made');
  if(reduceMotion && reduceMotion()) turn();
  else requestAnimationFrame(()=>requestAnimationFrame(turn));
  renderSnake(); renderStatus(); submit('complete');
}

/* Back out of it. The ground comes back and the tenth question is standing
   where it was left — with its Create live again, since the answer is still
   banked. Reset takes the same route out (see resetAll) and then starts over. */
function hideFinish(){
  if(!posterDone) return;
  posterDone=false;
  document.body.classList.remove('made');
  /* the record's numbers go live again: the asking is open, and the next Create
     is a different poster with a different duration on it. No repaint is asked
     for here on purpose — the band is fading out on the same beat the artwork
     is coming back, and repainting mid-transition would cut both. */
  unstampRecord();
  /* land on the question the Create was pressed from rather than at the end of
     a flow with nothing left open, which would draw a trail and no panel */
  const back=ASKED.findIndex(q=>isCreateQ(q));
  snakeAt = back>=0 ? back : null;
  /* and let the ground come back before they arrive into it — the same wait
     the way out took on the way in, for the same reason. This IS an arrival:
     renderFinish cleared renderSnake.last on its way past. */
  snakeLead=(reduceMotion && reduceMotion()) ? 0 : FLIP_MS;
  renderSnake(); renderStatus();
}

