# SHH Server

A restful node.js/Express - CORS Enabled - Webserver

## A light-weight api server

SHH Server is a light weight api server built using express.js for fast and rapid deployment of a development/test server.
![SHHServer: Light-weight API server](https://github.com/cosmoarunn/shhserver/raw/master/shhserver-post-req.png)
## start the server with,
   ```
     node index.js
   ```
## For https server
-enable https configuration at server/config.js  
  ```
   {  ... 
      https: true
      ...
   }
   ```
-create server/ssh folder and upload a ssl certificate and a private key

## Routes

  ```
    localhost:port/routes/route_name/getorpost_func
  ```
  - A simple hello from the route 'base'
  ```
  localhost:port/routes/base/hello
  ```

  - A simple JSON file (api mock) from the route 'base'
  ```
  localhost:port/routes/base/api-test
  ```
  
## Try online
No time to download and test?
Try shhserver online 
Get Requests,
- https://shhserver.arunpanneerselvam.com/
- https://shhserver.arunpanneerselvam.com/routes/base
- https://shhserver.arunpanneerselvam.com/routes/base/hello
- https://shhserver.arunpanneerselvam.com/routes/base/api-test

Post Requests (try 'PostMan' like), 
- https://shhserver.arunpanneerselvam.com/routes/post-base


## Support or Contact

Having trouble working with? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
website: https://shhserver.arunpanneerselvam.com
email: arun@arunpanneerselvam.com
