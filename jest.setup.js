import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 
import { createRequire } from "module";
global.require = createRequire(import.meta.url);
