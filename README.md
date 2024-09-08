# Start app

Downloading all dependencies:
```cli
npm install
```

Starting server
```cli
npm start
```

You can access your website via:
```
http://127.0.0.1:8000
```

# Setting up MongoDB connection

To set mongo connection you have to change to your credentials USERNAME and PASSWORD and URL 
```js
    .connect('mongodb+srv://USERNAME:PASSWORD@URL.mongodb.net/')
```

## Tip
You can just clict 'connect' in mongo atlas next to your cluster and copy code. 

# Running on docker
To run app on docker you need to have cluster in mongoDB Atlas or localy. 
Step by step:
```bash
1. docker pull patryk2402/postapp
```
```bash
2. docker run -d -e DB_USER=YOUR_MONGODB_USERNAME -e DB_PASSWORD=YOUR_MONGODB_PASSWORD -e DB_URL=YOUR_MONGODB_URL -p port:8000 patryk2402/postapp
```
```bash
3. enter http://0.0.0.0:port
```


