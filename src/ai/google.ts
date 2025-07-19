import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const gemini = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

export const gOpenai = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
