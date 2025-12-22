
/**
 * 柴窝之家 · weather.js (shared)
 * - Open-Meteo current weather (no API key)
 * - Uses browser geolocation (with graceful fallback)
 * - Always paints border weather FX, and updates widget if present:
 *   #wxIcon #wxPlace #wxDesc
 */
(function(){
  const pad2 = (n)=>String(n).padStart(2,"0");

  const WMO = {
    sunny:  [0],
    cloudy: [1,2,3],
    fog:    [45,48],
    drizzle:[51,53,55,56,57],
    rain:   [61,63,65,66,67,80,81,82],
    snow:   [71,73,75,77,85,86],
    storm:  [95,96,99],
  };

  function classifyWmo(code){
    for(const k of Object.keys(WMO)){
      if(WMO[k].includes(code)) return k;
    }
    return "cloudy";
  }

  function emoji(kind){
    return ({
      sunny:"☀️", cloudy:"☁️", fog:"🌫️",
      drizzle:"🌦️", rain:"🌧️", snow:"🌨️", storm:"⛈️"
    })[kind] || "☁️";
  }

  function text(kind, tC){
    const base = ({
      sunny:"晴朗", cloudy:"多云", fog:"有雾",
      drizzle:"小雨", rain:"下雨", snow:"下雪", storm:"雷雨"
    })[kind] || "多云";
    if(typeof tC==="number") return `${base} · ${Math.round(tC)}°C`;
    return base;
  }

  async function getWeather(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const r = await fetch(url);
    if(!r.ok) throw new Error("Open-Meteo 请求失败");
    const j = await r.json();
    const t = j?.current?.temperature_2m;
    const c = j?.current?.weather_code;
    return { tempC: t, code: c, kind: classifyWmo(c) };
  }

  async function reverseGeo(lat, lon){
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=zh&count=1`;
    const r = await fetch(url);
    if(!r.ok) return null;
    const j = await r.json();
    const p = j?.results?.[0];
    if(!p) return null;
    const city = p.name || "";
    const admin = p.admin1 || "";
    const country = p.country || "";
    const place = [city, admin, country].filter(Boolean).join(" · ");
    return place || null;
  }

  function applyBorderFx(kind){
    const layer = document.querySelector(".border-layer .weather-fx");
    if(!layer) return;
    layer.innerHTML = "";

    const fx = document.createElement("div");
    fx.className = "fx";
    fx.textContent = emoji(kind);

    const spots = [
      {top:"14px", left:"16px"},
      {top:"14px", right:"16px"},
      {bottom:"14px", left:"16px"},
      {bottom:"14px", right:"16px"}
    ];
    spots.forEach((s,i)=>{
      const e = fx.cloneNode(true);
      e.style.animationDelay = (i*0.6)+"s";
      Object.assign(e.style, s);
      layer.appendChild(e);
    });

    if(kind==="rain" || kind==="drizzle"){
      for(let i=0;i<6;i++){
        const drop = document.createElement("div");
        drop.className="fx";
        drop.textContent="💧";
        drop.style.left = (10 + i*14) + "%";
        drop.style.top = (8 + (i%2)*6) + "px";
        drop.style.animationDuration = (5 + (i%3)) + "s";
        drop.style.opacity = ".7";
        layer.appendChild(drop);
      }
    }
    if(kind==="snow"){
      for(let i=0;i<6;i++){
        const fl = document.createElement("div");
        fl.className="fx";
        fl.textContent="❄️";
        fl.style.left = (12 + i*13) + "%";
        fl.style.bottom = (8 + (i%2)*6) + "px";
        fl.style.animationDuration = (6 + (i%3)) + "s";
        fl.style.opacity = ".7";
        layer.appendChild(fl);
      }
    }
  }

  async function init(){
    const iconEl = document.getElementById("wxIcon");
    const placeEl = document.getElementById("wxPlace");
    const descEl = document.getElementById("wxDesc");

    function setWidget(icon, place, desc){
      if(iconEl) iconEl.textContent = icon;
      if(placeEl) placeEl.textContent = place;
      if(descEl) descEl.textContent = desc;
    }

    function fallback(){
      setWidget("🌿","未开启定位","可在浏览器开启定位后刷新");
      applyBorderFx("cloudy");
    }

    if(!navigator.geolocation){
      fallback(); return;
    }

    navigator.geolocation.getCurrentPosition(async (pos)=>{
      try{
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const [place, w] = await Promise.all([
          reverseGeo(lat,lon),
          getWeather(lat,lon)
        ]);
        document.body.dataset.weather = w.kind;
        applyBorderFx(w.kind);
        setWidget(emoji(w.kind), place || "当前位置", text(w.kind, w.tempC));
      }catch(e){
        setWidget("🌿","天气获取失败","网络/服务异常，可稍后刷新");
        applyBorderFx("cloudy");
      }
    }, fallback, { enableHighAccuracy:false, timeout: 8000, maximumAge: 120000 });
  }

  window.ChaiWeather = { init };
  document.addEventListener("DOMContentLoaded", init);
})();
