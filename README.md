# Database-quickly

Welcome to my little **side** project! It's simple "json" database. To use it:

1.  Use your favourite package manager to install `db-quickly` 🚀
2.  Import it using `const Database = require("db-quickly");` 📁
3.  Have fun! ❤️

There are plenty of functions to use, make sure to check them out!

Example of use:

```js
const Database = require("db-quickly-js");

Database.initializeDatabase(
  "Great Database",
  "This database is used to store the greatest data",
  false
);
let cluster1 = Database.createCluster();
let cluster2 = Database.createCluster(
  "ClusterName",
  "Description of this cluster"
);

Database.addCluster(cluster1);
Database.addCluster(cluster2);

let allClusters = Database.getAllClusters();
console.log(allClusters);

cluster1.clusterName = "UpdatedClusterName";
cluster2.clusterName = "UpdatedClusterNameNumber2";

Database.updateClusterByName("Cluster1", cluster1);
Database.updateClusterById(cluster2._id, cluster2);

allClusters = Database.getAllClusters();
console.log(allClusters);

Database.deleteClusterByName("UpdatedClusterName");
Database.deleteClusterById(cluster2._id);

console.log(Database.getAllClusters());
```

If you have any questions, make sure to contact me on **Discord** `kubiczeek`
