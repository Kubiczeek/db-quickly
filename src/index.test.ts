import { describe, it, expect, beforeEach } from "vitest";
import { Database, Schema, newItem, Cluster } from "./index.js";
import { SchemaTypes } from "./types.js";

describe("Database", () => {
  // Database can be instantiated with default values
  it("should instantiate Database with default values", () => {
    const database = new Database();
    expect(database.name).toBe("default-name");
    expect(database.description).toBe("Default description");
    expect(database.path).toBe("./");
    expect(database.FILE_NAME).toBe("db-quickly.json");
    expect(database.clusters).toEqual([]);
  });

  // Database can be instantiated with custom values
  it("should instantiate Database with custom values", () => {
    const name = "custom-name";
    const description = "Custom description";
    const path = "./custom-path/";
    const database = new Database(name, description, path, true);
    expect(database.name).toBe(name);
    expect(database.description).toBe(description);
    expect(database.path).toBe(path);
    expect(database.FILE_NAME).toBe("db-quickly.json");
    expect(database.clusters).toEqual([]);
  });
  // Database can be instantiated with override flag
  it("should instantiate Database with override flag", () => {
    const name = "custom-name";
    const description = "Custom description";
    const path = "./custom-path/";
    const override = true;
    const database = new Database(name, description, path, override);
    expect(database.name).toBe(name);
    expect(database.description).toBe(description);
    expect(database.path).toBe(path);
    expect(database.FILE_NAME).toBe("db-quickly.json");
    expect(database.clusters).toEqual([]);
  });

  // Database can be instantiated with empty name
  it("should instantiate Database with empty name", () => {
    const name = "";
    const description = "Default description";
    const path = "./";
    const database = new Database(name, description, path);
    expect(database.name).toBe("default-name");
    expect(database.description).toBe(description);
    expect(database.path).toBe(path);
    expect(database.FILE_NAME).toBe("db-quickly.json");
    expect(database.clusters).toEqual([]);
  });

  // Database can be instantiated with empty description
  it("should instantiate Database with empty description", () => {
    const name = "default-name";
    const description = "";
    const path = "./";
    const database = new Database(name, description, path);
    expect(database.name).toBe(name);
    expect(database.description).toBe("Default description");
    expect(database.path).toBe(path);
    expect(database.FILE_NAME).toBe("db-quickly.json");
    expect(database.clusters).toEqual([]);
  });

  // Database can be instantiated with empty path
  it("should instantiate Database with empty path", () => {
    const name = "default-name";
    const description = "Default description";
    const path = "";
    const database = new Database(name, description, path);
    expect(database.name).toBe(name);
    expect(database.description).toBe(description);
    expect(database.path).toBe("./");
    expect(database.FILE_NAME).toBe("db-quickly.json");
    expect(database.clusters).toEqual([]);
  });
});

describe("Database Methods", () => {
  let database: Database;
  let cluster: Cluster;

  beforeEach(() => {
    database = new Database(
      "Test Database",
      "This is a test database",
      "./",
      true
    );
    cluster = new Cluster("Test Cluster", "This is a test cluster");
  });

  it("should add a cluster to the database", () => {
    database.addCluster(cluster);
    expect(database.clusters.length).toBe(1);
    expect(database.clusters[0]).toBe(cluster);
  });

  it("should find a cluster by id", () => {
    database.addCluster(cluster);
    const foundCluster = database.getClusterById(cluster._id);
    console.log(foundCluster);
    console.log(cluster);
    expect(foundCluster).toEqual(cluster);
  });

  it("should find a cluster by name", () => {
    database.addCluster(cluster);
    const foundCluster = database.getClusterByName(cluster.name);
    expect(foundCluster).toEqual(cluster);
  });

  it("should get all clusters", () => {
    database.addCluster(cluster);
    const allClusters = database.getAllClusters();
    expect(allClusters.length).toBe(1);
    expect(allClusters[0]).toEqual(cluster);
  });

  it("should delete a cluster by id", () => {
    database.addCluster(cluster);
    const allClusters = database.deleteClusterById(cluster._id);
    expect(allClusters.length).toBe(0);
  });

  it("should delete a cluster by name", () => {
    database.addCluster(cluster);
    const allClusters = database.deleteClusterByName(cluster.name);
    expect(allClusters.length).toBe(0);
  });

  it("should update a cluster by id", () => {
    database.addCluster(cluster);
    const updatedCluster = new Cluster(
      "Updated Cluster",
      "This is an updated cluster"
    );
    const updatedClusters = database.updateClusterById(
      cluster._id,
      updatedCluster
    );
    expect(updatedClusters.length).toBe(1);
    expect(updatedClusters[0]).toBe(updatedCluster);
  });

  it("should get a cluster by name and add data to it", () => {
    database.addCluster(cluster);
    const foundCluster = database.getClusterByName(cluster.name);
    const data = "Data 1";
    foundCluster?.insertData(data);
    expect(foundCluster?.data.length).toBe(1);
    expect(foundCluster?.data[0]).toBe(data);
  });
});

