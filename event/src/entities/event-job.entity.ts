import { EventCandidate } from "./event-candidate.entity";
import { EventCollaborator } from "./event-collaborator.entity";

export class EventJob {
    readonly id?: string;
    readonly event_id?: string;
    readonly description?: string;
    readonly name?: string;
    readonly payment_hour?: any;

    readonly eventCandidate?: EventCandidate;
    readonly eventCollaborator?: EventCollaborator;
}