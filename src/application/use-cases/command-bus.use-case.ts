import { CommandMetadata } from "../../decorators/command.decorator";
import { Message } from "../../domain/entities";
import { ICommandHandler } from "../commands/command-handler.interface";
import {
  CommandMiddleware,
  MiddlewarePipeline,
} from "../middleware/middleware-pipeline";

export class CommandBus {
  private handlers = new Map<
    string,
    { handler: ICommandHandler; metadata?: CommandMetadata }
  >();
  private middlewares: CommandMiddleware[] = [];

  register(
    command: string,
    handler: ICommandHandler,
    metadata?: CommandMetadata
  ): void {
    this.handlers.set(command, { handler, metadata });
  }

  use(middleware: CommandMiddleware): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(command: string, message: Message): Promise<void> {
    const entry = this.handlers.get(command);
    if (!entry)
      throw new Error(`Nenhum handler registrado para o comando: ${command}`);

    const context = { command, message, metadata: entry.metadata };

    const pipeline = new MiddlewarePipeline(this.middlewares, () =>
      entry.handler.handle(message)
    );

    await pipeline.execute(context);
  }

  isRegistered(command: string): boolean {
    return this.handlers.has(command);
  }
}
