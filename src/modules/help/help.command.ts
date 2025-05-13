import {Command} from "../../decorators/command.decorator";
import {ICommandHandler} from "../../application/commands/command-handler.interface";
import {EvolutionSender} from "../../infrastructure/evolution/evolution.sender";
import {Message} from "../../domain/entities";

@Command('help')
export class HelpCommand implements ICommandHandler {
    constructor(private readonly sender: EvolutionSender) {}

    async handle(message: Message): Promise<void> {
        await this.sender.sendText(
            message.chatId,
            `📜 Comandos disponíveis:\n• !ping\n• !help`
        );
    }
}