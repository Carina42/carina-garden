(function(){
  const $ = (id)=>document.getElementById(id);

  const PREFIXES = ["chai_", "xng_"]; // keep backward compat + future
  function isOurKey(k){ return PREFIXES.some(p=>k.startsWith(p)); }

  function collect(){
    const out = {};
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(!k) continue;
      if(isOurKey(k)) out[k] = localStorage.getItem(k);
    }
    return out;
  }

  function applyDump(dump){
    if(!dump || typeof dump!=="object") throw new Error("bad_dump");
    const data = dump.data || dump; // allow raw map
    Object.keys(data).forEach(k=>{
      if(!isOurKey(k)) return;
      const v = data[k];
      if(typeof v === "string") localStorage.setItem(k, v);
    });
  }

  function download(filename, text){
    const blob = new Blob([text], {type:"application/json;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1500);
  }

  function toSyncCode(obj){
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)));
  }
  function fromSyncCode(code){
    const json = decodeURIComponent(escape(atob(code.trim())));
    return JSON.parse(json);
  }

  function ensureSyncUI(){
    const openBtn = $("syncOpen");
    const modal = $("syncModal");
    if(!openBtn || !modal) return;

    const closeBtn = $("syncClose");
    const exportBtn = $("syncExport");
    const importFile = $("syncImportFile");
    const importBtn = $("syncImportBtn");
    const codeBox = $("syncCode");
    const copyBtn = $("syncCopy");
    const pasteBtn = $("syncPasteBtn");

    function open(){ modal.classList.add("show"); }
    function close(){ modal.classList.remove("show"); }

    openBtn.addEventListener("click", open);
    closeBtn && closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e)=>{ if(e.target===modal) close(); });

    exportBtn && exportBtn.addEventListener("click", ()=>{
      const dump = { version:1, ts: new Date().toISOString(), data: collect() };
      const name = `xiaona-garden-backup-${dump.ts.slice(0,10)}.json`;
      download(name, JSON.stringify(dump, null, 2));
      if(codeBox){
        codeBox.value = toSyncCode(dump);
      }
    });

    copyBtn && copyBtn.addEventListener("click", async ()=>{
      if(!codeBox) return;
      try{
        await navigator.clipboard.writeText(codeBox.value || "");
        copyBtn.textContent = "✅ 已复制";
        setTimeout(()=>copyBtn.textContent="复制同步码", 1200);
      }catch(_){
        copyBtn.textContent = "复制失败";
        setTimeout(()=>copyBtn.textContent="复制同步码", 1200);
      }
    });

    importBtn && importBtn.addEventListener("click", ()=>{
      const f = importFile && importFile.files && importFile.files[0];
      if(!f) return alert("先选择一个备份文件（.json）");
      const reader = new FileReader();
      reader.onload = ()=>{
        try{
          const obj = JSON.parse(String(reader.result || "{}"));
          applyDump(obj);
          alert("✅ 导入完成！页面将刷新以应用数据。");
          location.reload();
        }catch(err){
          alert("导入失败：文件格式不正确。");
        }
      };
      reader.readAsText(f, "utf-8");
    });

    pasteBtn && pasteBtn.addEventListener("click", ()=>{
      if(!codeBox) return;
      try{
        const obj = fromSyncCode(codeBox.value || "");
        applyDump(obj);
        alert("✅ 同步码导入完成！页面将刷新。");
        location.reload();
      }catch(_){
        alert("同步码无效。请确认粘贴完整。");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", ensureSyncUI);
})();