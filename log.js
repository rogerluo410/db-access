var settings = require('../settings');
var fs = require('fs');
//define log level
var debug=0;
var common=1;
var fatal=2;

function Daysofflog()
{
  this.Logfile=null;
  this.openstat=0;
};

module.exports = Daysofflog;

Daysofflog.init=function init()
{
  this.Logfile = fs.createWriteStream(settings.log_addr+'daysoff.log',    {flags
: 'a'});
};

Daysofflog.writelog=function writelog(level,where,dowhat,err)
{
  var meta ='[' + level + '] ' + '[' + new Date() + '] ' + '[' + where +
 '->'+ dowhat + '] ' + err + '\n';
    this.Logfile.write(meta);
};
