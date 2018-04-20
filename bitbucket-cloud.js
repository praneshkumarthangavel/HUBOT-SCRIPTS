// Description:

//  Interact with your Bitbucket Cloud

//

// Dependencies:

//  None

//

// Configuration:

//  HUBOT_BITBUCKET_CLOUD_URL

//  HUBOT_BITBUCKET_CLOUD_AUTH

//

//  Auth should be in the "user:password" format.

//

// Commands:

//   bitbucket repo details                          -> all the details about repos

//   bitbucket repo watcher details for <repo name>  -> person who has access to the repo

//   bitbucket branch details for <repo name>        -> branch details of a repo

//   bitbucket repo issues for <repo name>           -> issues in a repo

//   bitbucket latest commit for <repo name>         -> latest commit in repo

//   bitbucket pullrequest for <repo name>           -> pullrequest status of repo

//

// Author:

//   PRANESH KUMAR THANGAVEL

//


module.exports = function(robot)
 {
  robot.respond(/bitbucket repo details/, function(msg)
  {
    repoDetails(robot, msg);
  });

  robot.respond(/bitbucket repo watcher details for (.*)/, function(msg)
  {
    watcherDetails(robot, msg);
  });

  robot.respond(/bitbucket branch details for (.*)/, function(msg)
  {
    branchDetails(robot, msg);
  });

  robot.respond(/bitbucket repo issues for (.*)/, function(msg)
  {
    issueDetails(robot, msg);
  });

  robot.respond(/bitbucket pullrequest for (.*)/, function(msg)
  {
    pullrequests(robot, msg);
  });

  robot.respond(/bitbucket latest commit for (.*)/, function(msg)
  {
    latest_commit(robot, msg);
  });
};

repoDetails = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BITBUCKET_CLOUD_AUTH;
  const SERVER = process.env.HUBOT_BITBUCKET_CLOUD_URL;
  const USERNAME = AUTH.split(':')[0];
  const URL = "https://" + AUTH + "@"+ SERVER +"/api/2.0/repositories/" + USERNAME + "?pagelen=20";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let details = JSON.parse(body);
    let repoDetails = '';
    details.values.map((params,index) => {
      let i = index+1;
      let created_on = new Date(params.created_on);
      created_on = created_on.toString();
      let updated_on = new Date(params.updated_on);
      updated_on = updated_on.toString();
      repoDetails += i + ') '+ "Repository name : " + params.name + '\n' +
                                "Owner name : "+ params.owner.display_name + '\n' +
                                "Created on : "+ created_on.substring(8,10)+'-'+created_on.substring(4,7)+'-'+created_on.substring(11,15) + '\n' +
                                "Updated on : "+ updated_on.substring(8,10)+'-'+updated_on.substring(4,7)+'-'+updated_on.substring(11,15) + '\n' +
                                "Is_private : "+params.is_private+ '\n' + '\n';
    })
    return msg.send(repoDetails);
  });
};

watcherDetails = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BITBUCKET_CLOUD_AUTH;
  const SERVER = process.env.HUBOT_BITBUCKET_CLOUD_URL;
  const USERNAME = AUTH.split(':')[0];
  let REPONAME = msg.match[1].split(' ');
  REPONAME = REPONAME.join('-');
  const URL = "https://" + AUTH + "@"+ SERVER +"/api/2.0/repositories/" + USERNAME + "/"+ REPONAME + "/watchers";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let details = JSON.parse(body);
    let watcherDetails = '';
    if(details.values.length){
     details.values.map((params,index) => {
       let i = index+1;
       watcherDetails += i + ') ' + params.display_name + '\n' + '\n';
     })
    } else {
     watcherDetails = "No watchers found";
    }
    return msg.send(watcherDetails);
  });
};

