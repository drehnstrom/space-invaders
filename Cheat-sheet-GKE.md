# Kubernetes with GKE Cheat Sheet

## Create a Standrd GKE Cluster
```
gcloud container clusters create space-invaders-cluster --zone=us-central1-a
```

## Create an Autopilot GKE Cluster
```
gcloud container clusters create-auto space-invaders-auto-cluster --region us-central1
```

## Build Docker image with Google Cloud Build
```
gcloud builds submit --tag=gcr.io/<project-id>/space-invaders:v3.0 .
```
Example:
```
gcloud builds submit --tag=gcr.io/doug-rehnstrom/space-invaders:v3.0 .
```

## kubectl Create a Deplyment (CLI)
```
ubectl create deployment space-inv --image=drehnstrom/space-invaders:v3.0 --replicas=3
```

## kubectl Create a Service (CLI)
```
kubectl expose deployments/space-inv --port=80 --target-port=80 --type
=LoadBalancer
```


## Create Deployment config file
```
kubectl create deployment space-inv --image=gcr.io/<project-id>/space-invaders:v3.0 --dry-run=client -o=YAML >> kubernetes-deployment.yaml
```

Example:
```
kubectl create deployment space-inv --image=gcr.io/doug-rehnstrom/space-invaders:v3.0 --dry-run=client -o=YAML >> kubernetes-deployment.yaml
```

## Create Service config file
```
kubectl expose deployments/space-inv --port=80 --target-port=80 --type=LoadBalancer --dry-run=client -o=YAML >> kubernetes-deployment.yaml
```
Example:
```
kubectl expose deployments/space-inv --port=80 --target-port=80 --type=LoadBalancer --dry-run=client -o=YAML >> kubernetes-service.yaml
```

## Deploy to kubernetes
Example:
```
kubectl apply -f kubernetes-deployment.yaml
kubectl apply -f kubernetes-service.yaml
```

## Delete from Kubernetes
Example:
```
kubectl delete -f kubernetes-deployment.yaml
kubectl delete -f kubernetes-service.yaml
```

## Kubernetes commands
```
kubectl get pods
kubectl get services
```

## Log into a pod
```
kubectl exec -it <pod id> -- /bin/bash
```

