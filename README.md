# Database-quickly

An easy-to-use **noSQL database** (JSON database) for JavaScript and TypeScript.

## 🎈 Getting Started

To start using this package, follow these easy steps below to get you started!

### 🛠️ Installation Steps

1. Use your favorite package manager to install [`db-quickly`](https://www.npmjs.com/package/db-quickly) 🚀

2. That's it! Easy, isn't it? Have fun! ❤️

## 📰 Documentation

### Creating a New Database

To create a new database, instantiate the [`Database`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L163) class.

```js
const { Database } = require('db-quickly');

const database = new Database();
```

### Adding a Cluster

To add a new cluster to the database, use the [`addCluster`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L207) method.
```js
import { Database, Cluster } = require('db-quickly');

const database = new Database();

const cluster = new Cluster("test", "test description");
database.addCluster(cluster);
```

### Retrieving Clusters

To get all clusters in the database, use the [`getAllClusters`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L257) method.
```js
const { Database } = require('db-quickly');

const database = new Database();

const allClusters = database.getAllClusters();
console.log(allClusters);
```

To find a cluster by its ID, use the [`getClusterById`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L225) method.
```js
const { Database } = require('db-quickly');

const database = new Database();

const cluster = database.getClusterById("cluster-id");
console.log(cluster);

```

To find a cluster by its name, use the [`getClusterByName`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L241) method.
```js
const { Database } = require('db-quickly');

const database = new Database();

const cluster = database.getClusterByName("cluster-name");
console.log(cluster);
```

### Updating Clusters

To update a cluster by its ID, use the [`updateClusterById`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L319) method.
```js
const { Database } = require('db-quickly');

const database = new Database();

const clusterFromDb = database.getClusterByName("cluster-name");

clusterFromDb.data.push("x");

const updatedCluster = database.updateClusterById("cluster-id", clusterFromDb);
console.log(updatedCluster);
```

To update a cluster by its name, use the [`updateClusterByName`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L350) method.
```js
const { Database } = require('db-quickly');

const database = new Database();

const clusterFromDb = database.getClusterByName("cluster-name");

clusterFromDb.data.push("x");

const updatedCluster = database.updateClusterById("cluster-name", clusterFromDb);
console.log(updatedCluster);
```

### Deleting Clusters

To delete a cluster by its ID, use the [`deleteClusterById`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L273) method.
```js
const { Database } = require('db-quickly');

const database = new Database();

const remainingClusters = database.deleteClusterById("cluster-id");
console.log(remainingClusters);
```

To delete a cluster by its name, use the [`deleteClusterByName`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L294) method.
```js
const { Database } = require('db-quickly');

const database = new Database();

const remainingClusters = database.deleteClusterByName("cluster-name");
console.log(remainingClusters);
```

### Working with Schemas

To create a new schema item, use the [`newItem`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L155) function.
```js
const { newItem, SchemaTypes } = require('db-quickly');

//newItem(name, type, requiredField)
const item = newItem("name", SchemaTypes.String, true);
console.log(item);
```

To validate data against a schema, use the [`validateData`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L80) method of the [`Schema`](https://github.com/Kubiczeek/db-quickly/blob/main/src/index.ts#L33) class.
```js
const { newItem, SchemaTypes, Schema } = require('db-quickly');

//newItem(name, type, requiredField)
const item = newItem("name", SchemaTypes.String, true);

const schema = new Schema("testSchema", "A test schema", [item]);
const isValid = schema.validateData(data);
console.log(isValid);
```


## 🍰 Contributors

- **Kubiczeek** - _Everything_ - [GitHub Link](https://github.com/Kubiczeek)

Feel free to explore and contribute to the project!