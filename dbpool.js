var settings = require('../settings');
var daysofflog = require('./log');
daysofflog.init();
var conn="tcp://"+settings.user+":"+settings.psd+"@"+settings.host+":"+settings.
port+"/"+settings.db;
var conn_cnt=settings.conn_cnt;
daysofflog.writelog("COMMON","File:db.js","Connection:"+conn+",Connection Count:
"+conn_cnt,"");

function DB()
{
  this.db=null;
  this.isok=0;
  this.isused=0;
}

DB.prototype.init=function()
{
   var PGDb = require('pg');
   this.db = new PGDb.Client(conn);
   this.db.connect();

   if (this.db!=null)
   {
    return 0;
   }
   else
   {
    return -1;
   }
};

DB.prototype.getDB=function()
{
   return this.db;
};

DB.prototype.setStatus=function(isok)
{
   this.isok=isok;
};

DB.prototype.getStatus=function()
{
   return this.isok;
};

DB.prototype.setUsed=function(isused)
{
   this.isused=isused;
};

DB.prototype.getUsed=function()
{
   return this.isused;
};

function DBPool()
{
   this.DBlist=[];
};

DBPool.prototype.init=function()
{
   for(var i=0 ; i<conn_cnt ;i++)
   {
       var db=new DB();
       var retval=db.init();
       if(retval==0)
       {
        db.setStatus(1);
       }
       this.DBlist.push(db);
    }
};

DBPool.prototype.getHandle=function()
{
   var handle=-1;
   for(var i=0 ; i<conn_cnt ;i++)
   {
    if(this.DBlist[i].getStatus() == 1 && this.DBlist[i].getUsed() == 0)
    {
       handle=i;
       this.DBlist[i].setUsed(1);
       break;
    }
   }
  return handle;
};

DBPool.prototype.releaseHandle=function(handle)
{
   return this.DBlist[handle].setUsed(0);
};

DBPool.prototype.getConn=function(handle)
{
   return this.DBlist[handle].getDB();
};

module.exports= new DBPool;