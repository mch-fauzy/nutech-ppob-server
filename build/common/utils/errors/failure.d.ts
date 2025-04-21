declare class Failure extends Error {
    code: number;
    status: number;
    constructor(message: string, code: number, status: number);
    static notFound: (message: string) => Failure;
    static unauthorized: (message: string) => Failure;
    static invalidCredentials: (message: string) => Failure;
    static internalServer: (message: string) => Failure;
    static badRequest: (message: string) => Failure;
    static conflict: (message: string) => Failure;
}
export { Failure };
