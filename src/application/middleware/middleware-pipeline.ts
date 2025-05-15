import { CommandMetadata } from "../../decorators/command.decorator";
import { Message } from "../../domain/entities";

type MiddlewareContext = {
  command: string;
  message: Message;
  metadata?: CommandMetadata;
};

type NextFunction = () => Promise<void>;

export type CommandMiddleware = (
  context: MiddlewareContext,
  next: NextFunction
) => Promise<void>;

export class MiddlewarePipeline {
  constructor(
    private readonly middlewares: CommandMiddleware[],
    private readonly finalHandler: () => Promise<void>
  ) {}

  public async execute(context: MiddlewareContext): Promise<void> {
    let index = -1;

    const runner = async (i: number): Promise<void> => {
      if (i <= index) throw new Error("next() chamado múltiplas vezes");
      index = i;

      const middleware = this.middlewares[i];
      if (middleware) {
        await middleware(context, () => runner(i + 1));
      } else {
        await this.finalHandler();
      }
    };

    await runner(0);
  }
}
