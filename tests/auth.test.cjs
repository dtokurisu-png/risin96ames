const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const frontend = fs.readFileSync(path.join(__dirname,'../src/auth/r96-native-auth.js'),'utf8');
function ui({standalone=false}={}) {
  const handlers={}, sent=[], timers=new Map(); let timerId=0;
  const fields={};
  const element=()=>({textContent:'',disabled:false,hidden:true,dataset:{},setAttribute(){},addEventListener(type,fn){this[type]=fn;},querySelector(s){return fields[s]??=(element());}});
  const account=element(), hero=element(), notice=element();
  const parent={postMessage(message,origin){sent.push({message,origin});}};
  const window={parent,addEventListener(type,fn){handlers[type]=fn;}};
  if(standalone)window.parent=window;
  const context={window,document:{readyState:'complete',querySelector(s){return s==='.r96-account-visual'?account:s==='#r96-login'?hero:notice;}},setTimeout(fn,delay){const id=++timerId;timers.set(id,{fn,delay});return id;},clearTimeout(id){timers.delete(id);}};
  vm.runInNewContext(frontend,context);
  const receive=(status, extra={}, origin='https://dtokurisu.wixstudio.com',source=parent)=>handlers.message({source,origin,data:{source:'r96-wix-auth',protocol:1,requestId:sent.at(-1)?.message.requestId,sequence:1,status,...extra}});
  const expire=delay=>{for(const [id,t] of [...timers])if(t.delay===delay){timers.delete(id);t.fn();}};
  return {account,hero,notice,sent,receive,expire,handlers};
}
test('both controls recover after cancellation; hero is not looked up by changing text',()=>{
 const u=ui();u.receive('signedOut');u.hero.click();assert.equal(u.hero.disabled,true);
 u.receive('signedOut',{sequence:2});assert.equal(u.hero.textContent,'Iniciar sesión');assert.equal(u.hero.disabled,false);assert.equal(u.account.disabled,false);
});
test('missing host times out with visible explanation and allows a fresh handshake',()=>{
 const u=ui();u.expire(12000);assert.equal(u.account.dataset.r96AuthState,'error');assert.equal(u.notice.hidden,false);
 u.account.click();assert.equal(u.sent.at(-1).message.requestId,2);u.receive('signedOut');assert.equal(u.hero.disabled,false);
});
test('direct GitHub Pages gives an explanation instead of a nonfunctional login',()=>{
 const u=ui({standalone:true});assert.equal(u.account.dataset.r96AuthState,'error');assert.match(u.notice.textContent,/Wix/);assert.equal(u.sent.length,0);
});
test('spoofed origins, windows, protocol and stale requests cannot sign in',()=>{
 const u=ui();u.receive('signedIn',{member:{id:'bad'}},'https://evil.test');u.receive('signedIn',{member:{id:'bad'}},undefined,{});
 u.receive('signedIn',{member:{id:'bad'},protocol:2});u.receive('signedIn',{member:{id:'bad'},requestId:0});assert.equal(u.account.dataset.r96AuthState,'connecting');
});
test('stale boot state cannot overwrite an active login',()=>{
 const u=ui();u.receive('signedOut');u.hero.click();u.receive('signedOut',{sequence:2,requestId:1});assert.equal(u.account.dataset.r96AuthState,'signingIn');
 u.receive('signedIn',{sequence:3,member:{id:'1',displayName:'Jugador'}});u.receive('signedOut',{sequence:2});assert.equal(u.account.dataset.r96AuthState,'signedIn');
});
test('no response to a login request is recoverable',()=>{
 const u=ui();u.receive('signedOut');u.hero.click();u.expire(12000);assert.equal(u.hero.disabled,false);assert.equal(u.account.dataset.r96AuthState,'error');
});
