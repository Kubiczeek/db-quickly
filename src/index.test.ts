import { describe, it, expect } from "vitest";
import { Database, Schema, newItem } from "./index.js";
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
