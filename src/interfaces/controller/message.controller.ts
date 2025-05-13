import {HandleCommand} from "../../application/use-cases/handle-command.use-case";
import {Message} from "../../domain/entities";

export class MessageController {
    constructor(private readonly handleCommand: HandleCommand) {}

    async handle(payload: any): Promise<void> {
        const sender = payload?.sender;
        const chatId = payload?.data?.key?.remoteJid;
        const text = payload?.data?.message?.conversation ?? '';
        const timestamp = payload?.data?.messageTimestamp
            ? new Date(payload.data.messageTimestamp * 1000)
            : new Date();

        const message = new Message(chatId, sender, text, timestamp, payload);
        await this.handleCommand.execute(message);
    }
}
