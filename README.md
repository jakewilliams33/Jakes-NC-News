## NC News Backend Project

https://jakes-nc-news.netlify.app/

# Information

An API for a news blog, which allows the user to retrieve articles, post articles, post comments, vote etc through a PostgreSQL database.

# Setup 

-You will need to create two .env files for your project: 

1 named '.env.development' with the text 'PGDATABASE=nc_news' inside.
and another named '.env.test' with the text 'PGDATABASE=nc_news_test' inside.

-Double check that these .env files are .gitignored.

-Run 'npm install' and 'npm install express' to install all necessary packages.

- To set up the database, use the script npm run setup-dbs to create both the test and dev databases. Use the script npm run seed to seed your database.

- Minimum requred version of Node: v18.3.0

- Minimum requred version of Postgres: 14.3


