/* =====================================================================
   THE DATA RECORD — the band along the poster's foot.

   Everything the session was, said back as one run of text: an item per
   question that was answered, in the order it was asked, then how long the
   asking took and when it happened. The items are separated by \\ and the
   whole run is set in the poster's one face, uppercase, in the blue ink role,
   on plain paper.

   IT IS NOT A LAYER LIKE THE OTHERS. Nothing about it is generated, rolled or
   earned: it is the answers written out. So it lives here, beside the hover
   notes, which is the other file where the per-answer COPY is kept, rather
   than in js/poster/ with the tools.

   THE BAND OWNS THE FOOT. Two rows of the sheet, full width, in the paper
   colour, and it is opaque — whatever the artwork has down there is covered
   rather than clipped, which is the same thing to look at and one fewer clip
   path to key by format (see the two-plies note in buildSVG).
   ===================================================================== */

/* ---------------------------------------------------------------------
   THE CLOCK.

   Two numbers reach the poster: how long a question took on average, and how
   long the whole thing took. Both are measured from the BEGIN press, not from
   the page load — the wait before someone starts is not part of the
   experience, and a tab left open overnight would otherwise report a session
   of nine hours.

   A question's time is the stretch between the press that banked the question
   before it and the press that banks this one. That is deliberately simpler
   than opening and closing a card: in the panel flow the next question becomes
   current the instant the last one is banked, so there is no dead time between
   them to attribute to nobody. Stepping BACK to a question and banking it
   again adds that second stretch to the same question's own total, which is
   what it costs someone to answer it.
   --------------------------------------------------------------------- */
const CLOCK={t0:0, last:0, per:{}, total:null, at:null};
/* Begin. Also the two ways back to question one — Reset and the mark — since
   both start the asking over and the old clock is not theirs. */
function startClock(){
  const now=performance.now();
  CLOCK.t0=CLOCK.last=now; CLOCK.per={}; CLOCK.total=null; CLOCK.at=null;
}
/* one question banked */
function markClock(qid){
  if(!CLOCK.t0 || !qid) return;
  const now=performance.now();
  CLOCK.per[qid]=(CLOCK.per[qid]||0)+(now-CLOCK.last);
  CLOCK.last=now;
}
/* Create. The two numbers are FROZEN here rather than read live, so the poster
   says what it said the moment it was made — a sheet left on screen for ten
   minutes must not go on counting. */
function stampRecord(){
  CLOCK.total = CLOCK.t0 ? performance.now()-CLOCK.t0 : 0;
  CLOCK.at    = new Date();
}
/* Back out of the ending: the numbers go live again, because the asking is
   open again and the next Create is a different poster. */
function unstampRecord(){ CLOCK.total=null; CLOCK.at=null; }

/* ---------------------------------------------------------------------
   THE COPY. One line per possible answer, written out rather than assembled
   from the question's own display(): the panel's wording is a sentence to a
   person mid-thought, and this is a record. They are allowed to differ.
   --------------------------------------------------------------------- */
const REC_SHAPE   ={square:'TIME MOVES ON WITHOUT YOU', circle:'TIME CARRIES YOU WITH IT'};
const REC_DENSITY ={little:'TOO LITTLE TIME', enough:'ENOUGH TIME', plenty:'PLENTY OF TIME'};
const REC_MEMORIES={'1':'1 CORE MEMORY', '2':'2 CORE MEMORIES', '3':'3 CORE MEMORIES',
                    '4+':'4+ CORE MEMORIES'};
const REC_SAYING  ={Trust:'TIME IS TRUST', Worry:'TIME IS WORRY',
                    Regret:'TIME IS REGRET', Presence:'TIME IS PRESENCE'};
/* the tail binaries, written now so raising QUESTIONS_PER_SESSION needs no
   copy work later — none of these is asked at ten questions a session */
const REC_BIN={
  gaze:   {back:'LOOKING BACKWARD',      forward:'LOOKING FORWARD'},
  reserve:{behind:'MORE TIME BEHIND',    ahead:'MORE TIME AHEAD'},
  trust:  {trust:'CLOSER TO TRUST',      worry:'CLOSER TO WORRY'},
  today:  {remember:'A DAY TO REMEMBER', blur:'A DAY THAT BLURS'},
  novelty:{repeats:'MORE REPEATS THAN NEW', new:'MORE NEW THAN REPEATS'},
  supply: {scarce:'RUNNING OUT OF TIME', plenty:'MORE TIME THAN NEEDED'}
};
/* The month's two temperatures come from MONTH_TEMPS, the same table the
   silhouette is set from — so the figures on the foot and the shape above them
   are the one reading, not two. */
