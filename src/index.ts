import { loadJSON, saveJSON, generateId } from "./utilities.js";
import { ICluster, IDatabase, SchemaTypes, ISchemaItem } from "./types.js";
import { CustomError as _Error, ErrorType as _ErrorType } from "./error.js";

class Cluster implements ICluster {
  _id: string;
  name: string;
  description: string;
  data: Array<unknown>;
  constructor(name: string, description: string) {
    this._id = generateId();
    this.name = name;
    this.description = description;
    this.data = [];
  }
  createCluster(name: string, description: string): Cluster {
    return new Cluster(name, description);
  }
  insertData(data: unknown): void {
    this.data.push(data);
  }
}

export class Schema {
  _id: string;
  name: string;
  description: string;
  data: Array<ISchemaItem>;
  constructor(name: string, description: string, schema: Array<ISchemaItem>) {
    this._id = generateId();
    this.name = name;
    this.description = description;
    this.data = schema;
  }

  createSchema(
    name: string,
    description: string,
    schema: Array<ISchemaItem>
  ): Schema {
    return new Schema(name, description, schema);
  }

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
 * @param required
 * @returns
 */
export function newItem(
  name: string,
  type: SchemaTypes,
  required: boolean
): ISchemaItem {
  return { name, type, required };
}

export function createSchema(
  name: string,
  description: string,
  schema: Array<ISchemaItem>
): Schema {
  return new Schema(name, description, schema);
}

export class Database implements IDatabase {
  name: string;
  description: string;
  path: string = "./";
  FILE_NAME: string = "db-quickly.json";
  clusters: Array<Cluster>;
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
      return this;
    }
  }
  addCluster(cluster: Cluster): void {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters.push(cluster);
    saveJSON(this.path.concat(this.FILE_NAME), db);
  }

  getClusterById(id: string): Cluster | undefined {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    return db.clusters.find((cluster: Cluster) => cluster._id === id);
  }

  getClusterByName(name: string): Cluster | undefined {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    return db.clusters.find((cluster: Cluster) => cluster.name === name);
  }

  getAllClusters(): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    return db.clusters;
  }

  deleteClusterById(id: string): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.filter((cluster: Cluster) => cluster._id !== id);
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }

  deleteClusterByName(name: string): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.filter(
      (cluster: Cluster) => cluster.name !== name
    );
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }

  updateClusterById(id: string, cluster: Cluster): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.map((item: Cluster) => {
      if (item._id === id) {
        return cluster;
      }
      return item;
    });
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }

  updateClusterByName(name: string, cluster: Cluster): Array<Cluster> {
    const db: Database = loadJSON(this.path.concat(this.FILE_NAME)) as Database;
    db.clusters = db.clusters.map((item: Cluster) => {
      if (item.name === name) {
        return cluster;
      }
      return item;
    });
    saveJSON(this.path.concat(this.FILE_NAME), db);
    return db.clusters;
  }
}
