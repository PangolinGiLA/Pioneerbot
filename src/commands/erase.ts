'use strict'
import { Message } from "discord.js";
import { getVideoID, validateURL } from "ytdl-core";
import { MusicLogger } from "../database/database";
import { Wrapper } from "../structures";

export const aliases = ["e"];

export const description = "Removes song from library (won't be choosen with `playRandom` command)";

export const usage = "[link]";

export const erase = async (ID: string, queues: Wrapper, message: Message, args: string[]) => {
    if (args.length > 0) {
        // check if link is valid
        const link = args[0];
        if (validateURL(link)) {
            let ytid = getVideoID(link);
            await MusicLogger.removeSongFromGuild(ytid, ID);
            // done
            message.channel.send("ok");
        } else {
            // link not valid
        }
    } else {
        // no link
    }
}