function recMonthItem(){
  const m=ans('month'), t=MONTH_TEMPS[m]||'';
  const hit=/^(\d+)c(\d+)f$/.exec(t);
  if(!hit) return '';
  return 'FAVOURITE WEATHER '+hit[1]+'C OR '+hit[2]+'F IN '+String(m).toUpperCase();
}
/* Per question, and only the ones whose answer says something the sheet does
   not already say. THE COLOURWAY IS NOT HERE, deliberately: the poster IS the
   colourway, and naming it is the one item that reports what you can see. */
const REC_ITEM={
  shape:    ()=>REC_SHAPE[ans('shape')]||'',
  density:  ()=>REC_DENSITY[ans('density')]||'',
  month:    recMonthItem,
  febdays:  ()=>String(beadCountFromAnswers())+' DAYS IN BIRTH MONTH',
  alarms:   ()=>{ const n=rayCountFromAnswers();
                  return n===0 ? 'NO SNOOZE IN THE MORNING'
                       : n===1 ? '1 SNOOZE EVERY MORNING'
                               : n+' SNOOZES EVERY MORNING'; },
  decades:  ()=>{ const d=Math.max(1,Math.round(Math.round(ans('decades'))/10));
                  return d===1 ? '1 DECADE AHEAD' : d+' DECADES AHEAD'; },
  vacations:()=>REC_MEMORIES[String(ans('vacations'))]||'',
  sixweek:  ()=>{ const raw=ans('sixweek'), v=Number.isFinite(+raw)?+raw:50;
                  /* the same three bands the question's own display() reads, so
                     the panel and the foot can never disagree about which side
                     of the week someone came down on */
                  return v<45 ? 'WEEK SUPERIORITY'
                       : v<=55 ? 'WEEK AND WEEKEND EVEN'
                               : 'WEEKEND SUPERIORITY'; },
  saying:   ()=>REC_SAYING[ans('saying')]||''
};

/* ---- the stamp ---- */
const REC_DAYS  =['SUN','MON','TUE','WED','THU','FRI','SAT'];
const REC_MONTHS=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
/* Keyed by year % 12, so 2016 (remainder 0) is the monkey and 2026 (remainder
   10) is the horse. APPROXIMATE BY ONE MONTH AND KNOWINGLY SO: the Chinese year
   turns in late January or February, not on the 1st, so a session in that gap
   is stamped with the year it is about to leave. The poster is not an almanac
   and the animal is a flourish on a timestamp. */
const REC_ZODIAC=['MONKEY','ROOSTER','DOG','PIG','RAT','OX',
                  'TIGER','RABBIT','DRAGON','SNAKE','HORSE','GOAT'];
function recStamp(d){
  return REC_DAYS[d.getDay()]+' '+d.getDate()+' '+REC_MONTHS[d.getMonth()]
       + ' '+pad2(d.getHours())+':'+pad2(d.getMinutes())+' '+d.getFullYear()
       + ' THE YEAR OF THE '+REC_ZODIAC[((d.getFullYear()%12)+12)%12];
}
/* The three that are written whatever else is: a session where every question
   was passed over still took some time and still happened on some day. */
function recordMeta(){
  const spans=ASKED.filter(q=>isAnswered(q.id)).map(q=>CLOCK.per[q.id]).filter(ms=>ms>0);
  const avg=spans.length ? Math.round(spans.reduce((a,b)=>a+b,0)/spans.length/1000) : 0;
  const totalMs = CLOCK.total!=null ? CLOCK.total : (CLOCK.t0 ? performance.now()-CLOCK.t0 : 0);
  const total=Math.max(0,Math.round(totalMs/1000));
  return [
    avg+(avg===1?' SECOND':' SECONDS')+' AVERAGE TO ANSWER A QUESTION',
    pad2(Math.floor(total/60))+':'+pad2(total%60)+' MIN TO COMPLETE THE EXPERIENCE',
    recStamp(CLOCK.at||new Date())
  ];
}
/* A SKIPPED QUESTION WRITES NOTHING. Same rule the artwork keeps: a question
   passed over leaves no mark, and it must not leave a line either. */
function recordItems(){
  const out=[];
  ASKED.forEach(q=>{
    if(!isAnswered(q.id)) return;
    const write=REC_ITEM[q.id];
    const t = write ? write() : (REC_BIN[q.id] ? REC_BIN[q.id][ans(q.id)] : '');
    if(t) out.push(t);
  });
  return out.concat(recordMeta());
}
const recordLine=()=>recordItems().join(' \\\\ ');

