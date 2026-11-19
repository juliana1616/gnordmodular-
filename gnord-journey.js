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

  // Contextual return to the exact viewport the visitor left, not just the section top.
  const contact=document.getElementById('work-with-us');
  const returnNav=document.getElementById('gn-return-nav');
  const returnButton=document.getElementById('gn-return-button');
  let returnContext=null;
  function scrollMode(){
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
  }
  if(contact && returnNav && returnButton){
    document.querySelectorAll('a[data-gn-return-label][href="#work-with-us"]').forEach(link=>{
      link.addEventListener('click',event=>{
        event.preventDefault();
        returnContext={
          scrollTop:window.scrollY,
          sourceUrl:window.location.pathname+window.location.search+window.location.hash,
          sourceLink:link,
          label:link.dataset.gnReturnLabel || 'Previous Section'
        };
        returnButton.textContent='← Back to '+returnContext.label;
        returnButton.setAttribute('aria-label','Return to '+returnContext.label);
        returnNav.hidden=false;
        window.history.pushState({gnEnquiryReturn:true},'', '#work-with-us');
        contact.scrollIntoView({behavior:scrollMode(),block:'start'});
      });
    });
    returnButton.addEventListener('click',()=>{
      if(!returnContext)return;
      const previous=returnContext;
      returnContext=null;
      returnNav.hidden=true;
      window.history.replaceState(null,'',previous.sourceUrl);
      previous.sourceLink.focus({preventScroll:true});
      window.scrollTo({top:previous.scrollTop,behavior:scrollMode()});
    });
    window.addEventListener('popstate',()=>{
      if(window.location.hash!=='#work-with-us'){
        returnNav.hidden=true;
        returnContext=null;
      }
    });
  }

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