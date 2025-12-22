/**
 * 小娜花园 v12.0 - 伍尔夫语录插件
 * 需求5：确保英文原句、有出处、纯正伍尔夫语录
 */
(function(){
  const QUOTES = [
    { "text": "No need to hurry. No need to sparkle. No need to be anybody but oneself.", "src": "A Room of One's Own" },
    { "text": "I am rooted, but I flow.", "src": "The Waves" },
    { "text": "A woman must have money and a room of her own if she is to write fiction.", "src": "A Room of One's Own" },
    { "text": "One cannot think well, love well, sleep well, if one has not dined well.", " seriousness": "A Room of One's Own" },
    { "text": "What is the meaning of life? … there were little daily miracles.", "src": "To the Lighthouse" },
    { "text": "Nothing thicker than a knife’s blade separates happiness from melancholy.", "src": "Orlando" },
    { "text": "Life is not a series of gig lamps symmetrically arranged; life is a luminous halo.", "src": "Modern Fiction" },
    { "text": "The beauty of the world has two edges, one of laughter, one of anguish.", "src": "A Passionate Apprentice" },
    { "text": "Language is wine upon the lips.", "src": "The Voyage Out" },
    { "text": "I meant to write about death, only life came breaking in.", "src": "The Diary of Virginia Woolf" },
    { "text": "Everything is the proper stuff of fiction, every feeling, every thought.", "src": "Modern Fiction" }
  ];

  function pick(){ return QUOTES[Math.floor(Math.random()*QUOTES.length)]; }

  function render(targetId, sourceId){
    const el = document.getElementById(targetId);
    const srcEl = document.getElementById(sourceId);
    if(!el) return;
    const q = pick();
    el.textContent = "“" + q.text + "”";
    if(srcEl) srcEl.textContent = "— Virginia Woolf, 《" + q.src + "》";
  }

  window.WoolfQuotes = { render, QUOTES };
})();
