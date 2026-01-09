# Cloud Service Mesh (GKE) Cheat Sheet

## Set up environment variables

```bash
export CLUSTER_NAME=si-cluster-$RANDOM
export ZONE=us-central1-a
export REGION=us-central1
export PROJECT_ID=$(gcloud config get-value project)

echo $CLUSTER_NAME
echo $ZONE
echo $REGION
echo $PROJECT_ID
```

## 1. Create a GKE cluster with Fleet and Workload Identity enabled
# This is required for Managed Cloud Service Mesh.
# We use e2-standard-4 (4 vCPUs, 16GB RAM) to have enough headroom for the Mesh control plane and sidecars.
```
gcloud container clusters create $CLUSTER_NAME \
    --zone $ZONE \
    --project $PROJECT_ID \
    --workload-pool=${PROJECT_ID}.svc.id.goog \
    --enable-fleet \
    --num-nodes=2 \
    --machine-type=e2-standard-4
```

### Get the kubectl credentials
```bash
gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE 
```

## 2. Enable Cloud Service Mesh (Mesh) on the Fleet
This enables the mesh feature for the entire project fleet.

```bash
gcloud container fleet mesh enable --project $PROJECT_ID
```

## 3. Enable Automatic Management for the cluster 
This tells Google to manage the Istio control plane for this cluster.

```bash
gcloud container fleet mesh update \
    --management automatic \
    --memberships $CLUSTER_NAME \
    --location $REGION \
    --project $PROJECT_ID
```

### Verify the control plane status 
Wait until it says 'ACTIVE' or similar, may take a few minutes.
```bash
gcloud container fleet mesh describe --project $PROJECT_ID
```

## 4. Create the namespace for the application

```bash
kubectl create namespace si-istio
```

## 5. Enable Sidecar Injection
For Managed Service Mesh, we use the `istio.io/rev=asm-managed` label.

```bash
kubectl label namespace si-istio istio.io/rev=asm-managed
```

## 6. Deploy the Application

### Deploy Space invaders versions 1 and 3
```bash
kubectl apply -f istio/space-invaders-v1.yaml -n si-istio
kubectl apply -f istio/space-invaders-v3.yaml -n si-istio
```

### Deploy the service
```bash
kubectl apply -f istio/space-invaders-service.yaml -n si-istio
```

## 7. Deploy the Ingress Gateway
Since Managed Service Mesh doesn't provide a default ingress gateway, we deploy one.

```bash
# Deploy the ingress gateway deployment and service
kubectl apply -f istio/asm-ingress-gateway.yaml -n si-istio
```

## 8. Deploy Istio Configurations
Deploy Gateways, VirtualServices, and DestinationRules.

```bash
kubectl apply -f istio/istio-gateway.yaml -n si-istio
kubectl apply -f istio/istio-destination-rules.yaml -n si-istio
kubectl apply -f istio/istio-virtual-service.yaml -n si-istio
```

## 9. Deploy Peer Authentication (Strict mTLS)

```bash
kubectl apply -f istio/istio-peer-authentication.yaml -n si-istio
```

## 10. Get the Gateway IP
Find the external IP of the Ingress Gateway we deployed:

```bash
kubectl get service -n si-istio asm-ingressgateway
```

---

# CLEAN UP

## Delete resources
```bash
kubectl delete -f ./ -n si-istio
```

## Delete Cluster
```bash
gcloud container clusters delete $CLUSTER_NAME --zone $ZONE --quiet
```


