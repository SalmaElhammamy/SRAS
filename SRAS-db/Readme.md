## Docker

```bash
docker build -t mongod-pod .
```

```bash
docker run -d -p 27017:27017 -v ./mongo-db:/data/db --name mongo-container mongod-pod
```
