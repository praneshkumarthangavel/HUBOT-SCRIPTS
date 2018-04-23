// Description:

//  Interact with your Hubot Server and gives some basic commands.

//

// Dependencies:

//  None

//

// Configuration:

//  None

//

// Commands:

//   help         -> displays all the basic hubot commands

//   help <tool name>  -> displays the particular tools commands

//

// Author:

//   PRANESH KUMAR THANGAVEL

//

module.exports = function(robot)
 {
  robot.respond(/help(.*)/i, function(msg) {
  let tool = msg.match[1];
  tool = tool ? tool.trim().toLowerCase() : 'default';
  switch(tool) {
   case 'bitbucket':
    bitbucketHelp(robot, msg);
    break;
   case 'bamboo':
    bambooHelp(robot, msg);
    break;
   case 'jira':
    jiraHelp(robot, msg);
    break;
   case 'sonar':
    sonarHelp(robot, msg);
    break;
   case 'git inspector':
    gitinspectorHelp(robot, msg);
    break;
   case 'talkative':
    talkactiveHelp(robot, msg);
    break;
   default:
     greetingsHelp(robot, msg);
     sonarHelp(robot, msg);
     bitbucketHelp(robot, msg);
     bambooHelp(robot, msg);
     jiraHelp(robot,msg);
     gitinspectorHelp(robot, msg);
     talkativeHelp(robot, msg);
     break;
  }
 });
};

greetingsHelp = function(robot, msg){
 let greetings =  [
 "GREETINGS COMMANDS:",
 "Hello",
 "Good Day"
];
let result = '';
greetings.map((commands,index) => {
     result += commands + '\n';
 })
 return msg.send(result);
};

sonarHelp = function(robot, msg){
 let sonar =  [
   "SONAR COMMANDS:",
   "sonar projects - lists all the projects",
   "sonar code coverage for project <Project key> - coverage value of the  project",
   "sonar last analyse of project <Project Key> - last analyse of the project",
   "sonar metric values for project <Project Key> - all the metric datas of the project"
];
let results = '';
sonar.map((commands,index) => {
     results += commands + '\n';
 })
 return msg.send(results);
};


bitbucketHelp = function(robot, msg) {
  let bitbucket =  [
  "BITBUCKET COMMANDS:",
  "bitbucket project details - all the projects details",
  "bitbucket repo details for project <Project Key> - all the repo details in a project",
  "bitbucket commit in project <Project key> for repo <Repo Name> - all the commits in a repo",
  "bitbucket pullrequest in project <Project key> for repo <Repo Name> - all the pullrequest in a repo",
  "bitbucket branch details in project <Project key> for repo <Repo Name> - all the branches in a repo"
 ];

  let result1 = '';
  bitbucket.map((commands,index) => {
      result1 +=  commands + '\n';
  })
  return msg.send(result1);
};

bambooHelp = function(robot, msg) {
  let bamboo =  [
   "BAMBOO COMMANDS:",
   "bamboo projects - views all projects",
   "bamboo plans in project <project key> - views all plans within a project",
   "bamboo trigger build for plan <plan key> - triggering a plan",
   "bamboo build status for plan <plan key> - build status of the plan",
   "bamboo latest build status for plan <plan key> - last build status of the plan"
  ];
  let result2 = '';
  bamboo.map((commands,index) => {
      result2 +=  commands + '\n';
  })
  return msg.send(result2);
};

jiraHelp = function(robot, msg) {
  let jira =  [
   "JIRA COMMANDS:",
   "jira sprints in project <project Key> - description about all the sprints in the project",
   "jira latest sprint user stories in project <project Key> - user stories for the latest sprint in the project",
   "jira all user stories in project <project Key> - all the issues in the project",
   "jira todo user stories in project <project Key> - all the todo issues in the project",
   "jira work in progress user stories in project <project Key> - all the work in progress issues in the project",
   "jira completed user stories in project <project Key> - all the completed issues in the project"
 ];
  let result3 = '';
  jira.map((commands,index) => {
      result3 +=  commands + '\n';
  })
  return msg.send(result3);
};

gitinspectorHelp = function(robot, msg) {
  let gitinspector =  [
   "GIT-INSPECTOR COMMANDS:",
   "git inspector report - it gives a analytic report about the project"
 ];
  let result4 = '';
  gitinspector.map((commands,index) => {
      result4 +=  commands + '\n';
  })
  return msg.send(result4);
};

talkativeHelp = function(robot, msg) {
  let talkative =  [
  "TALKATIVE COMMANDS:",
  "say something about <topic> - will say something he knows about the subject",
  "when asked <regexp_of_question> answer <response> - teach your bot to answer to <regexp_of_question> with <response>",
  "forget answers - remove every teached answer from bot brain"
 ];
  let result5 = '';
  talkative.map((commands,index) => {
      result5 +=  commands + '\n';
  })
  return msg.send(result5);
};
