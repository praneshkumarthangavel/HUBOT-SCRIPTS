// Description:

//  Interact with your Sonarqube Server

//

// Dependencies:

//  None

//

// Configuration:

//  HUBOT_SONAR_URL

//  HUBOT_SONAR_AUTH

//

//  Auth should be in the "user:password" format.

//

// Commands:

// sonar projects -> lists all the projects

// sonar code coverage for project <Project Key> -> coverage value of the  project

// sonar last analyse of project <Project Key> -> last analyse of the project

// sonar metric values for project <Project Key> -> all the metric datas of the project

//

// Author:

// PRANESH KUMAR THANGAVEL

//

module.exports = function(robot) {
 robot.respond(/sonar projects/i, function(msg) {
        sonar_projects(robot, msg);
  });
 robot.respond(/sonar code coverage for project (.*)/i, function(msg) {
         sonar_coverage(robot, msg);
   });
 robot.respond(/sonar last analyse of project (.*)/i, function(msg) {
          sonar_analyse(robot, msg);
    });
 robot.respond(/sonar metric values for project (.*)/i, function(msg) {
           sonar_metrics(robot, msg);
     });
};

sonar_projects = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_SONAR_AUTH;
  const SERVER = process.env.HUBOT_SONAR_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/api/projects/index";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let proj = JSON.parse(body);
    let result = '';
    proj.map((projects,index) => {
      let i = index+1;
      result += i + ' ) ' + 'Project Name : ' + projects.nm + '\n' +
      'Project Key : ' + projects.k + '\n' + '\n' ;
    })
    return msg.send(result);
  });
};

sonar_coverage = function(robot, msg)
{
  const AUTH = process.env.HUBOT_SONAR_AUTH;
  const SERVER = process.env.HUBOT_SONAR_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/api/measures/component?component="+ msg.match[1] +"&metricKeys=coverage";
    return robot.http(URL).get()(function(err, res, body) {
      let coverage = JSON.parse(body).component;
      let result = '';
      coverage.measures.map((projects,index) => {
        result += 'Project Name : '+ coverage.name + '\n' +
        'Project Key : ' + projects.key + '\n' +
        'Coverage Value : ' + projects.value + '\n' + '\n';
    })
    return msg.send(result);
 });
};

sonar_analyse = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_SONAR_AUTH;
  const SERVER = process.env.HUBOT_SONAR_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/api/components/show?component="+ msg.match[1] +"";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let analyse = JSON.parse(body).component;
    let result = '';
      let displayDate = new Date(analyse.analysisDate).toString().substring(4,21);
      result += 'Project Name : ' + analyse.name + '\n' +
      'Project Key : ' + analyse.key + '\n' +
      'Last analyse date : ' + displayDate +'\n' ;
    return msg.send(result);
  });
};

sonar_metrics = function(robot, msg)
{
  const AUTH = process.env.HUBOT_SONAR_AUTH;
  const SERVER = process.env.HUBOT_SONAR_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/api/measures/component?component="+ msg.match[1] +"&metricKeys=ncloc,complexity,violations,coverage,bugs,vulnerabilities,code_smells,blocker_violations,critical_violations";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let metric = JSON.parse(body).component;
    let result = '';
      result += 'Project Name : '+ metric.name + '\n' +
      'Project Key : '+ metric.key + '\n' + '\n' ;
      metric.measures.map((projects,index) => {
      let i = index+1;
      result += i + ' ) ' +
      'Metric Name : ' + projects.metric + '\n' +
      'Metric Value : ' + projects.value +'\n' + '\n';
    })
    return msg.send(result);
  });
};

handleError = function(err, statusCode, msg)
 {
   if (err) {
  msg.send("Encountered an error: " + err);
  return;
}
if (statusCode !== 200) {
  msg.send("Request didn't come back HTTP 200");
}
};
