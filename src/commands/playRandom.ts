'use strict'
import { Message } from "discord.js";
import { Wrapper, Song } from "../structures";
import { messageProvider } from "../messageProvider";

import { join } from './join';
import { searchList } from './search';
import { checkQueue } from "../utils";
import { MusicLogger } from "../database/database";

export const aliases = ["pr"];

export const description = "Randomly pick one somg from previous played songs and play it to the voice channel.";
export const usage = "[count]";

export const playRandom = async (ID: string, queues: Wrapper, message: Message, args: string[]) => {
    const query = args.map((element) => { return element }).join(' ');
    let count = args.length > 0 ? parseInt(args[0]) : 1;
    for (let i = 0; i < count; i++) {
        let randomEntry = await MusicLogger.getRandomSong(ID);
        if (randomEntry) {
            let url = `https://www.youtube.com/watch?v=${randomEntry.ytid}`;
            let randomSong = await Song.build(url, message.member);
            if (randomSong) {
                randomSong.random = true;
            } else {
                console.log("Broken link in database!", url);
                await MusicLogger.removeSong(randomEntry.ytid);
                break;
            }
            playSong(ID, queues, message, randomSong);
        } else {
            console.log("There is no history in this guild!")
            // probably should send a message
        }
    }

}

const playSong = async (ID: string, queues: Wrapper, message: Message, song: Song) => {
    const QUEUE = await checkQueue(ID, queues, message, true);
    if (QUEUE == null) return null;

    QUEUE.push(song);

    if (QUEUE.length() == 1) {
        QUEUE.playResource();
    }
    else {
        message.channel.send({ embeds: [messageProvider.queueAdd(song, QUEUE.length() - 1)] });
    }
}

const getStatus = async (ID: string, queues: Wrapper, message: Message) => {
    if (queues.get(ID) == null) await join(ID, queues, message);
    const QUEUE = queues.get(ID);
    if (QUEUE == null) return null;

    message.channel.send({ embeds: [messageProvider.play(QUEUE.front())] });
}
