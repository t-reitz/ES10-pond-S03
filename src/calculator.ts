export function add(a: number, b: number): number {
    // Exemplo para o linter (no-console) - remova para passar no lint
    console.log("Adding numbers...");
    return a + b;
  }
  
  export function subtract(a: number, b: number): number {
    return a - b;
  }
  
  // Para causar um erro de tipo no pré-commit (descomente para testar falha):
  // const wrongType: string = 123;