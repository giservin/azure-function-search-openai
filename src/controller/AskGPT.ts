import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AzureOpenAI } from "../service/openai/AzureOpenAI";
import config from '../constant/config';
import * as AzureError from "../service/openai/exception/AzureOpenAIException";

export const AskGPT = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log(`Http function processed request for url "${request.url}"`);
    
    const { question, user } = await request.json() as {
        question: string,
        user: string
    };
    const ChatAI = new AzureOpenAI(
        config.oaiApiKey,
        config.oaiResource,
        config.searchResource,
        config.searchIndex,
        config.searchKey,
        config.embeddingDeployment,
        config.gptDeployment
    );

    try {
        const chatAnswer: string = await ChatAI.chatGPTAnswer(question);
        return {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                answer: chatAnswer
            })
        };
    }
    catch (err) {
        context.error(err);
        if (err instanceof AzureError.AzureBadRequestError) {
            return {
                headers: { "Content-Type": "application/json" },
                status: 400,
                body: JSON.stringify({ error: `${err.message}: Bad Request` })
            };
        }
        if (err instanceof AzureError.AzureUnauthorizedError) {
            return {
                headers: { "Content-Type": "application/json" },
                status: 401,
                body: JSON.stringify({ error: `${err.message}: Unauthorized` })
            };
        }
        if (err instanceof AzureError.AzureForbiddenError) {
            return {
                headers: { "Content-Type": "application/json" },
                status: 403,
                body: JSON.stringify({ error: `${err.message}: Forbidden` })
            };
        }
        if (err instanceof AzureError.AzureTooManyRequestError) {
            return {
                headers: { "Content-Type": "application/json" },
                status: 429,
                body: JSON.stringify({ error: `${err.message}: Token limit exceeded or too many request` })
            };
        }
        if (err instanceof AzureError.AzureGenericError) {
            return {
                headers: { "Content-Type": "application/json" },
                status: 500,
                body: JSON.stringify({ error: `${err.message}: An error occured` })
            };
        }
        return {
            headers: { "Content-Type": "application/json" },
            status: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }

};


