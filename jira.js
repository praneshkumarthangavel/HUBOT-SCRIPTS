// Description:

//  Interact with your JIRA Server

//

// Dependencies:

//  None

//

// Configuration:

//  HUBOT_JIRA_URL

//  HUBOT_JIRA_AUTH

//

//  Auth should be in the "user:password" format.

//

// Commands:

// jira sprints in project <project Key> -> description about all the sprints in the project

// jira latest sprint user stories in project <project Key> -> user stories for the latest sprint in the project

// jira all user stories in project <project Key> -> all the issues in the project

// jira todo user stories in project <project Key> -> all the todo issues in the project

// jira work in progress user stories in project <project Key> -> all the work in progress issues in the project

// jira completed user stories in project <project Key> -> all the completed issues in the project 

//

// Author:

// PRANESH KUMAR THANGAVEL

//

module.exports = function(robot)
 {
  robot.respond(/jira sprints in project (.*)/i, function(msg)
  {
    user_stories(robot, msg);
  });
  robot.respond(/jira latest sprint user stories in project (.*)/i, function(msg)
  {
    latest_sprint(robot, msg);
  });
  robot.respond(/jira all user stories in project (.*)/i, function(msg)
  {
    all_issues(robot, msg);
  });
  robot.respond(/jira todo user stories in project (.*)/i, function(msg)
  {
    todo_user_stories(robot, msg);
  });
  robot.respond(/jira completed user stories in project (.*)/i, function(msg)
  {
    done_user_stories(robot, msg);
  });
  robot.respond(/jira work in progress user stories in project (.*)/i, function(msg)
  {
    wip_user_stories(robot, msg);
  });
};

