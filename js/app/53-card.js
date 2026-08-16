/* ---------- card contents ---------- */
function renderCard(){
  const D=derive();
  cardBody.innerHTML='';
  const box=document.createElement('div');
  box.className='q';

  if(finished){
    const summary=ASKED.filter(q=>isAnswered(q.id))
                       .map(q=>q.label+' '+q.display(ans(q.id))).join(' · ');
    box.innerHTML='<h2>Your poster is ready.</h2><p class="hint">'+esc(summary)+'.</p>'+
      '<div class="row">'+
        '<button class="btn" id="dlPng" type="button">Download PNG</button>'+
        '<button class="btn ghost" id="dlSvg" type="button">SVG for print</button>'+
      '</div>'+
      '<div class="collected">'+
        '<span id="saveNote">Response saved \u00b7 '+RESPONSES.length+' collected'+
          (CONFIG.DATA_ENDPOINT?' \u00b7 sent to endpoint':' \u00b7 no endpoint set')+'</span>'+
        '<div class="row">'+
          '<button class="btn ghost" id="cpJson" type="button">Copy JSON</button>'+
          '<button class="btn ghost" id="dlCsv" type="button">All responses (CSV)</button>'+
        '</div>'+
      '</div>';
    cardBody.appendChild(box);
    box.querySelector('#dlPng').addEventListener('click',exportPNG);
    box.querySelector('#dlSvg').addEventListener('click',exportSVG);
    box.querySelector('#dlCsv').addEventListener('click',()=>downloadResponses('csv'));
    box.querySelector('#cpJson').addEventListener('click',async e=>{
      const ok=await copyPayload();
      e.target.textContent = ok ? 'Copied' : 'Logged to console';
      setTimeout(()=>{ e.target.textContent='Copy JSON'; },1600);
    });
    const foot=document.createElement('div');
    foot.className='nav';
    const close=document.createElement('button');
    close.className='btn ghost'; close.type='button'; close.textContent='Close';
    close.addEventListener('click',()=>closeCard(false));
    foot.appendChild(close);
    cardBody.appendChild(foot);
    return;
  }

  const q=BANK[openQ];
  if(!q) return;
  const idx=ASKED.findIndex(x=>x.id===openQ);
  box.innerHTML=
    '<div class="eyebrow"><span>'+esc(q.label)+'</span>'
    + '<span class="eyebrow-right">'+pad2(idx+1)+' / '+pad2(ASKED.length)+'</span></div>'
    + '<h2>'+val(q.title,D)+'</h2><p class="hint">'+val(q.hint,D)+'</p>';
  box.appendChild(CONTROLS[q.type](q));
  cardBody.appendChild(box);

  /* Two exits, and they do different things — which is exactly what the old
     Done / Close pair failed to say. Save banks the answer and moves on; Skip
     passes the question by and moves on WITHOUT recording one. Cancelling is a
     third thing again and needs no button: Escape, or clicking the dot a second
     time, shuts the card and leaves the question exactly as it was. */
  const foot=document.createElement('div');
  foot.className='nav';
  /* Always just "Save" — even on the last question. Creating the poster is a
     separate, deliberate action now (see #mkPoster), not something the last
     Save silently doubles as. */
  const save=document.createElement('button');
  save.className='btn'; save.type='button'; save.textContent='Save';
  save.addEventListener('click',saveAnswer);
  foot.appendChild(save);

  /* Skip is GONE from the interface, by decision. Cancelling still needs no
     button — Escape, or clicking the marker a second time, shuts the card and
     leaves the question as it was. step(true)/skipQuestion and the whole
     skipped path stay in the code and in the record's shape: they are what let
     a response say "no answer given" rather than reporting a default, and that
     distinction should not be thrown away to remove a button. */
  cardBody.appendChild(foot);
}

/* Both exits do the same three things — mark the question behind us, save, and
   hand off to the next dot — and differ only in whether an answer was given.
   step() is that shared shape, so the two can never drift apart. */
/* Saving or skipping the LAST question no longer auto-opens the finish card —
   it behaves exactly like any other question. "Create the poster" is now a
   deliberate, separate action (see #mkPoster below), not something bundled
   into answering. So this always submits 'partial'; 'complete' is submitted
   only by showFinish(), which only the dedicated button ever calls. */
function step(passed){
  /* openQ is the old floating card's question. The board no longer opens it, so
     the question being answered is simply the one the snake is on — and that is
     what Save in the panel means. Falling back here rather than faking openQ
     keeps the card's own state out of a flow that no longer uses it. */
  const from=openQ || ((snakeQ()||{}).id);
  if(!from) return;
  snakeAt=null;                    // banked — the panel goes back to the flow
  S.done[from]=true;
  if(passed){
    S.skipped[from]=true;
    /* Drop the standing value that openQuestion registered, so nothing claims
       an answer that was not given: the record reports null, and the bead
       count does not include it.
       The ARTWORK is the one place a default still applies — the poster has to
       draw some shape and some ground — so a skipped question falls back to a
       neutral default there rather than leaving a hole. */
    delete S.answers[from];
    delete S.reached[from];
    delete S.touched[from];
  } else {
    delete S.skipped[from];                   // in case it was skipped earlier
  }
  submit('partial');                          // captured even if they stop here
  aimGuide(from);                             // reach toward whatever just opened
  closeCard(false);                           // ...which renders it
}
const saveAnswer=()=>step(false);
/* No caller while the interface has no Skip: kept as the named entry point
   to the skipped path, which the record still models. See renderCard. */
const skipQuestion=()=>step(true);

/* ---------- status strip, bottom left ---------- */
function renderStatus(){
  const done=ASKED.filter(q=>isDone(q.id)).length;
  const answered=ASKED.filter(q=>isAnswered(q.id)).length;
  const passed=done-answered;
  const bits=[];
  bits.push('<span class="build">'+BUILD+'</span>');
  if(done===0) bits.push('<span class="cue">'
    + (!S.baseDone ? 'Say hello first' : 'Click the pulsing point to begin')
    + '</span>');
  /* counts what was ANSWERED, not what is behind us — and states the skips
     separately rather than quietly folding them into progress */
  else bits.push('<span>'+pad2(answered)+' of '+pad2(ASKED.length)+' answered'
               + (passed?' · '+pad2(passed)+' skipped':'')+'</span>');
  /* Only worth saying once there is actually a choice. During the linear lead a
     single question is open and "1 open" is noise; at the fork the board starts
     behaving differently and that IS worth stating. */
  if(!allDone() && forked()) bits.push('<span>'+availableQs().length+' open, pick either</span>');
  statusBar.innerHTML='<span class="statline">'+bits.join('<i class="sep"></i>')+'</span>';
  resetBtn.disabled = done===0 && Object.keys(S.answers).length===0 && !finished;
  /* the one and only "create the poster" control — see #mkPoster's own
     comment for why it lives below the sheet rather than in this strip or
     inside a question card */
  mkBtn.classList.toggle('ready', allDone() && !finished);
}

