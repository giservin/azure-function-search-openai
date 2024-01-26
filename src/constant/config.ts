type ConfigProperties = {
    oaiApiKey: string;
    oaiResource: string;
    searchEndpoint: string;
    searchIndex: string;
    searchKey: string;
    embeddingDeployment: string;
    gptDeployment: string;
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
    searchEndpoint: getEnvVar("AZURE_SEARCH_ENDPOINT"),
    searchIndex: getEnvVar("AZURE_SEARCH_INDEX"),
    searchKey: getEnvVar("AZURE_SEARCH_KEY"),
    embeddingDeployment: getEnvVar("AZURE_OPENAI_EMBEDDING_DEPLOYMENT"),
    gptDeployment: getEnvVar("AZURE_OPENAI_CHAT_DEPLOYMENT")
}

export default config;
