import { OpenAIApi, Configuration } from "openai";
import { OpenAiApiKey } from '../config.json';

const configuration = new Configuration({
    apiKey: OpenAiApiKey,
});

const openai = new OpenAIApi(configuration);

export const chatCompletion = (prompt) => {
    return openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
    })
}

export const chatCompletionWithTemp = (prompt, temp) => {
    return openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: temp
    })
}

export const imageGeneration = (prompt) => {
    return openai.createImage({
        prompt: prompt,
        n: 1,
        size: "512x512"
    })
}
