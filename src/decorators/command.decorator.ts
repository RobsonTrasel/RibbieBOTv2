import 'reflect-metadata';

const COMMAND_METADATA_KEY = Symbol('COMMAND_NAME');

export function Command(name: string): ClassDecorator {
    return target => {
        Reflect.defineMetadata(COMMAND_METADATA_KEY, name, target);
    };
}

export function getCommandName(target: Function): string | undefined {
    return Reflect.getMetadata(COMMAND_METADATA_KEY, target);
}
