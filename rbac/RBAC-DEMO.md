# RBAC Demo: "The Intern"

This demo simulates a scenario where you hire a new Intern. You want them to be able to **see** the application logs and configuration (including Istio routing), but you **do NOT** want them to be able to delete pods or change the deployment.

## 1. Apply the Configuration
Create the Service Account, the Role (Viewer), and the Binding.

```bash
kubectl apply -f rbac/ -n si-istio
```

## 2. Verify "The Intern" CAN see things
We use `kubectl auth can-i` to impersonate the Service Account we just created.

**Check if the intern can list Pods:**
```bash
kubectl auth can-i list pods -n si-istio --as=system:serviceaccount:si-istio:intern-user
# Output: yes
```

**Check if the intern can read Istio VirtualServices:**
```bash
kubectl auth can-i get virtualservices -n si-istio --as=system:serviceaccount:si-istio:intern-user
# Output: yes
```

## 3. Verify "The Intern" CANNOT destroy things
Now, try to see if they can delete the production deployment.

**Check if the intern can delete a pod:**
```bash
kubectl auth can-i delete pod -n si-istio --as=system:serviceaccount:si-istio:intern-user
# Output: no
```

**Check if the intern can edit the VirtualService:**
```bash
kubectl auth can-i apply virtualservices -n si-istio --as=system:serviceaccount:si-istio:intern-user
# Output: no
```

## Why this is useful
This demonstrates that RBAC applies not just to "standard" objects like Pods, but also to the Custom Resources (CRDs) provided by Istio. You can have a team member who can *audit* the Service Mesh configuration without risking breaking the traffic flow.
