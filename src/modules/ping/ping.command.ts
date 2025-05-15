import { Command } from "../../decorators/command.decorator";
import { ICommandHandler } from "../../application/commands/command-handler.interface";
import { Message } from "../../domain/entities";
import { ISender } from "../../infrastructure/contracts/sender.interface";

@Command("ping", { admin: true, rateLimit: { interval: 10_000, max: 2 } })
export class PingCommand implements ICommandHandler {
  constructor(private readonly sender: ISender) {}

  async handle(message: Message): Promise<void> {
    await this.sender.sendText(message.chatId, "Pong!");
  }
}
