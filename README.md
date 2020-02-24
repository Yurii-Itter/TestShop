# TestShop
Example of koa framework app in wich microservices was used

Requirements:
  node js, npm, mongodb
  
Instalation:

git clone https://github.com/flndre/TestShop.git

cd ExternalService/

npm i

cd WebApp/

npm i
  
Configurating project:
  Open config.json, here you should fill fields that responsible for mongodb connection, app secret token also you can define port and host on wich you will run external service, this data need to successful Web App running
  
Data Base:
  you can use dumped collections that located in root of project to fill up your data base
  
Running applications:

cd ExternalService/

npm run prod

cd WebApp/

npm run prod


After that you will find TestShop app running in your localhost, take shure that you got not any program that also use it
