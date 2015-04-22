var dbpool = require('./db');
var daysofflog = require('./log');
dbpool.init();
daysofflog.init();

function Query() {

};
module.exports = Query;

Query.getHistory=function getHistory(user_id,role_id,manager_id,begdate,enddate,
 callback)
{
  var handle = dbpool.getHandle();
  console.log("get handle no:"+handle);
  var connn=dbpool.getConn(handle);
  var strsql="select * from daysoff_rec where status > 0 and ";
  if (role_id == 0)
  {
    strsql+=" user_id = '"+user_id+"' ";
  }
  else
  {
    strsql+=" manager_id = '"+user_id+"' ";
  }
  if(typeof begdate !== 'undefined')
  {
    strsql+=" and daysoff_start_date >= DATE '"+begdate+"' ";
  }
  if(typeof enddate !== 'undefined')
  {
    strsql+=" and daysoff_end_date <= DATE '"+enddate+"' ";
  }

  console.log(strsql);
  connn.query(strsql,function(err,result)
                          {
                            dbpool.releaseHandle(handle);
                            if(err)
                            {
                              daysofflog.writelog("FATAL","File:dbaccess.js|Modu
le:Query|Func:getHistory",strsql,err);
                              var jsonerr=JSON.stringify(err)+"";
                              return callback(jsonerr);
                            }
                            console.log(result);
                            var jsonres=JSON.stringify(result.rows)+"";
                            callback(err,jsonres);
                          }
  ); //end connn.query

};



Query.InsertNewVacation=function InsertNewVacation(user_id,manager_id,startdate,
enddate,reason,callback)
{
  var handle = dbpool.getHandle();
  console.log("get handle no:"+handle);
  var connn=dbpool.getConn(handle);
  /*var strsql="insert into  daysoff_rec values (default,$1,$2,$3,current_timest
amp(0),1,$4,$5)";*/
  var strsql="insert into  daysoff_rec values (default,'"+user_id+"',date '"+sta
rtdate+"',"+" date '"+enddate+"', current_timestamp(0),1,'"+manager_id+"','" +re
ason +"')";
  /*var fillvariable="['"+user_id+"',date '"+startdate+"',"+"date '"+enddate+"',
'"+manager_id+"','" +reason +"']";*/
  console.log("strsql:"+strsql);
  //console.log("fillvariable:"+fillvariable);
  connn.query(strsql,/*fillvariable,*/function(err,result)
                       {
                            dbpool.releaseHandle(handle);
                            if(err)
                            {
                               daysofflog.writelog("FATAL","File:dbaccess.js|Mod
ule:Query|Func:InsertNewVacation",strsql,err);
                              //var jsonerr=JSON.stringify(err)+"";
                               return callback(err+"");
                            }
                            var jsonres=JSON.stringify(result)+"";
                            callback(err,jsonres);
                          }
  );
};//end InsertNewVacation
