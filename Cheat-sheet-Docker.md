# Docker Cheat Sheet

## Build locally for testing

```
docker build -t space-invaders:v3.0 .
```

## Build and Push to Dockder Hub

docker build -t [your-docker-id]/space-invaders:v3.0 .
docker push [your-docker-id]/space-invaders:v3.0

```
docker build -t drehnstrom/space-invaders:v3.0 .
docker push drehnstrom/space-invaders:v3.0
```

## Build and Push from Arm64 Mac using buildx

docker buildx build --platform linux/amd64,linux/arm64 -t [your-docker-id]/space-invaders:v3.0 --push .

```
docker buildx build --platform linux/amd64,linux/arm64 -t drehnstrom/space-invaders:v3.0 --push .
```

## Run your Docker Image Locally

docker run -p 8080:80 [image-id]

```
docker run -p 8080:80 drehnstrom/space-invaders:v3.0
```

## Important Docker Commands

### Docker Commands: drehnstrom/space-invaders:v3.0

| Command | Example | Description |
| :--- | :--- | :--- |
| **build** | `docker build -t drehnstrom/space-invaders:v3.0 .` | Builds the image from a Dockerfile and tags it with the version **v3.0**. |
| **push** | `docker push drehnstrom/space-invaders:v3.0` | Uploads the tagged image to Docker Hub (requires `docker login`). |
| **pull** | `docker pull drehnstrom/space-invaders:v3.0` | Downloads the specific v3.0 image from the registry to the local machine. |
| **run** | `docker run -d -p 8080:80 drehnstrom/space-invaders:v3.0` | Runs the image in detached mode (`-d`) and maps host port 8080 to container port 80. |
| **ps** | `docker ps` | Lists all running containers to verify **space-invaders** is active. |
| **exec** | `docker exec -it <container_id> sh` | Opens an interactive terminal session inside the running container. |
| **logs** | `docker logs -f <container_id>` | Follows the output logs to monitor game events or errors in real-time. |
| **stop** | `docker stop <container_id>` | Gracefully shuts down the running container. |
| **tag** | `docker tag drehnstrom/space-invaders:v3.0 drehnstrom/space-invaders:latest` | Creates an additional tag so the v3.0 image is also identified as **latest**. |
| **rmi** | `docker rmi drehnstrom/space-invaders:v3.0` | Deletes the local copy of the image to free up disk space. |



