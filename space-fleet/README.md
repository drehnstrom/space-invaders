# Space Invaders - GKE Fleet Configuration

This folder contains the Kubernetes configurations for deploying Space Invaders to GKE Fleets with ConfigSync.

## Files

- **namespace.yaml**: Creates the `space-fleet` namespace
- **deployment.yaml**: Deploys Space Invaders with 3 replicas (currently v1.0)
- **service.yaml**: Creates a LoadBalancer service to expose the application

## GKE Fleet + ConfigSync Demo Instructions

### Step 1: Register Clusters to Fleet
```bash
gcloud container fleet memberships register CLUSTER_NAME \
  --project=PROJECT_ID \
  --gke-cluster=LOCATION/CLUSTER_NAME
```

### Step 2: Enable ConfigSync on Fleet
```bash
gcloud container fleet config-management enable \
  --project=PROJECT_ID
```

### Step 3: Configure ConfigSync to Monitor This Repository
Create a ConfigManagement resource pointing to this folder:
```bash
kubectl apply -f - <<EOF
apiVersion: configmanagement.gke.io/v1
kind: ConfigManagement
metadata:
  name: config-management
spec:
  clusterName: CLUSTER_NAME
  configConnector:
    enabled: true
  hierarchyController:
    enableHierarchyResourceQuota: true
    enablePodTreeLabels: true
    enabled: true
  policyController:
    enabled: true
  configSync:
    enabled: true
    syncBranch: main
    syncRepo: https://github.com/drehnstrom/space-invaders
    syncWait: 60
    syncRev: HEAD
    secretType: ssh
    sourceFormat: unstructured
    metricsGcpServiceAccountEmail: fleet-sync@PROJECT_ID.iam.gserviceaccount.com
EOF
```

### Step 4: Demo the Automatic Deployment
After ConfigSync syncs (usually within 1-2 minutes), verify the deployment:
```bash
kubectl get pods -n space-fleet
kubectl get svc -n space-fleet
```

Access Space Invaders via the LoadBalancer external IP.

### Step 5: Demonstrate GitOps - Update to v3
1. Edit [deployment.yaml](deployment.yaml) and change:
   - `image: drehnstrom/space-invaders:v1.0` → `drehnstrom/space-invaders:v3.0`
   - `version: v1` label → `version: v3`

2. Commit and push to GitHub

3. ConfigSync will automatically detect the change and update all registered clusters

4. Watch the new version roll out:
```bash
kubectl rollout status deployment/space-invaders -n space-fleet
kubectl set image deployment/space-invaders space-invaders=drehnstrom/space-invaders:v3.0 -n space-fleet
```

## Notes

- The namespace `space-fleet` is created automatically
- 3 replicas ensure high availability
- LoadBalancer service provides external access
- Resource limits prevent cluster resource exhaustion
- All configurations are GitOps-managed via ConfigSync
