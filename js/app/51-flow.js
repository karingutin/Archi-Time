function openQuestion(id){
  if(!BANK[id] || !canOpen(id)) return;
  openQ=id; pinnedQ=id;
  S.reached[id]=true;              // the sheet starts responding right away
  /* register the standing value so the record is explicit rather than implied
     by a fallback; S.touched tells us whether the person actually chose */
  if(S.answers[id]===undefined) S.answers[id]=BANK[id].default;
  finished=false;
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
  openQ=null; pinnedQ=null; finished=false; cardBox=null;
  card.classList.remove('open');
  card.setAttribute('aria-hidden','true');
  holdWorld(false);
  renderDots(); renderStatus(); draw();
}

function showFinish(){
  openQ=null; finished=true;
  /* the finish card grows out of the last dot that was answered */
  const last=ASKED[ASKED.length-1];
  pinnedQ = DOTS.find(x=>x.qid===last.id) ? last.id : ((DOTS.find(x=>x.qid)||{}).qid || null);
  renderCard();
  card.classList.add('open');
  card.setAttribute('aria-hidden','false');
  placeCard();
  card.style.animation='none'; void card.offsetWidth; card.style.animation='';
  holdWorld(true);
  renderDots(); renderStatus(); draw(); submit('complete');
}

