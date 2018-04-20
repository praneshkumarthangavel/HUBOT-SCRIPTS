// Description:

//  Interact with your Bitbucket Server

//

// Dependencies:

//  None

//

// Configuration:

//  HUBOT_BITBUCKET_SERVER_URL

//  HUBOT_BITBUCKET_SERVER_AUTH

//

//  Auth should be in the "user:password" format.

//

// Commands:

// bitbucket project details -> all the projects details

// bitbucket repo details for project <Project Key>  -> all the repo details in a project

// bitbucket commit in project <Project key> for repo <Repo Name> -> all the commits in a repo

// bitbucket pullrequest in project <Project key> for repo <Repo Name> -> all the pullrequest in a repo

// bitbucket branch details in project <Project key> for repo <Repo Name> -> all the branches in a repo

//

// Author:

//   PRANESH KUMAR THANGAVEL

//


module.exports = function(robot)
 {
  robot.respond(/bitbucket project details/i, function(msg)
  {
    projectDetails(robot, msg);
  });

  robot.respond(/bitbucket commit in project (.*) for repo (.*)/, function(msg)
  {
    latest_commit(robot, msg);
  });
  robot.respond(/bitbucket repo details for project(.*)/, function(msg)
  {
    repoDetails(robot, msg);
  });
  robot.respond(/bitbucket branch details in project (.*) for repo (.*)/, function(msg)
   {
      branchDetails(robot, msg);
   });
  robot.respond(/bitbucket pullrequest in project (.*) for repo (.*)/, function(msg)
    {
      pullrequests(robot, msg);
    });
};

 projectDetails = function(robot, msg)
  {
    const AUTH = process.env.HUBOT_BITBUCKET_SERVER_AUTH;
    const SERVER = process.env.HUBOT_BITBUCKET_SERVER_URL;
    const URL = "http://"+ AUTH +"@" +SERVER+"/rest/api/1.0/projects";
    return robot.http(URL).get()(function(err, res, body) {
      handleError(err, res.statusCode, msg);
      let proj = JSON.parse(body).values;
      let result = '';
      proj.map((projects,index) => {
        let i = index+1;
        result += i + ') '+ 'Project Name : ' + projects.name + '\n' +
                  'Project Key : ' + projects.key + '\n' +
                  'Is Public : ' +projects.public+ '\n' + '\n' ;
      })
    return msg.send(result);
    });
  };

  latest_commit = function(robot, msg)
   {
    const AUTH = process.env.HUBOT_BITBUCKET_SERVER_AUTH;
    const SERVER = process.env.HUBOT_BITBUCKET_SERVER_URL;
    const USERNAME = AUTH.split(':')[0];
    const URL = "http://"+AUTH+"@"+SERVER+"/rest/api/1.0/projects/"+ msg.match[1] +"/repos/"+ msg.match[2] +"/commits/master";
    return robot.http(URL).get()(function(err, res, body) {
      handleError(err, res.statusCode, msg);
      let commit = JSON.parse(body);
      let result = '';
      result += '' + "Commited by : " + commit.committer.name + '\n' +
                     "Commited_at : " + new Date(commit.committerTimestamp).toString().substr(4, 11) + '\n' +
                     "Commit msg : " + commit.message + '\n' + '\n' ;
      return msg.send(result);
    });
  };

  repoDetails = function(robot, msg)
   {
    const AUTH = process.env.HUBOT_BITBUCKET_SERVER_AUTH;
    const SERVER = process.env.HUBOT_BITBUCKET_SERVER_URL;
    const USERNAME = AUTH.split(':')[0];
    const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/1.0/projects/" + msg.match[1] +"/repos";
    return robot.http(URL).get()(function(err, res, body) {
    console.log('res:', res);
      handleError(err, res.statusCode, msg);
      let details = JSON.parse(body);
      let repoDetails = '';
      details.values.map((params,index) => {
        let i = index+1;
        repoDetails += i + ') '+ "Repository name : " + params.slug + '\n' +
                                 "Is_Forkable : "+ params.forkable + '\n' +
                                 "Is_public : "+params.public+ '\n' + '\n';
       })
       return msg.send(repoDetails);
     });
   };


   branchDetails = function(robot, msg)
     {
      const AUTH = process.env.HUBOT_BITBUCKET_SERVER_AUTH;
      const SERVER = process.env.HUBOT_BITBUCKET_SERVER_URL;
      let REPONAME = msg.match[2].split(' ');
      REPONAME = REPONAME.join('-');
      const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/1.0/projects/" + msg.match[1] + "/repos/"+ REPONAME + "/branches";
      console.log("url:",URL);
      return robot.http(URL).get()(function(err, res, body) {
        handleError(err, res.statusCode, msg);
        let details = JSON.parse(body);
        let branchDetails = '';
        if(details.values.length){
         details.values.map((params,index) => {
           let i = index+1;
           branchDetails += i + ') '+ "Branch_name : " + params.displayId + '\n' +'\n';
         })
        } else {
           branchDetails = "No branch found";
        }
        return msg.send(branchDetails);
      });
    };

    pullrequests = function(robot, msg)
 {
  const AUTH = process.env.HUBOT_BITBUCKET_SERVER_AUTH;
  const SERVER = process.env.HUBOT_BITBUCKET_SERVER_URL;
  const URL = "http://" + AUTH + "@"+ SERVER +"/rest/api/1.0/projects/"+ msg.match[1] +"/repos/"+ msg.match[2] +"/pull-requests";
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
        console.log("author : ",builds.author.user.displayName);
        console.log("reviewer : ",builds.reviewers[0].user.displayName);
        let i = index+1;
        let updated_on = new Date(builds.updatedDate);
        updated_on = updated_on.toString();
        pullReq += i + ') '+ "Pullrequest Title : " + builds.title + '\n' +
                              "State : "+ builds.state + '\n' +
                              "Updated on : "+ updated_on.substring(8,10)+'-'+updated_on.substring(4,7)+'-'+updated_on.substring(11,15) + '\n' +
                              "Requested by : "+ builds.author.user.displayName + '\n' +
                              "Reviewer : "+ builds.reviewers[0].user.displayName + '\n' + '\n' ;
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
