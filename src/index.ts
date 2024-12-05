import { loadJSON, saveJSON, generateId } from "./utilities.js";
import { ICluster, IDatabase, SchemaTypes, ISchemaItem } from "./types.js";
import { CustomError as _Error, ErrorType as _ErrorType } from "./error.js";

export class Cluster implements ICluster {
  _id: string;
  name: string;
  description: string;
  data: Array<unknown>;
  constructor(name: string | number | boolean, description: string | number | boolean, id: string = generateId()) {
    this._id = id;
    this.name = name.toString();
    this.description = description.toString();
    this.data = [];
  }
  createCluster(name: string, description: string): Cluster {
    return new Cluster(name, description);
  }

  /**
   * Inserts data into the cluster
   * @param data unknown
   * @example <caption>Example usage of insertData function.</caption>
   * ```js
   * const cluster = new Cluster("test", "test");
   * cluster.insertData("test");
   * ```
   */
  insertData(data: unknown): void {
    this.data.push(data);
  }
}

export class Schema {
  _id: string;
  name: string;
  description: string;
  data: Array<ISchemaItem>;
  /**
   * Creates an instance of Schema.
   * @param {string} name
   * @param {string} description
   * @param {Array<ISchemaItem>} schema
   * @example <caption>Example usage of Schema class and validation.</caption>
   * ```js
   * const schema = new Schema("test", "test", [
   * 	newItem("name", SchemaTypes.String, true),
   * 	newItem("good", SchemaTypes.Boolean, false),
   * ]);
   * schema.validateData({ name: "test" }); // returns { success: true }
   * schema.validateData({ name: 1 }); // returns { success: false, error: Error }
   * schema.validateData({ name: "test", good: true }); // returns { success: true }
   * schema.validateData({ name: "test", good: 1 }); // returns { success: false, error: Error }
   * schema.validateData({ name: "test", good: true, bad: true }); // returns { success: false, error: Error }
   * ```
   */
  constructor(name: string, description: string, schema: Array<ISchemaItem>) {
    this._id = generateId();
    this.name = name;
    this.description = description;
    this.data = schema;
  }

  /**
   * @param {object} inputData
   * @param {Schema} [schema=this]
   * @returns {object} { success: boolean; error?: _Error | unknown }
   * @example <caption>Example usage of validateData function.</caption>
   * ```js
   * const schema = new Schema("test", "test", [
   * 	newItem("name", SchemaTypes.String, true),
   * 	newItem("good", SchemaTypes.Boolean, false),
   * ]);
   * schema.validateData({ name: "test" }); // returns { success: true }
   * schema.validateData({ name: 1 }); // returns { success: false, error: Error }
   * schema.validateData({ name: "test", good: true }); // returns { success: true }
   * schema.validateData({ name: "test", good: 1 }); // returns { success: false, error: Error }
   * schema.validateData({ name: "test", good: true, bad: true }); // returns { success: false, error: Error }
   * ```
   */
  validateData(
    inputData: object,
    schema?: Schema
  ): { success: boolean; error?: _Error | unknown } {
    const data = schema ? schema.data : this.data;
    const requiredFields: Array<ISchemaItem> = data.filter(
      (item: ISchemaItem) => item.required
    );
    const optionalFields: Array<ISchemaItem> = data.filter(
      (item: ISchemaItem) => !item.required
    );
    try {
      for (const requiredItem of requiredFields) {
        if (!(requiredItem.name in inputData)) {
          throw new _Error(
            `Missing required field: ${requiredItem.name}`,
            _ErrorType.MissingKey
          );
        }
        if (
          requiredItem.type !==
          typeof inputData[requiredItem.name as keyof typeof inputData]
        ) {
          throw new _Error(
            `Invalid type for the required field: ${requiredItem.name}`,
            _ErrorType.InvalidType
          );
        }
        if (inputData[requiredItem.name as keyof typeof inputData] == null) {
          throw new _Error(
            `Missing value for the required field: ${requiredItem.name}`,
            _ErrorType.MissingValue
          );
        }
      }
      for (const optionalItem of optionalFields) {
        if (optionalItem.name in inputData) {
          if (
            optionalItem.type !==
            typeof inputData[optionalItem.name as keyof typeof inputData]
          ) {
            throw new _Error(
              `Invalid type for the optional field: ${optionalItem.name}`,
              _ErrorType.InvalidType
            );
          }
        }
      }
    } catch (error) {
      return { success: false, error };
    }
    return { success: true };
  }
}

/**
 * @param name string
 * @param type SchemaTypes
 * @param required boolean
 * @returns ISchemaItem
 * @example <caption>Example usage of newItem function.</caption>
 * ```js
 * const name = "name";
 * const type = SchemaTypes.String;
 * const required = true;
 * const item = newItem(name, type, required);
 * ```
 * @example <caption>Usage of newItem function when creating Schema</caption>
 * ```js
 * const schema = new Schema("test", "test", [
 *  newItem("name", SchemaTypes.String, true),
 * 	newItem("good", SchemaTypes.Boolean, false),
 * ]);
 * ```
 */
