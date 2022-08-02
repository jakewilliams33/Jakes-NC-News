## NC News Backend repo

# Setup 

-You will need to create two .env files for your project: 

1 named '.env.development' with the text 'PGDATABASE=nc_news' inside.
and another named '.env.test' with the text 'PGDATABASE=nc_news_test' inside.

-Double check that these .env files are .gitignored.

-Run 'npm install' and 'npm install express' to install all necessary packages.

-You have also been provided with a db folder with some data, a setup.sql file and a seeds folder. You should also take a minute to familiarise yourself with the npm scripts you have been provided.

-The job of index.js in each the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually.
