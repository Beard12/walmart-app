export class Keys {
    private apiKey: string;

    public retrieveAPIKey(): string {
        return this.apiKey;
    }

    public setAPIKey(key): void {
        this.apiKey = key;
    }

    constructor(){
        this.apiKey = "";
    }
}