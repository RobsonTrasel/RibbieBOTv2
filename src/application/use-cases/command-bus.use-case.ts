import {Message} from "../../domain/entities";
import {ICommandHandler} from "../commands/command-handler.interface";

export class CommandBus {
    private handlers: Map<string, ICommandHandler> = new Map();

    register(command: string, handler: ICommandHandler): void {
        this.handlers.set(command, handler);
    }

    async execute(command: string, message: Message): Promise<void> {
        const handler = this.handlers.get(command);
        if (!handler) {
            throw new Error(`Nenhum handler registrado para o comando: ${command}`);
        }
        await handler.handle(message);
    }

    isRegistered(command: string): boolean {
        return this.handlers.has(command);
    }
}
