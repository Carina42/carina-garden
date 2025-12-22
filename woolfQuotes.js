/**
 * 小娜花园 · Woolf Quotes (English Edition)
 * Focus: Authentic English quotes with original sources.
 */
window.WoolfQuotes = (function() {
  const QUOTES = [
    { text: "No need to hurry. No need to sparkle. No need to be anybody but oneself.", src: "A Room of One's Own" },
    { text: "I am rooted, but I flow.", src: "The Waves" },
    { text: "Nothing has really happened until it has been described.", src: "A Writer's Diary" },
    { text: "One cannot think well, love well, sleep well, if one has not dined well.", src: "A Room of One's Own" },
    { text: "Life is not a series of gig lamps symmetrically arranged; life is a luminous halo.", src: "Modern Fiction" },
    { text: "Each had his past shut in him like the leaves of a book known to him by heart.", src: "The Waves" },
    { text: "The beauty of the world, which is so soon to perish, has two edges, one of laughter, one of anguish, cutting the heart asunder.", src: "A Room of One's Own" },
    { text: "For most of history, Anonymous was a woman.", src: "A Room of One's Own" },
    { text: "Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.", src: "A Room of One's Own" },
    { text: "The moment was all; the moment was enough.", src: "To the Lighthouse" },
    { text: "Language is wine upon the lips.", src: "The Death of the Moth" },
    { text: "I have a deeply checky desire to say what I feel, even if it is not reasonable.", src: "The Voyage Out" }
  ];

  function getOne() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }

  function render(textId = 'woolfQuote', srcId = 'woolfQuoteSource') {
    const q = getOne();
    const tEl = document.getElementById(textId);
    const sEl = document.getElementById(srcId);
    
    if (tEl) {
      tEl.style.opacity = 0;
      setTimeout(() => {
        tEl.textContent = q.text;
        tEl.style.opacity = 1;
      }, 300);
    }
    if (sEl) {
      sEl.textContent = `— ${q.src}`;
    }
  }

  // Auto-init on load
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('woolfQuote')) render();
  });

  return { refresh: render };
})();
