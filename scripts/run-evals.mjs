import { runEvalSuite } from "../src/evals/runSuite.mjs";

const result = await runEvalSuite();
console.log(JSON.stringify(result, null, 2));
