import { Message } from '../../domain/entities';

export interface ICommandHandler {
    handle(message: Message): Promise<void>;
}
