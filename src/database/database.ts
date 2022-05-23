import { AppDataSource } from "./data-source"
import { MusicLog } from "./entity/MusicLog"

export class MusicLogger {
    public static async log(ytid: string, user: string, guildId: string, random: boolean, playedAt?: Date) {
        const log = new MusicLog()
        log.ytid = ytid
        log.requestedBy = user
        log.random = random
        log.guildId = guildId
        log.playedAt = playedAt ? playedAt : new Date()
        await AppDataSource.manager.save(log)
    }

    public static async getRandomSong(guildId: string) {
        return await AppDataSource
        .getRepository(MusicLog)
        .createQueryBuilder("entry")
        .where("entry.guildId = :guildId", { guildId })
        .andWhere("entry.removed = false")
        .groupBy("entry.ytid")
        .orderBy("RANDOM()", "DESC")
        .getOne()
    }

    public static async removeSong(ytid: string) {
        await AppDataSource.manager.update(MusicLog, {ytid: ytid}, { removed: true });
    }

    public static async removeSongFromGuild(ytid: string, guildId: string) {
        await AppDataSource.manager.update(MusicLog, {ytid: ytid, guildId: guildId}, { removed: true });
    }
}