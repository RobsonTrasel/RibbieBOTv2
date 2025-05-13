import {EvolutionSender} from "../infrastructure/evolution/evolution.sender";
import {CommandBus} from "../application/use-cases/command-bus.use-case";
import {HandleCommand} from "../application/use-cases/handle-command.use-case";
import {MessageController} from "../interfaces/controller/message.controller";
import {ICommandHandler} from "../application/commands/command-handler.interface";
import {getCommandName} from "../decorators/command.decorator";
import {PingCommand, HelpCommand} from "../modules";

export class AppContainer {
    public readonly controller: MessageController;

    constructor() {
        const sender = new EvolutionSender();
        const commandBus = new CommandBus();

        this.registerAllCommands(commandBus, sender);

        const handleCommand = new HandleCommand(sender, commandBus);
        this.controller = new MessageController(handleCommand);
    }

    private registerAllCommands(commandBus: CommandBus, sender: EvolutionSender): void {
        const handlers: Function[] = [PingCommand, HelpCommand];

        for (const handlerClass of handlers) {
            const commandName = getCommandName(handlerClass);
            console.log(`[CommandBus] Registrando ${commandName}`);
            if (!commandName) continue;

            const instance = new (handlerClass as any)(sender) as ICommandHandler;
            commandBus.register(commandName, instance);
        }
    }
}