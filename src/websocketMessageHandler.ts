import { Responder, Payload } from "rsocket-types"
import { Flowable, Single } from "rsocket-flowable"
import { Metadata } from "./metadata";

// export const messageHandler : Partial<Responder<object, Metadata>> = {
export class messageHandler {
    fireAndForget(payload) : void {
        console.log("received from server :" + JSON.stringify(payload.data))
    }
    
}