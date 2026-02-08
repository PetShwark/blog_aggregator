import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { readConfig, Config } from "../../config";

const config = readConfig() ?? { dbUrl: "postgres://example", currentUserName: "" } as Config
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema });