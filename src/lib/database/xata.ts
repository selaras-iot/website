// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "environments",
    columns: [{ name: "name", type: "text", notNull: true, defaultValue: "" }],
    revLinks: [{ column: "environment", table: "devices" }],
  },
  {
    name: "devices",
    columns: [
      { name: "environment", type: "link", link: { table: "environments" } },
      { name: "name", type: "text", notNull: true, defaultValue: "" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Environments = InferredTypes["environments"];
export type EnvironmentsRecord = Environments & XataRecord;

export type Devices = InferredTypes["devices"];
export type DevicesRecord = Devices & XataRecord;

export type DatabaseSchema = {
  environments: EnvironmentsRecord;
  devices: DevicesRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Rizal-Dwi-Anggoro-s-workspace-td9vgj.us-east-1.xata.sh/db/selaras-iot",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};