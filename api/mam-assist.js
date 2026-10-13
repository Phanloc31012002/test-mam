import {createAssistantHandler} from '../server/gemini-assistant.mjs';

// Vercel's Node Web Standard entry point; the key is read only server-side.
// Nothing in this module or server/ is copied into the public widget bundle.
const handle = createAssistantHandler();
export const maxDuration = 10;
export default {fetch: handle};
