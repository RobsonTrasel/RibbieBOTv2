import { Message } from "../../domain/entities";
import { Command } from "../../domain/value-objects";
import { CommandBus } from "./command-bus.use-case";
import { ISender } from "../../infrastructure/contracts/sender.interface";

export class HandleCommand {
  constructor(
    private readonly sender: ISender,
    private readonly commandBus: CommandBus
  ) {}

  public async execute(message: Message): Promise<void> {
    if (message.isEmpty()) {
      return;
    }

    const command = new Command(message.body);

    if (!command.isValid()) {
      return;
    }

    const name = command.name;

    if (!this.commandBus.isRegistered(name)) {
      await this.sender.sendText(
        message.chatId,
        `Comando desconhecido: ${name}`
      );
      return;
    }

    await this.commandBus.execute(name, message);
  }
}
