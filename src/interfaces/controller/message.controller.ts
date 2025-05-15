import { HandleCommand } from "../../application/use-cases/handle-command.use-case";
import { Message } from "../../domain/entities";

export class MessageController {
  constructor(private readonly handleCommand: HandleCommand) {}

  async handle(payload: any): Promise<void> {
    const key = payload?.data?.key;
    const fromMe = key?.fromMe === true;
    const isGroup = key?.remoteJid?.endsWith("@g.us");

    let sender: string;

    if (isGroup) {
      sender = key?.participant;
    } else {
      sender = fromMe
        ? (process.env.BOT_NUMBER || "").replace(/\D/g, "") + "@s.whatsapp.net"
        : key?.remoteJid;
    }
    const chatId = payload?.data?.key?.remoteJid;
    const text = payload?.data?.message?.conversation ?? "";
    const timestamp = payload?.data?.messageTimestamp
      ? new Date(payload.data.messageTimestamp * 1000)
      : new Date();

    const message = new Message(chatId, sender, text, timestamp, payload);
    await this.handleCommand.execute(message);
  }
}
