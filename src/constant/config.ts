type ConfigProperties = {
    oaiApiKey: string;
    oaiResource: string;
    searchResource: string;
    searchIndex: string;
    searchKey: string;
    embeddingDeployment: string;
    gptDeployment: string;
    redisConnStr ?: string;
}

const getEnvVar = (envVar: string): string => {
    const value = process.env[envVar];
    if (!value) {
        throw new Error(`Environment variable ${envVar} is not defined.`);
    }
    return value;
}

const config: ConfigProperties = {
    oaiApiKey: getEnvVar("AZURE_OPENAI_API_KEY"),
    oaiResource: getEnvVar("AZURE_OPENAI_RESOURCE_NAME"),
    searchResource: getEnvVar("AZURE_SEARCH_RESOURCE_NAME"),
    searchIndex: getEnvVar("AZURE_SEARCH_INDEX"),
    searchKey: getEnvVar("AZURE_SEARCH_KEY"),
    embeddingDeployment: getEnvVar("AZURE_OPENAI_EMBEDDING_DEPLOYMENT"),
    gptDeployment: getEnvVar("AZURE_OPENAI_CHAT_DEPLOYMENT"),
    redisConnStr: process.env["AZURE_REDIS_CONNECTION_STRING"]
}

export default config;
