export enum SchemaTypes {
	String = "string",
	Number = "number",
	Boolean = "boolean",
	Date = "date",
	Array = "array",
	Object = "object",
	ObjectId = "objectId",
	Mixed = "mixed",
}

export interface ISchemaItem {
	name: string;
	type: SchemaTypes;
	required: boolean;
}

export interface ICluster {
	_id: string;
  name: string;
  description: string;
  data: Array<unknown>;
  createCluster(name: string, description: string): void;
  insertData(data: unknown): void;
}

export interface IDatabase {
  name: string;
  description: string;
  path: string;
  FILE_NAME: string;
  clusters: Array<ICluster>;
  initializeDatabase({
    name,
    description,
    path,
    override,
  }: {
    name: string;
    description: string;
    path: string;
    override: boolean;
  }): void;
}
