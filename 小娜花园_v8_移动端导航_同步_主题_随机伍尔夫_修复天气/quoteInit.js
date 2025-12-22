(function(){
  document.addEventListener("DOMContentLoaded", ()=>{
    try{
      if(window.WoolfQuotes && window.WoolfQuotes.render){
        window.WoolfQuotes.render("woolfQuote","woolfQuoteSource");
      }
    }catch(_){}
  });
})();