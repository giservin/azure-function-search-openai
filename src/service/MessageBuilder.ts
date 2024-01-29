import Redis from "ioredis";
import config from "../constant/config";

type AzureOpenAIRoleParam = "user" | "assistant" | "system";

export interface AzureOpenAIMessageParam {
    role : AzureOpenAIRoleParam;
    content : string;
}

export class MessageBuilder {
    private readonly userName : string;
    private historyMessage : AzureOpenAIMessageParam[] = [];
    
    constructor(userName : string) {
        this.userName = userName;
    }

    private async _openRedisConn() : Promise<Redis> {
        if(!config.redisConnStr) throw new Error("Redis connection string not defined");
        return new Redis(config.redisConnStr);
    }

    getCurrentHistory() : AzureOpenAIMessageParam[] {
        return this.historyMessage;
    }

    async getHistoryMessage() : Promise<AzureOpenAIMessageParam[]> {
        const redisClient : Redis = await this._openRedisConn();
        const messageHistory : string | null = await redisClient.get(this.userName);
        if(!messageHistory) return [];
        const msgHistoryObject : AzureOpenAIMessageParam[] = JSON.parse(messageHistory);
        this.historyMessage = msgHistoryObject;
        await redisClient.quit();
        return msgHistoryObject;
    }

    async updateHistoryMessage(newMessage : AzureOpenAIMessageParam) : Promise<void> {
        const latestHistoryMsg : AzureOpenAIMessageParam[] = await this.getHistoryMessage();
        
        latestHistoryMsg.push(newMessage);
        const truncatedHistoryMsg = this._getCurrentMessageLength(latestHistoryMsg);
        const redisClient : Redis = await this._openRedisConn();
        await redisClient.set(this.userName, JSON.stringify(truncatedHistoryMsg));
        await redisClient.expire(this.userName, 1800);
        this.historyMessage = truncatedHistoryMsg;
        await redisClient.quit();
    }

    private _getCurrentMessageLength(historyMessage : AzureOpenAIMessageParam[]) : AzureOpenAIMessageParam[] {
        if(historyMessage.length > 10) {
            historyMessage.shift();
            this.historyMessage = historyMessage;
            return historyMessage;
        } else {
            return historyMessage;
        }
    }
}