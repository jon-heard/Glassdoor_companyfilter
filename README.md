# Glassdoor company filter

This is a greasmonkey script that modifies glassdoor‘s excellent job search.

Each job post gets a "filter company" button added to it. If clicked, the post’s company is completely hidden from this and all future searches.

<i>Note: It is in working condition, but rough around the edges.  I intend to add more console logging (for debugging purposes) and cleanup the web api to adhere to more closely follow RESTful precepts.</i>

Requirements:
1) Firefox
2) Greasemonkey (a firefox plugin)
3) A http server with php and mysql (to store company names)

Steps to get this script working:
1. Download all files
2. Open 'glassdoor_companyFilter.user.js' into a text editor.  Change the variable 'DATA_HOST' (the first line of code) to match the base url of the http server.  For example, if the web files are hosted locally within the 'glassdoor_companyFilter' folder.
  var DATA_HOST = "http://localhost/glassdoor_companyFilter";
3. Open 'web/dbConnect.inc' into a text editor. Set the variables to connect to your mysql database:
   - $host - The domain, url, etc (along with port if not standard)
   - $username - The username to use to connect to the database
   - $password - The password to use to connect to the database
   - $database - The name of the database in which the 'filtered' table exists (where the 'sqlImport.sql' script was run)
4. Place the contents of the 'web' folder onto the http server.
5. Execute 'sqlImport.sql' in the mysql server (to setup required tables).
6. Add 'glassdoor_companyFilter.js' to greasemonkey by dragging it into firefox.  A confirmation popup should be displayed.  Click 'Install' at the bottom of the popup.

Troubleshooting:
- If the script can't connect to the web server, it'll popup an alert when running a job search on glasddoor.
- If you get no alert, but don't see filter buttons, The script logs all activity to the javascript console.  I'd start there.
