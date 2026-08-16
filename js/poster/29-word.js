/* =====================================================================
   THE WORD — the saying answer landing on the sheet, the poster's only
   typography. Two stacked words in Helvetica Regular, PAPER-filled and
   ink-stroked, so the artwork shows through only at the stroke: the words
   read as cut out of the sheet rather than printed on it.

     Regret   -> LONG GONE   (blue)
     Trust    -> STILL HERE  (blue)
     Presence -> RIGHT NOW   (red)
     Worry    -> WHAT NOW    (red)

   MEASURED OFF THE FIGMA FRAMES (2894:6596/6616/6625/6635, 1981 x 2825),
   not eyeballed: text box left 106, cap top 1745, Helvetica Regular 500,
   line pitch 420 (0.84 leading), two lines flush left at natural tracking,
   stroke ~4.9. Red is #F5242B — the sheet's own red role, so the colourway
   swaps it for free; blue is #0059FF, this layer's one frozen ink, added to
   inkedMarkup's map. Every number is stored as a fraction of the frame, so
   the block scales with any sheet.
   Each line carries textLength = its Helvetica advance sum, so the run is
   pinned to the Figma width even if the browser substitutes the face.
   ===================================================================== */
const SAYING_X   =106/1981;    // left edge, fraction of the sheet width
const SAYING_TOP =1745/2825;   // line 1 cap top, fraction of the sheet height
const SAYING_FS  =500/2825;    // font-size, fraction of the sheet height
const SAYING_LH  =420/500;     // line pitch, em
const SAYING_CAP =0.717;       // Helvetica cap height, em (cap top -> baseline)
const SAYING_SW  =2.9/1981;    // stroke width, fraction of the sheet width (measured 4.9, taken 2pt lighter by decision)
/* per-word advance width in em, summed from Helvetica's own glyph metrics */
const SAYING_EM={LONG:2.834, GONE:2.945, STILL:2.668, HERE:2.778,
                 RIGHT:3.111, NOW:2.444, WHAT:2.944};
const SAYING_TEXT={
  Regret:  {ink:'#0059FF', lines:['LONG','GONE']},
  Trust:   {ink:'#0059FF', lines:['STILL','HERE']},
  Presence:{ink:'#F5242B', lines:['RIGHT','NOW']},
  Worry:   {ink:'#F5242B', lines:['WHAT','NOW']}
};
function sayingLayer(B,C){
  const cfg=SAYING_TEXT[ans('saying')]; if(!cfg) return '';
  const fs=SAYING_FS*B.h, x=SAYING_X*B.w, sw=Math.max(1,SAYING_SW*B.w);
  const base1=SAYING_TOP*B.h + SAYING_CAP*fs;
  let s='<g fill="'+C.bg+'" stroke="'+cfg.ink+'" stroke-width="'+sw.toFixed(2)+'"'
      + ' font-family="Helvetica, \'Helvetica Neue\', Arial, sans-serif"'
      + ' font-weight="400" font-size="'+fs.toFixed(1)+'">';
  cfg.lines.forEach((t,i)=>{
    s+='<text x="'+x.toFixed(1)+'" y="'+(base1+i*SAYING_LH*fs).toFixed(1)+'"'
     + ' textLength="'+(SAYING_EM[t]*fs).toFixed(1)+'" lengthAdjust="spacing">'+t+'</text>';
  });
  return s+'</g>';
}