describe("Cluster", () => {
  // Cluster can be instantiated with a name and description
  it("should instantiate Cluster with a name and description", () => {
    const cluster = new Cluster("Test Cluster", "This is a test cluster");
    expect(cluster.name).toBe("Test Cluster");
    expect(cluster.description).toBe("This is a test cluster");
  });

  // Cluster's _id is generated upon instantiation
  it("should generate _id upon instantiation", () => {
    const cluster = new Cluster("Test Cluster", "This is a test cluster");
    expect(cluster._id).toBeDefined();
    expect(typeof cluster._id).toBe("string");
  });

  // Data can be inserted into Cluster
  it("should insert data into Cluster", () => {
    const cluster = new Cluster("Test Cluster", "This is a test cluster");
    cluster.insertData("Data 1");
    cluster.insertData("Data 2");
    expect(cluster.data.length).toBe(2);
    expect(cluster.data[0]).toBe("Data 1");
    expect(cluster.data[1]).toBe("Data 2");
  });

  // Cluster can be instantiated with empty name and description
  it("should instantiate Cluster with empty name and description", () => {
    const cluster = new Cluster("", "");
    expect(cluster.name).toBe("");
    expect(cluster.description).toBe("");
  });

  // Data of different types can be inserted into Cluster
  it("should insert data of different types into Cluster", () => {
    const cluster = new Cluster("Test Cluster", "This is a test cluster");
    cluster.insertData("String");
    cluster.insertData(123);
    cluster.insertData(true);
    expect(cluster.data.length).toBe(3);
    expect(cluster.data[0]).toBe("String");
    expect(cluster.data[1]).toBe(123);
    expect(cluster.data[2]).toBe(true);
  });

  // Cluster can be instantiated with non-string name and description
  it("should instantiate Cluster with non-string name and description", () => {
    const cluster = new Cluster(123, true);
    expect(cluster.name).toBe("123");
    expect(cluster.description).toBe("true");
  });
});

describe("Cluster Methods", () => {
  let cluster: Cluster;

  beforeEach(() => {
    cluster = new Cluster("Test Cluster", "This is a test cluster");
  });

  it("should create a new cluster", () => {
    const newCluster = cluster.createCluster(
      "New Cluster",
      "This is a new cluster"
    );
    expect(newCluster.name).toBe("New Cluster");
    expect(newCluster.description).toBe("This is a new cluster");
    expect(newCluster.data.length).toBe(0);
  });

  it("should insert data into the cluster", () => {
    cluster.insertData("Test Data");
    expect(cluster.data.length).toBe(1);
    expect(cluster.data[0]).toBe("Test Data");
  });
});

describe("Schema", () => {
  let schema: Schema;

  beforeEach(() => {
    schema = new Schema("Test Schema", "This is a test schema", [
      newItem("name", SchemaTypes.String, true),
      newItem("good", SchemaTypes.Boolean, false),
    ]);
  });

  it("should instantiate Schema with a name, description, and schema", () => {
    expect(schema.name).toBe("Test Schema");
    expect(schema.description).toBe("This is a test schema");
    expect(schema.data.length).toBe(2);
  });

  it("should validate data correctly", () => {
    const validData = { name: "test", good: true };
    const invalidData = { name: 1, good: true };
    const missingData = { good: true };
    const extraData = { name: "test", good: true, bad: true };

    expect(schema.validateData(validData).success).toBe(true);
    expect(schema.validateData(invalidData).success).toBe(false);
    expect(schema.validateData(missingData).success).toBe(false);
    expect(schema.validateData(extraData).success).toBe(true);
  });
});

describe("Validation", () => {
  it("should create schema with test item", () => {
    const schema = new Schema("test", "test", [
      newItem("name", SchemaTypes.String, true),
    ]);
    expect(schema.name).toBe("test");
    expect(schema.description).toBe("test");
    expect(schema.data).toEqual([newItem("name", SchemaTypes.String, true)]);
  });

  it("create schema and validate it - return success", () => {
    const schema = new Schema("test", "test", [
      newItem("name", SchemaTypes.String, true),
      newItem("good", SchemaTypes.Boolean, false),
    ]);

    const { success } = schema.validateData({ name: "test" });
    expect(success).toBe(true);
  });

  it("create schema and validate it with error - returns error", () => {
    const schema = new Schema("test", "test", [
      newItem("name", SchemaTypes.String, true),
      newItem("good", SchemaTypes.Boolean, false),
    ]);

    const { success, error } = schema.validateData({ name: 1 });
    expect(success).toBe(false);
    expect(error).toBeInstanceOf(Error);
  });
});
