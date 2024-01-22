import { describe, it, expect } from "vitest";
import { Database } from "./index.js";

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
