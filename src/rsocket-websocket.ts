import {RSocketClient, JsonSerializer, IdentitySerializer} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { JsonMetadataSerializer, Metadata} from './metadata'
import { Responder, ReactiveSocket, CONNECTION_STATUS } from 'rsocket-types';
import { messageHandler } from './websocketMessageHandler';


let client : RSocketClient<Object, Metadata>;
let socket : ReactiveSocket<Object, Metadata> | undefined = undefined;
let connected = false;

    let disconnect : () => void;

        client = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: JsonMetadataSerializer,
            },
            setup: {
                // ms btw sending keepalive to server
                keepAlive: 10000,
                // ms timeout if no keepalive response
                lifetime: 20000,
                dataMimeType: 'application/json',
                metadataMimeType: "application/vnd.spring.rsocket.metadata+json",
            },
            transport: new RSocketWebSocketClient({url: "ws://localhost:8080/rsocket"}),
            responder: new messageHandler()
        });
        client.connect().subscribe({
            onComplete: s => {
                console.log("socket")
                socket = s;
                connected = true;
                s.requestResponse({
                    metadata: new Metadata({ "route": 'hello'}),
                })
            },
            onError: e => console.warn("could not connect", e),
            onSubscribe: cancel => { disconnect = cancel}

        });
        // console.log("isconnected", this.isConnnected())
    // }

    export const isConnected  = (): boolean => {
        return connected;
    }


    export const hello = () => {
        return new Promise(((resolve, reject) => {
            return socket!.requestResponse({
                metadata: new Metadata({ "route": 'hello'}),
            }).subscribe({

                onSubscribe: () => console.log('subscribe'),
                onError: error => reject(error),
                onComplete: (payload) => resolve(payload.data)
            });
        }));
    }

    export const fnf = () => {
        socket!.fireAndForget({
            metadata: new Metadata({"route" : "fnf"})
        });
    }

    export const push = (x : Number, y : Number, drawId : Number) => {
        return new Promise(((resolve, reject) => {
            return socket!.requestResponse({
                metadata: new Metadata({ "route": 'draw.push.coordinate'}),
                data: {
                    x,
                    y,
                    drawId
                }
            }).subscribe({

                onSubscribe: () => console.log('subscribe'),
                onError: error => reject(error),
                onComplete: (payload) => resolve(payload.data)
            });
        }));
    }
    export const push2 = (x : Number, y : Number, drawId : Number) => {
            socket!.fireAndForget({
                metadata: new Metadata({ "route": 'draw.push.coordinate'}),
                data: {
                    x,
                    y,
                    drawId
                }
            })
    

    }

    export const getCoordinates = (drawId: Number) => {
        return new Promise(((resolve, reject) => {
            
            return socket!.requestStream({
                // data: {viewBox: {first: x, second: y}, maxRadars: max},
                metadata: new Metadata({ "route": 'draw.get.' + drawId })
            }).subscribe({
                onSubscribe: (sub) => { console.log(sub); sub.request(4)},
                onError: error => {console.log(error); reject(error) },
                onNext: msg => console.log(msg),
                onComplete: () => {console.log("complete"); resolve()}
            });
        }));
    }
