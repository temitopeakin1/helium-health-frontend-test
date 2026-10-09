export const accounts=[
  {label:'North / Alex (employee)',tenant:'north',actor:'alex',role:'employee'},
  {label:'North / Pat (manager)',tenant:'north',actor:'pat',role:'manager'},
  {label:'South / Kim (manager)',tenant:'south',actor:'kim',role:'manager'}
];
const fail=(status,message)=>({status,message});
export function createApi(){
  let rows=[{id:'1',tenant:'north',actor:'alex',title:'Desk',status:'pending'},
    {id:'2',tenant:'north',actor:'sam',title:'Chair',status:'pending'},
    {id:'1',tenant:'south',actor:'lee',title:'Monitor',status:'pending'}];
  let next=3;const keys=new Map();let failure=null;
  const auth=c=>{if(!accounts.some(a=>a.tenant===c?.tenant&&a.actor===c.actor&&a.role===c.role))throw fail(403,'Access denied');};
  const finish=(context,operation)=>{
    const c={...context};const injected=failure;failure=null;
    return new Promise((resolve,reject)=>setTimeout(()=>{
      try{auth(c);if(injected)throw injected;resolve(structuredClone(operation(c)));}catch(e){reject(e);}
    },c.tenant==='north'?650:100));
  };
  return {
    failNext(status=503){failure=fail(status,status===422?'Enter a more specific title':'Service unavailable');},
    list(c){return finish(c,a=>({records:rows.filter(r=>r.tenant===a.tenant&&(a.role==='manager'||r.actor===a.actor))}));},
    create(c,title,key){return finish(c,a=>{
      if(typeof title!=='string'||!title.trim()||title.trim().length>120)throw fail(422,'Title must be 1-120 characters');
      if(!key)throw fail(422,'Missing request key');
      const scope=JSON.stringify([a.tenant,a.actor,key]);const previous=keys.get(scope);
      if(previous){if(previous.title!==title.trim())throw fail(409,'Request key already used');return previous;}
      const row={id:String(next++),tenant:a.tenant,actor:a.actor,title:title.trim(),status:'pending'};
      rows.push(row);keys.set(scope,row);return row;
    });},
    approve(c,id){return finish(c,a=>{
      if(a.role!=='manager')throw fail(403,'Managers only');
      const row=rows.find(r=>r.tenant===a.tenant&&r.id===id);if(!row)throw fail(404,'Request not found');
      row.status='approved';return row;
    });}
  };
}
export const api=createApi();
// For manual error checks: call workplaceApi.failNext(503) or failNext(422) in DevTools.
if(typeof window!=='undefined')window.workplaceApi=api;
