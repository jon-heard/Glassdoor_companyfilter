# Glassdoor company filter

This is a greasmonkey script that modifies glassdoor‘s excellent job search.

Each job post gets a "filter company" button added to it. If clicked, the post’s company is completely hidden from this and all future searches.

Requirements:
1) Greasemonkey (a firefox plugin)
2) A http server with php and mysql (to store company names)

Steps to get this script working:
1) Add greasemonkey script (glassdoor_comanyFilter.user.js) into greasemonkey
2) Place contents of the 'web' folder into a folder being served by the http server
3) Run the sql file (sqlImport.sql) in your mysql database to add the 'filtered' table used by this script
4) Modify the 'dbConnect.inc' file in the http server folder. Set the variables to connect to your mysql database:
     $host - The domain, url, etc (along with port if not standard)
     $username - The username to use to connect to the database
     $password - The password to use to connect to the database
     $database - The database in which the 'sqlImport.sql' script was run (contains the 'filtered' table)
5) Modify the greasemonkey script (glassdoor_companyFilter.user.js).
     Change the variable 'DATA_HOST' (first line of code) to the base url of the http server folder.
6) Go to http://glassdoor.com and run a JOB search.
     You should see a button 'Filter company' by each job posting.
     Click on that button to filter out the posting's company from this and all future searches.

Troubleshooting:
- If the script can't connect to the web server, it'll popup an alert when running a job search on glasddoor.
- If you get no alert, but don't see filter buttons, The script logs everything to the java console.  I'd start there.
