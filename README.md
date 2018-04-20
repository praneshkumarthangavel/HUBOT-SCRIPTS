# HUBOT - SCRIPTS (javascript)

Hi there, 

        Normally slack hubot scripts would be written in coffee scripts and it is written before 2 to 3 years ago. So i have written these files using javascript and configures some of the basic commands ands api's. 

It works along with your coffee script. You just have to follow the steps and pass the environment variables.

# COMMANDS:

# SONAR COMMANDS:
sonar set server <server address> - to set sonar server
    
sonar coverage <project key> - to see the test percentage

sonar issues <project key> – to see the issues
 
# BITBUCKET CLOUD COMMANDS:
bitbucket repo details - all the details about repos

bitbucket repo watcher details for <repo name> - person who has access to the repo

bitbucket branch details for <repo name> - branch details of a repo

bitbucket repo issues for <repo name> - issues in a repo

bitbucket latest commit for <repo name> - latest commit in repo

bitbucket pullrequest for <repo name> - pullrequest status of repo

# BITBUCKET SERVER COMMANDS:
bitbucket project details - all the projects details

bitbucket repo details for project <Project Key> - all the repo details in a project

bitbucket commit in project <Project key> for repo <Repo Name> - all the commits in a repo

bitbucket pullrequest in project <Project key> for repo <Repo Name> - all the pullrequest in a repo

bitbucket branch details in project <Project key> for repo <Repo Name> - all the branches in a repo

# BAMBOO COMMANDS:
bamboo projects - views all projects

bamboo plans in project <project key> - views all plans within a project

bamboo trigger build for plan <plan key> - triggering a plan

bamboo build status for plan <plan key> - build status of the plan

bamboo latest build status for plan <plan key> - last build status of the plan
  
# JIRA COMMANDS:
jira sprints in project <project Key> - description about all the sprints in the project

jira latest sprint user stories in project <project Key> - user stories for the latest sprint in the project

jira all user stories in project <project Key> - all the issues in the project

jira todo user stories in project <project Key> - all the todo issues in the project

jira work in progress user stories in project <project Key> - all the work in progress issues in the project

jira completed user stories in project <project Key> - all the completed issues in the project
  
# AUTHOR:
      PRANESH KUMAR THANGAVEL
