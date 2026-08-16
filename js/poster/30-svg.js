/* =====================================================================
   SVG
   ===================================================================== */
function buildSVG(F){
  const B=box(F);
  const C=PAPER;
  const smokeMax=25;
  const smoke=smokeFromAnswers();

  /* preserveAspectRatio="none" so the layer fills the frame while the frame is
     travelling between two ratios during a format change. At rest the frame's
     ratio and this viewBox are the same number, so nothing is distorted.

     The poster carries no identifying text — no wordmark, no date, no name, no
     age/birthdate, no per-question labels. Its ONE piece of typography is the
     saying answer's word pair (sayingLayer), which is artwork, not label;
     everything identifying is kept in the data record (payload()), not on the
     artwork itself.

     Every layer is EARNED, the base grid now included: it draws only once its
     own question has actually been answered (isChosen), never merely reached.
     So the sheet the board opens on is bare ground, the grid arrives with the
     shape question, each mark arrives when the person puts it there, and a
     skipped question leaves nothing behind rather than quietly printing its
     default. */
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+B.w+' '+B.h+'"'
    + ' width="'+B.w+'" height="'+B.h+'" preserveAspectRatio="none">'
    + '<rect width="'+B.w+'" height="'+B.h+'" fill="'+C.bg+'"/>'
    + (isChosen('shape') ? '<g class="hl" data-q="basegrid" style="pointer-events:none">'+baseGridLayer(C,B)+'</g>' : '')
    /* the answered layers live in .art so a hovered one can be picked out and the
       rest dimmed (see the .hl hover rules). Each layer is a single child of .art;
       .hl marks the ones wired to a hover note (month is the first). */
    + '<g class="art">'
    /* THE GRID is its own hover element: a full-sheet transparent catch that sits
       under every mark, so hovering the bare ground (anywhere no mark is) dims the
       marks and shows the base-questions reading. It is bottom-most, so any actual
       mark hovered wins over it. */
    + '<g class="hl" data-q="grid"><rect class="hit" x="0" y="0" width="'+B.w+'" height="'+B.h+'" fill="transparent"/></g>'
    /* above the grid, below everything else. The month layer's own bounding box is
       its hover target (added after paint) rather than the whole sheet, so the bare
       ground around the silhouette still belongs to the grid element. */
    + (isChosen('month')  ? '<g class="hl" data-q="month">'+monthLayer(B,C)+'</g>' : '')
    /* the decades checkerboard hugs the foot, above the month silhouette but below
       the rings, snake and node, which all print over it */
    /* A bar layer has a standing DEFAULT, so it can (and should) show the moment
       the question is reached — not only once the handle is touched. That also
       gives the entrance a single clean draw to run on (openQuestion draws once
       on open), which the touch-driven path never provides: a drag re-renders
       every stop and would strip .enter before it played. Skip still hides it. */
    + ((isChosen('decades') || (S.reached['decades'] && !S.skipped['decades'])) ? '<g class="hl" data-q="decades" opacity="0.85" style="--cstep:'+(800/Math.max(1,barColsFromAnswers())).toFixed(1)+'ms">'+barLayer(B,C)+'</g>' : '')
    /* sixweek — the week/weekend lattice, full-bleed. Moved BELOW the rings, the
       snake and the node by decision: the lattice is weather across the sheet,
       and the marks those three make print over it. Its red X uses the red-role
       hex (#F5242B), so the colourway recolours it. Blend and opacity come from
       LATTICE_STYLE — the dev-only tuning panel writes it (see the DEV_SKIP
       block); whatever is set there prints, since this is the export markup. */
    /* Like decades, a bar has a standing DEFAULT, so it shows the moment the
       question is reached — not only once the handle is touched. That also
       gives the entrance a single clean draw to run on (openQuestion draws
       once on open): a drag re-renders every stop and would otherwise strip
       .enter, or never even reach a first paint to tag, before it played. */
    + ((isChosen('sixweek') || (S.reached['sixweek'] && !S.skipped['sixweek'])) ? '<g class="hl" data-q="sixweek" opacity="'+LATTICE_STYLE.opacity+'"'
        + (LATTICE_STYLE.blend!=='normal' ? ' style="mix-blend-mode:'+LATTICE_STYLE.blend+'"' : '')
        + '>'+latticeLayer(B,C)+'</g>' : '')
    /* the word pair — the sheet's only typography. ABOVE the sixweek lattice by
       Karin's decision (16 Aug): the letters print over the lattice weather;
       only the rings, snake and node still print over the letters. */
    + (isChosen('saying') ? '<g class="hl" data-q="saying">'+sayingLayer(B,C)+'</g>' : '')
    /* the ring stack hangs on the top-right corner, above the month silhouette
       but below the node and the beams, which stay centred and print over it */
    + (isChosen('vacations') ? '<g class="hl" data-q="vacations" opacity="0.85">'+ringsMarkup(B,C)+'</g>' : '')
    /* The snake is drawn BEFORE the node, so the node prints OVER it — the snake
       sits BELOW the alarms element in the layering, though both share the centre.
       Each answered layer is its own hover element with its own note. */
    + (isChosen('febdays') ? '<g class="hl" data-q="febdays" opacity="0.85" style="--sstep:'+(820/Math.max(1,beadCountFromAnswers())).toFixed(1)+'ms">'+snakeMarkup(B,C)+'</g>' : '')
    + (isChosen('alarms') ? '<g class="hl" data-q="alarms" style="--nstep:'+(300/Math.max(1,rayCountFromAnswers())).toFixed(1)+'ms">'+risoNodeMarkup(B,C)+'</g>'  : '')
    + '</g>'
    /* The beams were removed — the snake took the centre. beamsMarkup and BEAMS
       are kept (unwired) like smoke, so the layer can be brought back with one
       line if it is ever wanted again. happiness now records but draws nothing. */
    + smokeLayer(smoke,smokeMax,S.seed,B)
    + '</svg>';
  /* THE COLOURWAY recolours the whole sheet: the last question maps the poster's
     two ink roles to the chosen pair. red-role = every #F5242B, blue-role = every
     #0C55FF and the month/grid #004CFF. Only once a colourway is picked, so the
     default red+blue sheet is untouched until then. The swap itself lives in
     inkedMarkup, shared with the live glide emitters — see the note there. */
  return inkedMarkup(svg);
}

