import { getPrompt } from "../../constant/openai/prompt";
import * as AzureError from "./exception/AzureOpenAIException";

export class AzureOpenAI {
    private readonly _apiKey: string;
    private readonly _searchResource: string;
    private readonly _searchIndex: string;
    private readonly _searchKey: string;
    private readonly _openAiResource: string;
    private readonly _embeddingDeployment: string;
    private readonly _gptDeployment: string;

    constructor(
        apiKey: string,
        openAiResource: string,
        searchResource: string,
        searchIndex: string,
        searchKey: string,
        embeddingDeployment: string,
        gptDeployment: string
    ) {
        this._apiKey = apiKey;
        this._openAiResource = openAiResource;
        this._searchResource = searchResource;
        this._searchIndex = searchIndex;
        this._searchKey = searchKey;
        this._embeddingDeployment = embeddingDeployment;
        this._gptDeployment = gptDeployment;
    }

    private _errorHandler(responseStatus: number, errorMessage: string) {
        switch (responseStatus) {
            case 400:
                throw new AzureError.AzureBadRequestError(errorMessage);
            case 401:
                throw new AzureError.AzureUnauthorizedError(errorMessage);
            case 403:
                throw new AzureError.AzureForbiddenError(errorMessage);
            case 429:
                throw new AzureError.AzureTooManyRequestError(errorMessage);
            default:
                throw new AzureError.AzureGenericError(errorMessage);
        }
    }

    private async _summarizeUserQuestion(question: string): Promise<string> {
        const response: Response = await fetch(
            `https://${this._openAiResource}.openai.azure.com/openai/deployments/${this._gptDeployment}/chat/completions?api-version=2023-07-01-preview`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": this._apiKey
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: ""
                        },
                        {
                            role: "user",
                            content: `Ringkas kalimat ini menjadi 2 sampai 3 kata "${question}"`
                        }
                    ],
                    temperature: 0.7,
                    top_p: 0.95,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    max_tokens: 800,
                    stop: null
                })
            }
        );
        if (!response.ok) this._errorHandler(response.status, "Azure OpenAI Error");
        const summaryResult = await response.json();
        return summaryResult.choices[0].message.content;
    }

    private async _runEmbedding(text: string): Promise<number[]> {
        const response: Response = await fetch(
            `https://${this._openAiResource}.openai.azure.com/openai/deployments/${this._embeddingDeployment}/embeddings?api-version=2023-05-15`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": this._apiKey
                },
                body: JSON.stringify({
                    input: text
                })
            });
        if (!response.ok) this._errorHandler(response.status, "Azure OpenAI Error");
        const embedding = await response.json();
        return embedding.data[0].embedding;
    }

    private async _searchVectorData(summary: string): Promise<string> {
        const queryVector: number[] = await this._runEmbedding(summary);
        const response: Response = await fetch(
            `https://${this._searchResource}.search.windows.net/indexes('${this._searchIndex}')/docs/search.post.search?api-version=2023-11-01`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": this._searchKey
                },
                body: JSON.stringify({
                    vectorQueries: [
                        {
                            kind: "vector",
                            k: 3,
                            fields: "vector",
                            vector: queryVector
                        }
                    ],
                    select: "chunk,title"
                })
            }
        );
        if (!response.ok) this._errorHandler(response.status, "Azure AI Search Error");
        const searchResults = await response.json();
        return JSON.stringify(searchResults.value);
    }

    async chatGPTAnswer(question: string): Promise<string> {
        const summary: string = await this._summarizeUserQuestion(question);
        const knowledge: string = await this._searchVectorData(summary);

        const answerPrompt: string = getPrompt(question, knowledge);
        const response: Response = await fetch(
            `https://${this._openAiResource}.openai.azure.com/openai/deployments/${this._gptDeployment}/chat/completions?api-version=2023-07-01-preview`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": this._apiKey
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: ""
                        },
                        {
                            role: "user",
                            content: answerPrompt
                        }
                    ],
                    temperature: 0.7,
                    top_p: 0.95,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    max_tokens: 4096,
                    stop: null
                })
            }
        );
        if (!response.ok) this._errorHandler(response.status, "Azure OpenAI Error");
        const answer = await response.json();
        return answer.choices[0].message.content
    }
}