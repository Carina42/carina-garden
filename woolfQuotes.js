(function(){
  // Woolf quote pool: short lines for gentle daily randomness.
  // Notes: some lines are widely circulated/attributed; keep them short for fair-use style display.
  const QUOTES = [
  {
    "text": "No need to hurry. No need to sparkle. No need to be anybody but oneself.",
    "src": "A Room of One's Own"
  },
  {
    "text": "Arrange whatever pieces come your way.",
    "src": "A Writer's Diary"
  },
  {
    "text": "I am rooted, but I flow.",
    "src": "The Waves"
  },
  {
    "text": "Nothing has really happened until it has been described.",
    "src": "A Room of One's Own (often attributed)"
  },
  {
    "text": "Books are the mirrors of the soul.",
    "src": "(attributed)"
  },
  {
    "text": "A woman must have money and a room of her own if she is to write fiction.",
    "src": "A Room of One's Own"
  },
  {
    "text": "One cannot think well, love well, sleep well, if one has not dined well.",
    "src": "A Room of One's Own"
  },
  {
    "text": "What is the meaning of life? … there were little daily miracles.",
    "src": "To the Lighthouse"
  },
  {
    "text": "Nothing thicker than a knife’s blade separates happiness from melancholy.",
    "src": "Orlando"
  },
  {
    "text": "If you do not tell the truth about yourself, you cannot tell it about other people.",
    "src": "(often attributed)"
  },
  {
    "text": "I can only note that the past is beautiful…",
    "src": "(often attributed)"
  },
  {
    "text": "Some people go to priests; others to poetry; I to my friends.",
    "src": "(often attributed)"
  },
  {
    "text": "To enjoy freedom we have to control ourselves.",
    "src": "(often attributed)"
  },
  {
    "text": "I meant to write about death, only life came breaking in.",
    "src": "(often attributed)"
  },
  {
    "text": "The beauty of the world… has two edges, one of laughter, one of anguish.",
    "src": "(often attributed)"
  },
  {
    "text": "Let us read, and let us dance; these two amusements will never do any harm.",
    "src": "(often attributed)"
  },
  {
    "text": "Each had his past shut in him like the leaves of a book known to him by heart.",
    "src": "(often attributed)"
  },
  {
    "text": "For most of history, Anonymous was a woman.",
    "src": "A Room of One's Own"
  },
  {
    "text": "I can’t write… but I can read.",
    "src": "(paraphrased/attributed)"
  },
  {
    "text": "A self that goes on changing is a self that goes on living.",
    "src": "(often attributed)"
  },
  {
    "text": "Life is not a series of gig lamps symmetrically arranged; life is a luminous halo.",
    "src": "Modern Fiction"
  },
  {
    "text": "I see life far more clearly than I see myself.",
    "src": "(often attributed)"
  },
  {
    "text": "The moment was all; the moment was enough.",
    "src": "(often attributed)"
  },
  {
    "text": "The ordinary is extraordinary, if we look.",
    "src": "(in spirit of 'moments of being')"
  },
  {
    "text": "Here was one of those moments of being.",
    "src": "To the Lighthouse (phrase)"
  }
];

  function pick(){
    return QUOTES[Math.floor(Math.random()*QUOTES.length)];
  }

  function render(targetId, sourceId){
    const el = document.getElementById(targetId);
    if(!el) return;
    const srcEl = sourceId ? document.getElementById(sourceId) : null;
    const q = pick();
    el.textContent = "“" + q.text.replace(/^“|”$/g,"") + "”";
    if(srcEl) srcEl.textContent = "— Virginia Woolf · " + (q.src || "");
  }

  window.WoolfQuotes = { render, QUOTES };
})();