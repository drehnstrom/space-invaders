# space-invaders

This is a demo app that uses a simple Angular JS website. It can be deployed anywhere (virtual machines, App Engine, Cloud Run, Kubernetes, etc. )

We use this application in a number of training classes to demo things like Cloud Deployments and CI/CD pipelines. 

## Docker
The Dockerfile is configured to copy the App into a Docker Image with Nginx installed. 

To build the image: 
```
docker build -t [your-docker-id]/space-invaders:v1.0 .
```
To run the image on port 8080:
```
docker run -p 8080:80 [your-docker-id]/space-invaders:v1.0
```

## App Engine
See the app.yaml file for App Engine configuration

To create the App Engine application:
```
gcloud app create --region=us-central
```

Then to deploy the App Engine App:
```
gcloud app deploy --version=one --quiet
```

## Kubernetes
Kubernetes Configuration files are located in the `kubernetes-configs` folder

To deploy version one to a Kubernetes cluster:
```
kubectl apply -f ./kubernetes-configs/kubernetes-deployment.yaml
kubectl apply -f ./kubernetes-configs/kubernetes-service.yaml
kubectl apply -f ./kubernetes-configs/kubernetes-autoscaler.yaml
```
 The file `kubernetes-configs/kubernetes-deployment-v2.yaml` can be used to demo Blue/Green deployments.

## Apache Web Server

To run on Apache Web Server run the following startup script on a Debian Linux VM
```
#! /bin/bash

apt update
apt install -y git apache2
cd /var/www/html
rm index.html -f
git init
git pull https://github.com/drehnstrom/space-invaders
```

## CI/CD Pipeline
There is a GitHub action setup that deploys the app to both App Engine and Cloud Run when a Push or Pull Request is made to the Master Branch. See the following file:
https://github.com/drehnstrom/space-invaders/blob/master/.github/workflows/main.yml 

## Author
Doug Rehnstrom  
ROI Training  
doug@roitraining.com  