branchDetails = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BITBUCKET_CLOUD_AUTH;
  const SERVER = process.env.HUBOT_BITBUCKET_CLOUD_URL;
  const USERNAME = AUTH.split(':')[0];
  let REPONAME = msg.match[1].split(' ');
  REPONAME = REPONAME.join('-');
  const URL = "https://" + AUTH + "@"+ SERVER +"/api/2.0/repositories/" + USERNAME + "/"+ REPONAME + "/refs/branches";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let details = JSON.parse(body);
    let branchDetails = '';
    if(details.values.length){
     details.values.map((params,index) => {
       let i = index+1;
       branchDetails += i + ') '+ "Branch_name : " + params.name + '\n' +
                                 "Author_name : "+ params.target.author.raw + '\n' + '\n' ;
     })
    } else {
       branchDetails = "No branch found";
    }
    return msg.send(branchDetails);
  });
};

issueDetails = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BITBUCKET_CLOUD_AUTH;
  const SERVER = process.env.HUBOT_BITBUCKET_CLOUD_URL;
  const USERNAME = AUTH.split(':')[0];
  let REPONAME = msg.match[1].split(' ');
  REPONAME = REPONAME.join('-');
  const URL = "https://" + AUTH + "@"+ SERVER +"/api/2.0/repositories/" + USERNAME + "/"+ REPONAME + "/issues";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let details = JSON.parse(body);
    let issueDetails = '';
    if(details.values.length){
     details.values.map((params,index) => {
       let i = index+1;
       let created_on = new Date(params.created_on);
       created_on = created_on.toString();
       let updated_on = new Date(params.updated_on);
       updated_on = updated_on.toString();
       issueDetails += i + ') '+ "Title : " + params.title + '\n' +
                                 "Reporter : "+ params.reporter.display_name + '\n' +
                                 "Priority : " + params.priority + '\n' +
                                 "Type :" + params.kind + '\n'+
                                 "Created on : "+ created_on.substring(8,10)+'-'+created_on.substring(4,7)+'-'+created_on.substring(11,15) + '\n' +
                                 "Updated on : "+ updated_on.substring(8,10)+'-'+updated_on.substring(4,7)+'-'+updated_on.substring(11,15) + '\n' +
                                 "Status : "+params.state+ '\n' + '\n';
    })
   } else {
       issueDetails = "No issue found";
    }
    return msg.send(issueDetails);
  });
};

latest_commit = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BITBUCKET_CLOUD_AUTH;
  const SERVER = process.env.HUBOT_BITBUCKET_CLOUD_URL;
  const USERNAME = AUTH.split(':')[0];
  const URL = "https://" + AUTH + "@"+ SERVER +"/api/2.0/repositories/" + USERNAME + "/" + msg.match[1] + "/commits/master?pagelen=10";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let commit = JSON.parse(body).values[0];
    let result = '';
    result += '' + "Commited by : " + commit.author.raw + '\n' +
              "Commited_at : " + new Date(commit.date).toString().substr(4, 11) + '\n' +
              "Commit msg : " + commit.message + '\n' + '\n' ;
    return msg.send(result);
  });
};

pullrequests = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BITBUCKET_CLOUD_AUTH;
  const SERVER = process.env.HUBOT_BITBUCKET_CLOUD_URL;
  const USERNAME = AUTH.split(':')[0];
  const URL = "https://" + AUTH + "@"+ SERVER +"/api/2.0/repositories/"+ USERNAME +"/"+ msg.match[1] +"/pullrequests";
  return robot.http(URL).get()(function(err, res, body) {
    handleError(err, res.statusCode, msg);
    let pullrequest = JSON.parse(body).values;
    let pullReq = '';
    if(!pullrequest.length)
     {
       return msg.send("No pullrequests");
     }
    else
    {
      pullrequest.map((builds,index) => {
        let i = index+1;
        let updated_on = new Date(builds.updated_on);
        updated_on = updated_on.toString();
        pullReq += i + ') '+ "Pullrequest Title : " + builds.title + '\n' +
                              "State : "+ builds.state + '\n' +
                              "Updated on : "+ updated_on.substring(8,10)+'-'+updated_on.substring(4,7)+'-'+updated_on.substring(11,15) + '\n' + '\n';
        })
      }
      return msg.send(pullReq);
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
