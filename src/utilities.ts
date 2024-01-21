import fs from "fs";
import { IDatabase } from "./types";

export function loadJSON(path: string): IDatabase | null {
  return fs.existsSync(path)
    ? JSON.parse(fs.readFileSync(path, "utf-8"))
    : null;
}

export function saveJSON(path: string, json: IDatabase): void {
  return fs.writeFileSync(path, JSON.stringify(json));
}

export function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
}
