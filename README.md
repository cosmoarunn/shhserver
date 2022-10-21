# SHH Server

A restful node.js/Express - SSL & CORS Enabled - Webserver

## A light-weight api server

SHH Server is a light weight api server built using express.js for fast and rapid deployment of a development/test server.
![SHHServer: Light-weight API server](https://github.com/cosmoarunn/shhserver/raw/master/shhserver-post-req.png)

## Installation 
  - Clone the repository
  ```
     git clone https://github.com/cosmoarunn/shhserver.git
   ```
  - Install packages
  ```
     npm run install 
         (or)
     yarn
   ```
  - Create a folder `ssh` on the main repository path Add custom key and certificate for ssl (https) . To generate self signed certificate and key using openssl,

  ```
    openssl genrsa -out key.pem 2048
    openssl req -new -sha256 -key key.pem -out csr.csr
    openssl req -x509 -sha256 -days 365 -key key.pem -in csr.csr -out certificate.pem
    openssl req -in csr.csr -text -noout | grep -i "Signature.*SHA256" && echo "All is well" || echo "This certificate will stop working in 2017! You must update OpenSSL to generate a widely-compatible certificate"
  ```

  -  Run the server
   ```
     npm run start
        (or)
     yarn run start
   ```

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
Try shhserver online  (running at port 10010)
Get Requests,
- https://shhserver.arunpanneerselvam.com/
- https://shhserver.arunpanneerselvam.com/routes/base
- https://shhserver.arunpanneerselvam.com/routes/base/hello
- https://shhserver.arunpanneerselvam.com/routes/base/api-test

Post Requests (try 'PostMan' like), 
- https://shhserver.arunpanneerselvam.com/routes/post-base

don't forget to edit the SSL options at, 
```
shhserver/server/config.js 
```


## Support or Contact

Having trouble working with? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://github.com/cosmoarunn) and we’ll help you sort it out.
website: https://shhserver.arunpanneerselvam.com
email: arun@arunpanneerselvam.com