export function newItem(
  name: string,
  type: SchemaTypes,
  required: boolean
): ISchemaItem {
  return { name, type, required };
}

export class Database implements IDatabase {
  name: string;
  description: string;
  path: string = "./";
  FILE_NAME: string = "db-quickly.json";
  clusters: Array<Cluster>;
  /**
   * Creates an instance of Database.
   * @param {string} [name="default-name"]
   * @param {string} [description="Default description"]
   * @param {string} [path="./"]
   * @param {boolean} [override=false]
   * @example <caption>Example usage of Database class.</caption>
   * ```js
   * const database = new Database();
   * ```
   */
  constructor(
    name?: string,
    description?: string,
    path?: string,
    override?: boolean
  ) {
    this.name = name || "default-name";
    this.description = description || "Default description";
    this.path = path || "./";
    this.FILE_NAME = "db-quickly.json";
    this.clusters = [];
    if (!loadJSON(this.path.concat(this.FILE_NAME)) || override) {
      saveJSON(this.path.concat(this.FILE_NAME), this);
      return this as Database;
    }
  }

  /**
   * Adds a cluster to the database
   * @param {Cluster} cluster
   * @returns {Cluster}
   * @example <caption>Example usage of addCluster function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.addCluster("test", "test");
   * ```
   */
  addCluster(cluster: Cluster): void {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters.push(cluster);
    this.clusters.push(cluster);
    saveJSON(this.path.concat(this.FILE_NAME), db);
  }

  /**
   * Finds a cluster by id
   * @param {string} id
   * @returns {Cluster | undefined}
   * @example <caption>Example usage of getClusterById function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.createCluster("test", "test");
   * const foundCluster = database.getClusterById(cluster._id);
   * ```
   */
  getClusterById(id: string): Cluster | undefined {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    return db.clusters.find((cluster: Cluster) => cluster._id === id);
  }

  /**
   * Finds a cluster by name
   * @param {string} name
   * @returns {Cluster | undefined}
   * @example <caption>Example usage of getClusterByName function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.createCluster("test", "test");
   * const foundCluster = database.getClusterByName(cluster.name);
   * ```
   */
  getClusterByName(name: string): Cluster | undefined {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    const clusters = db.clusters.map(
        (cluster: Cluster) => new Cluster(cluster.name, cluster.description, cluster._id)
    );
    const cluster = clusters.find((cluster: Cluster) => cluster.name === name);
    console.log(cluster?.constructor.name);
    return cluster;
  }

  /**
   * Gets all clusters
   * @returns {Array<Cluster>}
   * @example <caption>Example usage of getAllClusters function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.createCluster("test", "test");
   * const cluster = database.createCluster("test2", "test2");
   * const allClusters = database.getAllClusters();
   * ```
   */
  getAllClusters(): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    return db.clusters;
  }

  /**
   * Deletes a cluster by id
   * @param {string} id
   * @returns {Array<Cluster>}
   * @example <caption>Example usage of deleteClusterById function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.createCluster("test", "test");
   * const allClusters = database.deleteClusterById(cluster._id);
   * ```
   */
  deleteClusterById(id: string): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.filter((cluster: Cluster) => cluster._id !== id);
    this.clusters = this.clusters.filter(
      (cluster: Cluster) => cluster._id !== id
    );
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }

  /**
   * Deletes a cluster by name
   * @param {string} name
   * @returns {Array<Cluster>}
   * @example <caption>Example usage of deleteClusterByName function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.createCluster("test", "test");
   * const allClusters = database.deleteClusterByName("test");
   * ```
   */
  deleteClusterByName(name: string): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.filter(
      (cluster: Cluster) => cluster.name !== name
    );
    this.clusters = this.clusters.filter(
      (cluster: Cluster) => cluster.name !== name
    );
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }

  /**
   * Updates a cluster by id
   * @param {string} id
   * @param {Cluster} cluster
   * @returns {Array<Cluster>}
   * @example <caption>Example usage of updateClusterById function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.createCluster("test", "test");
   * cluster.insertData("test");
   * const updatedCluster = database.updateClusterById(cluster._id, cluster);
   * ```
   */
  updateClusterById(id: string, cluster: Cluster): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.map((item: Cluster) => {
      if (item._id === id) {
        return cluster;
      }
      return item;
    });
    this.clusters = this.clusters.map((item: Cluster) => {
      if (item._id === id) {
        return cluster;
      }
      return item;
    });
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }

  /**
   * Updates a cluster by name
   * @param {string} name
   * @param {Cluster} cluster
   * @returns {Array<Cluster>}
   * @example <caption>Example usage of updateClusterByName function.</caption>
   * ```js
   * const database = new Database();
   * const cluster = database.createCluster("test", "test");
   * cluster.insertData("test");
   * const updatedCluster = database.updateClusterByName("test", cluster);
   * ```
   */
  updateClusterByName(name: string, cluster: Cluster): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.map((item: Cluster) => {
      if (item.name === name) {
        return cluster;
      }
      return item;
    });
    this.clusters = this.clusters.map((item: Cluster) => {
      if (item.name === name) {
        return cluster;
      }
      return item;
    });
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }
}
