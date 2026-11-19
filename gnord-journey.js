/* GNORD preview: six-step timeline, policy dialogs, and enquiry intent selector. */
(function(){
  const root=document.getElementById('gnord-journey');
  if(!root)return;
  const tabs=Array.from(root.querySelectorAll('[data-gn-step]'));
  const panels=Array.from(root.querySelectorAll('.gn-step-panel'));
  function activate(i,focus){
    tabs.forEach((tab,j)=>{
      const selected=j===i;
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    });
    panels.forEach((panel,j)=>{panel.hidden=j!==i});
    if(focus)tabs[i].focus();
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
  const sourcing=document.getElementById('gnord-sourcing');
  if(sourcing){
    const opts=Array.from(sourcing.querySelectorAll('[data-gn-scope]'));
    const note=sourcing.querySelector('#gn-scope-current');
    const link=sourcing.querySelector('#gn-scope-whatsapp');
    const scopes=[
      {name:'GNORD-manufactured cabinetry',detail:'Custom kitchens, wardrobes and modular cabinetry — designed and manufactured by GNORD.'},
      {name:'Coordinated interior materials',detail:'Selected stone, tiles, vanity and related materials through specialist manufacturing partners.'},
      {name:'Related GNORD businesses',detail:'Explore windows or hospitality interiors with related GNORD specialist businesses; responsibilities are defined for each scope.'}
    ];
    function select(i){
      opts.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      note.textContent=scopes[i].detail;
      const message='Hello, I found GNORD through your website. I would like to discuss '+scopes[i].name.toLowerCase()+'. My project is in [city/country]. Please advise next steps.';
      link.href='https://wa.me/8617589868573?text='+encodeURIComponent(message);
    }
    opts.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
    select(0);
  }
})();