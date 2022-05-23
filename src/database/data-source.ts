import { DataSource } from "typeorm"
import { MusicLog } from "./entity/MusicLog"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db.sqlite",
    synchronize: true,
    logging: false,
    entities: [
        MusicLog
    ],
    migrations: [
        "migration/*.ts"
    ],
})
