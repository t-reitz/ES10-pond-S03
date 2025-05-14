import { add } from './calculator';

const result = add(5, 3);
// A linha abaixo pode gerar um aviso do linter se "no-console" for "warn" ou "error"
console.log(`5 + 3 = ${result}`);