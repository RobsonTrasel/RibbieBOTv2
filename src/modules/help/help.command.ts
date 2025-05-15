import { Command } from "../../decorators/command.decorator";
import { ICommandHandler } from "../../application/commands/command-handler.interface";
import { Message } from "../../domain/entities";
import { ISender } from "../../infrastructure/contracts/sender.interface";

@Command("help", { admin: true })
export class HelpCommand implements ICommandHandler {
  constructor(private readonly sender: ISender) {}

  async handle(message: Message): Promise<void> {
    await this.sender.sendText(
      message.chatId,
      `📜 Comandos disponíveis:\n• !ping\n• !help`
    );
  }
}
