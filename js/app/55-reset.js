/* ---------- reset ---------- */
function resetAll(){
  S.answers={}; S.reached={}; S.done={}; S.touched={}; S.skipped={}; S.rolls={}; lastSig='';
  entered.clear();                            // re-arm every tool's first-appearance entrance
  cancelSnakeMorph(); snakeState=snakeLive=null;   // drop any in-flight snake glide
  cancelNodeMorph(); nodeState=nodeLive=null;      // and any in-flight node glide
  cancelRingsMorph(); ringsState=ringsLive=null;   // and any in-flight ring glide
  stopMonthGrow(); snakeAt=null;            // no frame ticking, no revisit held open
  Object.assign(S,PROFILE_DEFAULTS);          // includes baseDone:false — starts over for real
  openQ=null; pinnedQ=null; finished=false; introOpen=false; cardBox=null;
  clearTimeout(aimGuide.t); guideFrom=null; guideTo=[];   // no line left pointing
  lastMarkup=['',''];                                     // force a repaint
  card.classList.remove('open');
  card.setAttribute('aria-hidden','true');
  newSeed();
  buildLogo();                // a fresh composition, and the R cell back to red
  relayout();
  showIntro();
}
resetBtn.addEventListener('click',resetAll);
mkBtn.addEventListener('click',showFinish);

