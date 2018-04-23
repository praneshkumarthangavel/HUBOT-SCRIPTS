// Description:

//  Interact with your Bamboo CI Server

//

// Dependencies:

//  None

//

// Configuration:

//  HUBOT_BAMBOO_URL

//  HUBOT_BAMBOO_AUTH

//

//  Auth should be in the "user:password" format.

//

// Commands:

//  bamboo projects                                -> views all projects

//  bamboo plans in project <project key>          -> views all plans in a project

//  bamboo trigger build for plan <plan key>       -> trigger a plan 

//  bamboo build status for plan <plan key>        -> all the build status of the plan

//  bamboo latest build status for plan <plan key> -> lastest build status of the plan

//

// Author:

// PRANESH KUMAR THANGAVEL

//

module.exports = function(robot) {
 robot.respond(/bamboo projects/i, {id: "bamboo.projects"}, function(msg) {
        bamboo_latest_projects(robot, msg);
  });

 robot.respond(/bamboo plans in project (.*)/, {id: "bamboo.plans"}, function(msg) {
        bamboo_project_plans(robot, msg);
  });

 robot.respond(/bamboo trigger build for plan (.*)/, {id: "bamboo.trigger"}, function(msg) {
        bamboo_trigger_plan(robot, msg);
  });

 robot.respond(/bamboo build status for plan (.*)/, {id: "bamboo.build_status_list"}, function(msg) {
        bamboo_builds(robot, msg);
  });

 robot.respond(/bamboo latest build status for plan (.*)/, {id: "bamboo.latest_build_status"}, function(msg) {
        bamboo_latest_builds(robot, msg);
  });
};


bamboo_builds = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BAMBOO_AUTH;
  const SERVER = process.env.HUBOT_BAMBOO_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/latest/result/"+msg.match[1]+".json?max-result=0&expand=results.result.artifacts&expand=changes.change.files";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let build = JSON.parse(body).results;
    let buildStatus = '';
    build.result.map((builds,index) => {
      let i = index+1;
      let started_at = new Date(builds.buildStartedTime);
      started_at = started_at.toString();
      let completed_at = new Date(builds.buildCompletedTime);
      completed_at = completed_at.toString();
      buildStatus += i + ') '+
              'Build Number : ' + builds.buildNumber + '\n' +
               'Started at : ' + started_at.substring(8,10)+'-'+started_at.substring(4,7)+'-'+started_at.substring(11,15) + '\n' +
               'Ended at : ' + completed_at.substring(8,10)+'-'+completed_at.substring(4,7)+'-'+completed_at.substring(11,15) + '\n' +
               'Build Status : '+ builds.buildState + '\n' + '\n' ;
    })
    return msg.send(buildStatus);
  });
};

bamboo_latest_builds = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BAMBOO_AUTH;
  const SERVER = process.env.HUBOT_BAMBOO_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/latest/result/"+msg.match[1]+".json?max-result=0&expand=results.result.artifacts&expand=changes.change.files";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let build = JSON.parse(body).results;
    let result = '' ;
    result += '' +
         'Build Number : ' + build.result[0].buildNumber + '\n' +
          'Started at : ' + build.result[0].buildStartedTime + '\n' +
          'Ended at : ' + build.result[0].buildCompletedTime + '\n' +
          'Build Status : ' + build.result[0].buildState + '\n' + '\n' ;
    return msg.send(result);
  });
};

bamboo_project_plans = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BAMBOO_AUTH;
  const SERVER = process.env.HUBOT_BAMBOO_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/latest/project/"+msg.match[1]+".json?expand=plans";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let build = JSON.parse(body).plans;
    let buildStatus = '';
    build.plan.map((builds,index) => {
        let i = index+1;
        buildStatus += i + ') '+
                                 'Plan Name : ' + builds.shortName + '\n' +
                                 'Plan Key : ' + builds.key + '\n' +
                                 'Enabled : ' + builds.enabled + '\n' + '\n' ;
    })
    return msg.send(buildStatus);
  });
};

bamboo_trigger_plan = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BAMBOO_AUTH;
  const SERVER = process.env.HUBOT_BAMBOO_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/latest/queue/"+msg.match[1]+".json?executeAllStages=true";
  return robot.http(URL).post()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let build = JSON.parse(body);
    let buildStatus = '' ;
    buildStatus += 'Plan Key : ' + build.planKey + '\n' +
                     'Build Number : ' + build.buildNumber + '\n' +
                     'Trigger Reason : ' + build.triggerReason + '\n' +
                     'Reference Link : ' + build.link.href + '\n' + '\n' ;
    return msg.send(buildStatus);
  });
};

bamboo_latest_projects = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BAMBOO_AUTH;
  const SERVER = process.env.HUBOT_BAMBOO_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/latest/project.json";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let build = JSON.parse(body).projects;
    let projectStatus = '';
    build.project.map((builds,index) => {
        let i = index+1;
        projectStatus += i + ') ' +
                'Project Name : ' + builds.name + '\n' +
                'Project Key : ' + builds.key + '\n' + '\n' ;
    })
    return msg.send(projectStatus);
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
