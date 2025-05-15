import { EvolutionSender } from "../infrastructure/evolution/evolution.sender";
import { CommandBus } from "../application/use-cases/command-bus.use-case";
import { HandleCommand } from "../application/use-cases/handle-command.use-case";
import { MessageController } from "../interfaces/controller/message.controller";
import { ICommandHandler } from "../application/commands/command-handler.interface";
import {
  CommandMetadata,
  getCommandMetadata,
  getCommandName,
} from "../decorators/command.decorator";
import { PingCommand, HelpCommand } from "../modules";
import { ISender } from "../infrastructure/contracts/sender.interface";
import { createAuthMiddleware } from "../application/middleware/auth.middleware";
import { createRateLimitMiddleware } from "../application/middleware/rate-limit.middleware";

type RegisteredCommand = {
  name: string;
  handler: ICommandHandler;
  metadata: CommandMetadata;
};

export class AppContainer {
  public readonly controller: MessageController;
  private readonly commands: RegisteredCommand[] = [];

  constructor() {
    const sender: ISender = new EvolutionSender();
    const commandBus = new CommandBus();

    this.registerAllCommands(commandBus, sender);
    commandBus.use(createAuthMiddleware(sender));
    commandBus.use(createRateLimitMiddleware(sender));

    const handleCommand = new HandleCommand(sender, commandBus);
    this.controller = new MessageController(handleCommand);
  }

  private registerAllCommands(commandBus: CommandBus, sender: ISender): void {
    const handlers: Function[] = [PingCommand, HelpCommand];

    for (const handlerClass of handlers) {
      const metadata = getCommandMetadata(handlerClass);
      if (!metadata) continue;

      const instance = new (handlerClass as any)(sender) as ICommandHandler;
      commandBus.register(metadata.name, instance, metadata);

      this.commands.push({ name: metadata.name, handler: instance, metadata });
      console.log(`[CommandBus] Registrando ${metadata.name}`);
    }
  }
}
