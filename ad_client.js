/*Connect to AD_PROxy_SERVER*/
var settings=require('../settings');
var net=require('net');
var daysofflog = require('./log');
daysofflog.init();
var port=settings.proxy_port
var host=settings.proxy_host
function Client()
{
}

Client.prototype.conn=function(sendmsg,recvmsg,callback)
{
  if(!sendmsg)
  {
    var err="send msg don't allow null";
    return callback(err,-1);
  }
   var client= new net.Socket();
   client.setEncoding('binary');
   //......
   client.connect(port,host,function(){
      client.write(sendmsg,'binary',function(){
     /* client.on('data',function(data){
         recvmsg=data;
         console.log("msg:"+recvmsg);
         cnt+=1; console.log("count:"+cnt);
         //client.pause();
         return  callback("",recvmsg);
       } );*/
      });
       var cnt =0;
       client.on('data',function(data){

           if(cnt==0)
           {
           recvmsg=data;
           console.log("msg:"+recvmsg);
           cnt+=1; console.log("count:"+cnt);
           //client.pause();
           return  callback("",recvmsg);
           }
         } );

      client.end();
    });//connect
   client.on('error',function(error){
   daysofflog.writelog("FATAL","File:server.js|Module:Client","Have Exception!",
error);
   console.log('Have Exception:'+error);
    });
   client.on('close',function(){console.log('Connection closed');
   });
};

module.exports=new Client;

//test Client
var cl=new Client;
var recvmsg="";
cl.conn("{\"username\":\"wluo\",\"password\":\"Eclipse 18^\"}",recvmsg,function(
err,recvmsg){ console.log("1222:"+recvmsg);});
