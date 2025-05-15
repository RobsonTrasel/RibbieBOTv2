import "reflect-metadata";

const COMMAND_METADATA_KEY = Symbol("COMMAND_METADATA");

export interface RateLimitRule {
  max: number;
  interval: number;
}

export interface CommandMetadata {
  name: string;
  admin?: boolean;
  roles?: string[];
  rateLimit?: RateLimitRule;
}

export function Command(
  name: string,
  options?: Omit<CommandMetadata, "name">
): ClassDecorator {
  return (target) => {
    const metadata: CommandMetadata = {
      name,
      admin: options?.admin,
      roles: options?.roles,
      rateLimit: options?.rateLimit,
    };
    Reflect.defineMetadata(COMMAND_METADATA_KEY, metadata, target);
  };
}

export function getCommandMetadata(
  target: Function
): CommandMetadata | undefined {
  return Reflect.getMetadata(COMMAND_METADATA_KEY, target);
}

export function getCommandName(target: Function): string | undefined {
  return Reflect.getMetadata(COMMAND_METADATA_KEY, target);
}