/* ---------------------------------------------------------------------
   SETTING IT.

   SVG text does not wrap, so the run is broken into lines here, against real
   Helvetica advances measured on a canvas rather than against a guess at an
   average character. The band's height is FIXED (Karin, 17 Aug), so what gives
   is the type: the run is set at the nominal size and only steps down if it
   would need a fourth line. A short session takes one or two lines at the same
   size as a long one, which is what keeps a series of posters looking like a
   series.
   --------------------------------------------------------------------- */
/* THE SIZE IS SET BY WHAT THE BAND CAN HOLD, and the two rows are fixed, so the
   only way to make the type bigger is to let it use more of them. Four lines
   across the full width, rather than three inside a margin, is what took it from
   barely readable to read-at-a-glance (Karin, 17 Aug): a run of about 340
   characters over four lines is 85 to a line, and 85 characters of Helvetica
   caps across thirteen cells lands near a quarter of a cell. Five lines would be
   bigger again and would not fit the two rows. */
const REC={
  inset:0.5,       /* left and right, in cells — the record's own margin */
  fs:0.25,         /* nominal type size, in cells */
  lh:1.45,         /* line pitch, in em */
  track:0.02,      /* letter-spacing, in em */
  cap:0.717,       /* Helvetica cap height, em — the same figure the word layer uses */
  lines:4,         /* the most lines the band will take */
  min:0.12,        /* and the size it will not shrink past, in cells */
  write:900        /* how long the run takes to be written, first letter to last */
};
const REC_FACE='Helvetica, \'Helvetica Neue\', Arial, sans-serif';
let recCtx=null;
function recWidth(t,fs){
  if(!recCtx) recCtx=document.createElement('canvas').getContext('2d');
  recCtx.font='400 '+fs+'px '+REC_FACE;
  /* canvas knows nothing about letter-spacing, so the tracking is added back by
     hand — one gap per letter, which is what the SVG will render */
  return recCtx.measureText(t).width + Math.max(0,t.length-1)*fs*REC.track;
}
function recWrap(words,fs,W){
  const lines=[]; let cur='';
  for(const w of words){
    const t=cur?cur+' '+w:w;
    if(cur && recWidth(t,fs)>W){ lines.push(cur); cur=w; } else cur=t;
  }
  if(cur) lines.push(cur);
  return lines;
}
function recFit(text,W,c){
  const words=text.split(' ');
  let fs=REC.fs*c, lines=recWrap(words,fs,W);
  while(lines.length>REC.lines && fs>REC.min*c){
    fs*=0.96;
    lines=recWrap(words,fs,W);
  }
  return {fs,lines};
}
/* The band. The two rows PAST the artwork's foot — bandY is B.h, the sheet's
   old bottom edge — full width, on the same paper.

   EVERY LETTER ITS OWN TSPAN, carrying the moment it lands (--gd) — the word
   layer's mechanic, and here for the same reason: the record should read as
   being PRINTED, left to right, rather than switched on. In the export these
   are inert (no <style> is emitted), so a saved file simply shows the finished
   run, which is the only thing a still of it should show. */
function recordLayer(B,C,bandH){
  const text=recordLine(); if(!text) return '';
  const c=B.w/B.cols;
  const W=(B.cols-2*REC.inset)*c;
  const fit=recFit(text,W,c);
  const fs=fit.fs, lines=fit.lines, lh=fs*REC.lh, cap=fs*REC.cap;
  const bandY=B.h;
  /* the block is centred in the band: its ink runs from the first line's cap to
     the last line's baseline, and that is what is centred, not the line boxes */
  const blockH=(lines.length-1)*lh+cap;
  const base1=bandY+(bandH-blockH)/2+cap;
  const x=REC.inset*c;
  const n=lines.join('').length;
  let gi=0, body='';
  lines.forEach((line,i)=>{
    body+='<text x="'+x.toFixed(1)+'" y="'+(base1+i*lh).toFixed(1)+'">'
       + [...line].map(ch=>'<tspan class="rglyph" style="--gd:'
           + (n<2?0:(gi++/(n-1))*REC.write).toFixed(1)+'ms">'+esc(ch)+'</tspan>').join('')
       + '</text>';
  });
  /* NO MAT. The sheet's own paper rect already runs the full length of the
     poster, band included (see buildSVG), and the artwork stops dead at the
     band's top edge because that edge IS the artwork's box. There is nothing
     down here to cover.
     #0C55FF is the blue ink ROLE, not a blue: inkedMarkup swaps it for whatever
     the colourway put in that role, so the record recolours with the sheet. */
  return '<g class="record" fill="#0C55FF" font-family="'+REC_FACE.replace(/'/g,'&apos;')+'"'
    +   ' font-weight="400" font-size="'+fs.toFixed(1)+'"'
    +   ' letter-spacing="'+(fs*REC.track).toFixed(2)+'">'+body+'</g>';
}
