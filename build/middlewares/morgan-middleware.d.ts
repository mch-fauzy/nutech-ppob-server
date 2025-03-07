/// <reference types="node" />
declare class MorganMiddleware {
    static handler: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error | undefined) => void) => void;
}
export { MorganMiddleware };
