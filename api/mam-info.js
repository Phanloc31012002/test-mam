import {createInformationHandler} from '../server/source-information.mjs';

// Public read-only facts; no API key, visitor text or customer-supplied URLs.
const handle=createInformationHandler();
export const maxDuration=10;
export default {fetch:handle};
