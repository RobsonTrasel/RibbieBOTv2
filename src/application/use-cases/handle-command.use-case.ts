import {Message} from "../../domain/entities";
import {Command} from "../../domain/value-objects";
import {CommandBus} from "./command-bus.use-case";
import {EvolutionSender} from "../../infrastructure/evolution/evolution.sender";

export class HandleCommand {
    constructor(
        private readonly sender: EvolutionSender,
        private readonly commandBus: CommandBus
    ) {}

    public async execute(message: Message): Promise<void> {
        console.log(message)
        if (message.isEmpty()) {
            console.log('⚠️ Mensagem vazia');
            return;
        }

        const command = new Command(message.body);
        console.log('📥 Mensagem bruta:', message.body);
        console.log('✅ Comando é válido?', command.isValid());

        if (!command.isValid()) {
            console.log('❌ Comando não é válido, cancelando execução.');
            return;
        }

        const name = command.name;
        console.log('📌 Comando normalizado:', name);
        console.log('🔍 Está registrado?', this.commandBus.isRegistered(name));


        if (!this.commandBus.isRegistered(name)) {
            await this.sender.sendText(message.chatId, `Comando desconhecido: ${name}`);
            return;
        }

        console.log(`🚀 Executando comando: ${command.name}`);
        await this.commandBus.execute(name, message);
    }
}