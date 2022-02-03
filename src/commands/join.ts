'use strict'
import { Wrapper, Queue } from "../structures";
import { Message } from "discord.js";
import { createAudioPlayer, joinVoiceChannel, entersState, VoiceConnectionStatus, DiscordGatewayAdapterCreator } from "@discordjs/voice";

export const join = async (ID: string, queues: Wrapper, message: Message, args:string[] = []) => {
	await createConnection(ID, queues, message, args);
};

export const aliases = ["j"];

const createConnection = async (ID: string, queues: Wrapper, message: Message, args:string[]) => {

	const voice = message.member?.voice;
	if (voice == undefined || voice.channelId == null) return; // user not in voice channel

	const player = createAudioPlayer();

	const connection = joinVoiceChannel({
		channelId: voice.channelId,
		guildId: ID,
		adapterCreator: voice.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
		selfDeaf: false
	});

	if (queues.get(ID) == null) {
		queues.add(ID, new Queue(ID, voice.channelId, message.channel, connection, player));
	}

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 10e3);
	}
	catch (err) {
		connection.destroy();
		message.channel.send("couldn't connect to channel");
	}

	connection.subscribe(player);
}
