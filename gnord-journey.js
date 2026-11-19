/* GNORD review preview: six-stage journey and Project Essentials dialogs. */
(function(){
  const root=document.getElementById('gnord-journey');
  if(!root)return;
  const tabs=Array.from(root.querySelectorAll('[data-gn-step]'));
  const panels=Array.from(root.querySelectorAll('.gn-step-panel'));
  let active=-1;
  function activate(i,focus){
    active=i;
    tabs.forEach((tab,j)=>{
      const selected=j===i;
      tab.setAttribute('aria-selected',String(selected));
      tab.setAttribute('aria-expanded',String(selected));
      tab.tabIndex=selected?0:-1;
    });
    panels.forEach((panel,j)=>{panel.hidden=j!==i});
    if(focus)tabs[i].focus();
  }
  function collapse(){
    const previous=active;
    active=-1;
    tabs.forEach(tab=>{
      tab.setAttribute('aria-selected','false');
      tab.setAttribute('aria-expanded','false');
      tab.tabIndex=0;
    });
    panels.forEach(panel=>{panel.hidden=true});
    if(previous>=0)tabs[previous].focus();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(i,false));
    tab.addEventListener('keydown',e=>{
      let j=null;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')j=(i+1)%tabs.length;
      if(e.key==='ArrowLeft'||e.key==='ArrowUp')j=(i+tabs.length-1)%tabs.length;
      if(e.key==='Home')j=0;
      if(e.key==='End')j=tabs.length-1;
      if(j!==null){e.preventDefault();activate(j,true)}
    });
  });
  root.querySelectorAll('[data-gn-stage-close]').forEach(btn=>btn.addEventListener('click',collapse));
  activate(0,false);

  const dialogs=Array.from(root.querySelectorAll('dialog.gn-dialog'));
  root.querySelectorAll('[data-gn-term-open]').forEach(button=>{
    button.addEventListener('click',()=>{
      const dialog=document.getElementById(button.getAttribute('data-gn-term-open'));
      if(!dialog)return;
      if(typeof dialog.showModal==='function')dialog.showModal();
      else dialog.setAttribute('open','');
    });
  });
  dialogs.forEach(dialog=>{
    dialog.querySelectorAll('[data-gn-close]').forEach(btn=>btn.addEventListener('click',()=>{
      if(typeof dialog.close==='function')dialog.close();
      else dialog.removeAttribute('open');
    }));
    dialog.addEventListener('click',e=>{
      if(e.target===dialog){
        const rect=dialog.getBoundingClientRect();
        if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom){
          if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');
        }
      }
    });
  });
})();