const { createRequire } = require('node:module');
const assert = require('node:assert/strict');
const req = createRequire(require('node:path').resolve(__dirname, '../package.json'));
req('dotenv').config({path:require('node:path').resolve(__dirname, '../.env'),quiet:true});
const mongoose=req('mongoose');
const User=req('./src/models/user');
const Connection=req('./src/models/connectionRequest');
const Message=req('./src/models/message');
const app=req('./src/app');
const crypto=require('node:crypto');
const emails=['a','b','c'].map(x=>`codex-test-${crypto.randomUUID()}-${x}@example.com`);
const password=crypto.randomBytes(18).toString('hex')+'aA!1';
let ids=[];
const server=app.listen(0,'127.0.0.1',async()=>{
 const base=`http://127.0.0.1:${server.address().port}`;
 const call=async(path,method='GET',cookie,body)=>{
  const response=await fetch(base+path,{method,headers:{...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const raw=await response.text(); let data;try{data=JSON.parse(raw)}catch{data=raw}
  return {status:response.status,data,cookie:response.headers.get('set-cookie')?.split(';')[0]};
 };
 try {
  for(const emailId of emails) assert.equal((await call('/signup','POST',null,{firstName:'CodexTest',lastName:'Temporary',emailId,password})).status,200);
  const sessions=[];
  for(const emailId of emails){const result=await call('/login','POST',null,{emailId,password});assert.equal(result.status,200);assert.ok(!result.data.password);sessions.push(result);ids.push(result.data._id)}
  const [a,b,c]=sessions;
  assert.equal((await call('/profile/view','GET',a.cookie)).data._id,ids[0]);
  assert.ok((await call('/feed?page=1&limit=40','GET',a.cookie)).data.data.some(u=>u._id===ids[1]));
  assert.equal((await call(`/chat/${ids[1]}`,'POST',a.cookie,{text:'not connected'})).status,403);
  const sent=await call(`/request/send/interested/${ids[1]}`,'POST',a.cookie,{});assert.equal(sent.status,200);
  const requestId=sent.data.data._id;
  assert.ok((await call('/user/requests/received','GET',b.cookie)).data.data.some(r=>r._id===requestId));
  assert.equal((await call(`/request/review/accepted/${requestId}`,'POST',a.cookie,{})).status,404);
  assert.equal((await call(`/request/review/accepted/${requestId}`,'POST',b.cookie,{})).status,200);
  for(const [session,peer] of [[a,ids[1]],[b,ids[0]]]) assert.ok((await call('/user/connections','GET',session.cookie)).data.data.some(u=>u._id===peer));
  assert.equal((await call(`/chat/${ids[1]}`,'POST',a.cookie,{text:'Hello from A'})).status,201);
  assert.equal((await call(`/chat/${ids[0]}`,'POST',b.cookie,{text:'Hello from B'})).status,201);
  for(const [session,peer] of [[a,ids[1]],[b,ids[0]]]) assert.deepEqual((await call(`/chat/${peer}`,'GET',session.cookie)).data.data.map(m=>m.text),['Hello from A','Hello from B']);
  assert.equal((await call(`/chat/${ids[0]}`,'GET',c.cookie)).status,403);
  assert.equal((await call(`/chat/${ids[1]}`)).status,401);
  assert.equal((await call('/logout','POST',a.cookie,{})).status,200);
  assert.equal((await call('/profile/view')).status,401);
  console.log('PASS live MongoDB: three signups/logins, profile, feed, request creation/inbox/acceptance, sender cannot accept own request, connections both ways, two-way saved chat history, outsider/anonymous blocked, logout.');
 }catch(e){console.error(e);process.exitCode=1}
 finally{
  try{const users=await User.find({emailId:{$in:emails}}).select('_id');const testIds=users.map(u=>u._id);
   await Message.deleteMany({$or:[{senderId:{$in:testIds}},{recipientId:{$in:testIds}}]});
   await Connection.deleteMany({$or:[{fromUserId:{$in:testIds}},{toUserId:{$in:testIds}}]});
   await User.deleteMany({_id:{$in:testIds}});console.log('Temporary test accounts, requests and messages removed.');
  }finally{server.close();await mongoose.disconnect()}
 }
});

