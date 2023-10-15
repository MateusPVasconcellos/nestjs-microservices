import { EventAddress } from "./event-address.entity";
import { EventJob } from "./event-job.entity";

export class Event {
    readonly id?: string;
    readonly time?: Date;
    readonly description?: string;
    readonly user_id?: string;

    readonly eventJob?: EventJob[];
    readonly eventAddress?: EventAddress;
}