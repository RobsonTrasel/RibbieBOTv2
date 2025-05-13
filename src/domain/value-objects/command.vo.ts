import { COMMAND_PREFIX } from "../../shared/constants";

export class Command {
    public readonly name: string;

    constructor(private readonly raw: string) {
        this.name = this.normalize(raw);
    }

    public isValid(): boolean {
        console.log(this.raw.trim())
        return this.raw.trim().startsWith(COMMAND_PREFIX) && this.name.length > 1;
    }

    private normalize(raw: string): string {
        const trimmed = raw.trim();
        if (trimmed.startsWith(COMMAND_PREFIX)) {
            return trimmed.slice(COMMAND_PREFIX.length).toLowerCase();
        }
        return '';
    }
}