user_stories = function(robot, msg)
  {
   const AUTH = process.env.HUBOT_JIRA_AUTH;
   const SERVER = process.env.HUBOT_JIRA_URL;
   const URL = "http://" + AUTH + "@" + SERVER + "/rest/api/2/search?jql=project=" + msg.match[1] + "&maxResult=0";
   return robot.http(URL).get()(function(err, res, body)
     {
       handleError(err, res.statusCode, msg);
       let details = JSON.parse(body).issues;
       let  issueDetails = '' ;
       let sprints = {};
       details.map((params,index) =>
         {
           let sprintName = params.fields.customfield_10004[0].split(/name=/)[1].split(',')[0];
           if(sprints[sprintName]) {
             sprints[sprintName].Issues_Count += 1;
           } else {
             sprints[sprintName] = {};
             sprints[sprintName].Issues_Count = 1;
             sprints[sprintName].StartDate = new Date(params.fields.customfield_10004[0].split(/startDate=/)[1].split(',')[0]).toString().substring(4,15);
             sprints[sprintName].EndDate = new Date(params.fields.customfield_10004[0].split(/endDate=/)[1].split(',')[0]).toString().substring(4,15);
           }
         });
         let sprintNames = Object.keys(sprints);
            for (let i = 0;i<sprintNames.length;i++) {
		let tmp = sprints[sprintNames[i]];
                let index= i +1;
                issueDetails += index + ') ' + JSON.stringify(Object.keys(sprints)[i])  + '\n' 
                                + "Issue Count : " + JSON.stringify(tmp.Issues_Count) + '\n'
                                + "StartDate : " + JSON.stringify(tmp.StartDate)+ '\n'
                                + "EndDate : " + JSON.stringify(tmp.EndDate) + '\n' + '\n';
         };
       msg.send(issueDetails);
      });
}
  all_issues = function(robot, msg)
    {
     const AUTH = process.env.HUBOT_JIRA_AUTH;
     const SERVER = process.env.HUBOT_JIRA_URL;
     const URL = "http://" + AUTH + "@" + SERVER + "/rest/api/2/search?jql=project=" + msg.match[1] + "&maxResult=0";
     return robot.http(URL).get()(function(err, res, body)
       {
         handleError(err, res.statusCode, msg);
         let details = JSON.parse(body).issues;
         let  issues = '' ;
         let i = 0;
         details.map((params,index) =>
           {
               let i = index+1;
              let assigneeName = '';
               if( params.fields.assignee === null ) {
                  assigneeName = 'No assignee found'
               } else {
                  assigneeName = params.fields.assignee.name ;
               }
               issues += i + ") " + "Assignee Name : "+ assigneeName + '\n' +
                               "Description : " + params.fields.description + '\n' ;
           });
           if(!issues.length) {
             msg.send("No issues found");
           } else {
             msg.send(issues);
           }
         });
    };

    latest_sprint = function(robot, msg)
    {
     const AUTH = process.env.HUBOT_JIRA_AUTH;
     const SERVER = process.env.HUBOT_JIRA_URL;
     const URL = "http://" + AUTH + "@" + SERVER + "/rest/api/2/search?jql=project=" + msg.match[1] + "&maxResult=0";
     return robot.http(URL).get()(function(err, res, body)
       {
         handleError(err, res.statusCode, msg);
         let details = JSON.parse(body).issues;
         let dates = {}; 
         let latestDetails = ''
         details.map((params,index) =>
           {
             let sprintName = params.fields.customfield_10004[0].split(/name=/)[1].split(',')[0];
             if(params.fields.status.statusCategory.name) {
              dates[sprintName] = new Date(params.fields.customfield_10004[0].split(/startDate=/)[1].split(',')[0])
             }
          });
          let keysSorted = Object.keys(dates).sort(function(a,b){return dates[b]-dates[a]})
          latestDetails = "Sprint:" + keysSorted[0]+ '\n' ;  
          details.map((params,index) =>
           {
            let assigneeName = '';
            if( params.fields.assignee === null ) {
              assigneeName = 'No assignee found'
            } else {
              assigneeName = params.fields.assignee.name ;
            }
             if(params.fields.customfield_10004[0].split(/name=/)[1].split(',')[0] === keysSorted[0]) {
                let i = index+1;
                latestDetails +=  i + ") " + "Assignee Name : "+assigneeName + '\n' +
                                 "Description : " + params.fields.description + '\n' +
                                 "Status : " + params.fields.status.name + '\n' + '\n' ;
              }
            });
          msg.send(latestDetails);
          });
    };

  todo_user_stories = function(robot, msg)
    {
     const AUTH = process.env.HUBOT_JIRA_AUTH;
     const SERVER = process.env.HUBOT_JIRA_URL;
     const URL = "http://" + AUTH + "@" + SERVER + "/rest/api/2/search?jql=project=" + msg.match[1] + "&maxResult=0";
     return robot.http(URL).get()(function(err, res, body)
       {
         handleError(err, res.statusCode, msg);
         let details = JSON.parse(body).issues;
         let  todoDetails = '' ;
         let i = 0;
         details.map((params,index) =>
           {
             let assigneeName = '';
             if( params.fields.assignee === null ) {
               assigneeName = 'No assignee found'
             } else {
               assigneeName = params.fields.assignee.name ;
             }
             if(params.fields.status.statusCategory.name === 'To Do') {
               i = i+1;
               todoDetails += i + ") " + "Assignee Name : "+ assigneeName + '\n' +
                               "Description : " + params.fields.description + '\n' ;
             }
           });
           if(!todoDetails.length) {
             msg.send("No Todo user stories found");
           } else {
             msg.send(todoDetails);
           }
         });
    };

    done_user_stories = function(robot, msg)
      {
       const AUTH = process.env.HUBOT_JIRA_AUTH;
       const SERVER = process.env.HUBOT_JIRA_URL;
       const URL = "http://" + AUTH + "@" + SERVER + "/rest/api/2/search?jql=project=" + msg.match[1] + "&maxResult=0";
       return robot.http(URL).get()(function(err, res, body)
         {
           handleError(err, res.statusCode, msg);
           let details = JSON.parse(body).issues;
           let  doneDetails = '' ;
           let i = 0;
           details.map((params,index) =>
             {
              let assigneeName = ''; 
              if(params.fields.status.statusCategory.name === 'Done') {
                 i = i+1;
                 if( params.fields.assignee === null ) {
                    assigneeName = 'No assignee found' 
                 } else {
                    assigneeName = params.fields.assignee.name ;
                 }          
                 doneDetails += i + ") " + "Assignee Name : "+ assigneeName  + '\n' +
                                 "Description : " + params.fields.description + '\n' ;
               }
             });
             if(!doneDetails.length) {
               msg.send("No completed user stories found");
             } else {
               msg.send(doneDetails);
             }
           });
      };

      wip_user_stories = function(robot, msg)
        {
         const AUTH = process.env.HUBOT_JIRA_AUTH;
         const SERVER = process.env.HUBOT_JIRA_URL;
         const URL = "http://" + AUTH + "@" + SERVER + "/rest/api/2/search?jql=project=" + msg.match[1] + "&maxResult=0";
         return robot.http(URL).get()(function(err, res, body)
           {
             handleError(err, res.statusCode, msg);
             let details = JSON.parse(body).issues;
             let  wipDetails = '' ;
             let i = 0;
             details.map((params,index) =>
               {
                 let assigneeName = ''; 
                 if(params.fields.status.statusCategory.name === 'In Progress') {
                   i = i+1;
                   if( params.fields.assignee === null ) {
                    assigneeName = 'No assignee found'
                   } else {
                     assigneeName = params.fields.assignee.name ;
                   }
                   wipDetails += i + ") " + "Assignee Name : "+ assigneeName + '\n' +
                                   "Description : " + params.fields.description + '\n' ;
                 }
               });
               if(!wipDetails.length) {
                 msg.send("No work in progress user stories found");
               } else {
                 msg.send(wipDetails);
               }
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

