const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
(async () => {
 const start=Date.now(), folder=__dirname, browser=await chromium.launch({headless:true}), page=await browser.newPage({viewport:{width:1100,height:800}}),errors=[],results=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(folder,'generated.html')).href);
 const step=()=>page.locator('.nt-trial').getAttribute('data-step');
 const check=(name,pass,detail)=>results.push({name,pass,detail});
 check('initial state',await step()==='1');
 await page.locator('.nt-trial').focus();await page.keyboard.press('ArrowRight');check('focused right key',await step()==='2');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(let n=1;n<=7;n++){
   if(n>2)await page.locator('.nt-next').click();
   if(n===1)await page.locator('[data-phase="0"]').click();
   if(n===2)await page.locator('.nt-next').click();
   check('step '+n,await step()===String(n));
   await page.screenshot({path:path.join(folder,`desktop-${n}.png`)});
 }
 check('finite end',await page.locator('.nt-next').isHidden());
 await page.locator('[data-phase="0"]').click();check('Entrada goes to step 1',await step()==='1');
 await page.locator('[data-phase="4"]').click();
 const counts=await page.locator('.nt-count').allTextContents();
 const expected=[-1.2,-.4,.7,2.4,1.8,.3],sum=expected.reduce((s,n)=>s+Math.exp(n),0);
 check('softmax',counts.every((c,i)=>Math.abs(parseFloat(c)-Math.exp(expected[i])/sum*100)<.051),counts);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-phase="5"]').click();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);check('dynamic reduced motion resolves selection',await page.locator('.nt-selection-phrase u').textContent()==='perro');
 await page.locator('[data-phase="3"]').click();check('network node counts',await page.locator('.nt-node').count()===26);check('four transposed rows',await page.locator('.nt-row').count()===4);
 const geometry=await page.locator('.nt-node').evaluateAll(nodes=>{const a=[0,1,2,3].map(l=>nodes.filter(n=>n.classList.contains('nt-layer-'+l)).map(n=>+n.getAttribute('cy')));return a.map(v=>({n:v.length,center:(v[0]+v.at(-1))/2,gaps:v.slice(1).map((n,i)=>n-v[i])}));});check('network centered equal gaps',geometry.every(l=>l.center===150&&l.gaps.every(n=>n===29)),geometry);
 await page.locator('.nt-trial').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');check('rapid keys count',await step()==='5');
 for(const width of [320,375]){
  await page.setViewportSize({width,height:800});
  for(let p=0;p<6;p++){
   await page.locator(`[data-phase="${p}"]`).click();
   const bounds=await page.locator('.nt-phase,.nt-expand,.nt-progress,.nt-explanation,.nt-nav:not([hidden])').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {cls:n.className,x:r.x,right:r.right,y:r.y,bottom:r.bottom};}));
   check(`bounds ${width} phase ${p}`,bounds.every(r=>r.x>=0&&r.right<=width+.5&&r.y>=0&&r.bottom<=800),bounds);
   if(p===2||p===3||p===5)await page.screenshot({path:path.join(folder,`narrow-${width}-${p+1}.png`)});
  }
 }
 await page.setViewportSize({width:812,height:375});await page.locator('.nt-expand').click();check('expand locks body',await page.evaluate(()=>document.body.style.overflow==='hidden'));
 await page.screenshot({path:path.join(folder,'short-fullscreen.png')});
 check('short full close reachable',await page.locator('.nt-expand').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}));
 await page.keyboard.press('Escape');check('Escape restores',await page.locator('.nt-expand').getAttribute('aria-pressed')==='false'&&await page.evaluate(()=>document.body.style.overflow===''));
 await page.setViewportSize({width:1100,height:800});await page.emulateMedia({colorScheme:'dark'});await page.locator('[data-phase="4"]').click();await page.screenshot({path:path.join(folder,'dark.png')});
 await page.locator('.nt-expand').click();await page.locator('.nt-expand').click();check('button closes',await page.locator('.nt-expand').getAttribute('aria-pressed')==='false');
 await page.evaluate(()=>{document.body.style.overflow='auto';document.querySelector('.nt-expand').click();document.querySelector('.nt-trial').remove();});await page.waitForTimeout(100);check('removal restores prior overflow',await page.evaluate(()=>document.body.style.overflow==='auto'));
 check('no browser errors',errors.length===0,errors);
 const report={seconds:(Date.now()-start)/1000,results,errors};fs.writeFileSync(path.join(folder,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({seconds:report.seconds,passed:results.filter(x=>x.pass).length,failed:results.filter(x=>!x.pass),errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
