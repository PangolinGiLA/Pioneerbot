import { AppDataSource } from "./data-source"
import { MusicLog } from "./entity/MusicLog"

export class MusicLogger {
    public static async log(ytid: string, user: string, guildId: string, random: boolean) {
        const log = new MusicLog()
        log.ytid = ytid
        log.requestedBy = user
        log.random = random
        log.guildId = guildId
        log.playedAt = new Date()
        await AppDataSource.manager.save(log)
    }

    public static async getRandomSong(guildId: string) {
        return await AppDataSource
        .getRepository(MusicLog)
        .createQueryBuilder("entry")
        .where("entry.guildId = :guildId", { guildId })
        .groupBy("entry.ytid")
        .orderBy("RANDOM()", "DESC")
        .getOne()
    }
}