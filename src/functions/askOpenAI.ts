import { app } from "@azure/functions";
import { AskGPT } from "../controller/AskGPT";

app.http('askOpenAI', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ask_openai',
    handler: AskGPT
});
