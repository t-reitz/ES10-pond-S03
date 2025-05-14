## Relatório da Atividade: Configuração do Husky 

### 1. Introdução

Este relatório documenta o processo de configuração do Husky em um repositório GitHub. O objetivo é implementar hooks de pré-commit e pré-push para garantir a qualidade do código antes de sua integração ao repositório central. Os hooks configurados irão:

1.  **Pré-commit:**
    * Verificar boas práticas de codificação (linting).
    * Executar a compilação do código (verificação de tipos, sem emissão de arquivos).
2.  **Pré-push:**
    * Executar todos os testes automatizados.

Esta configuração visa prevenir problemas comuns no fluxo de Integração Contínua, melhorando a qualidade e a segurança do projeto.

### 2. Pré-requisitos

* Node.js e npm (ou yarn) instalados.
* Git instalado.
* Uma conta no GitHub.

### 3. Criação do Repositório no GitHub

1.  Acesse o GitHub e crie um novo repositório. Para esta atividade, vamos chamá-lo de `husky-quality-gate-demo`.
2.  Marque la opción "Initialize this repository with a README" se desejar, ou crie-o vazio.
3.  Copie a URL do repositório (HTTPS ou SSH).

### 4. Clonagem e Configuração Inicial do Projeto

1.  **Clone o repositório** para sua máquina local:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd husky-quality-gate-demo
    ```

2.  **Inicialize um projeto Node.js**:
    ```bash
    npm init -y
    ```
    Isso criará um arquivo `package.json`.

3.  **Crie um arquivo `.gitignore`** para ignorar arquivos e pastas desnecessários:
    ```bash
    echo "node_modules/" > .gitignore
    echo "dist/" >> .gitignore
    echo "coverage/" >> .gitignore
    echo "*.log" >> .gitignore
    git add .gitignore
    git commit -m "chore: Add .gitignore"
    ```

### 5. Instalação e Configuração do Husky

1.  **Instale o Husky**:
    O Husky recomenda a inicialização automática, que configura o básico:
    ```bash
    npx husky-init
    npm install # ou yarn install
    ```
    Este comando irá:
    * Instalar `husky` como uma dependência de desenvolvimento.
    * Criar uma pasta `.husky` no seu projeto.
    * Adicionar um script `prepare` ao seu `package.json`: `"prepare": "husky install"`. Este script garante que o Husky seja instalado automaticamente após um `npm install` (útil para novos colaboradores).
    * Criar um hook de exemplo `pre-commit` em `.husky/pre-commit` (geralmente com `npm test`). Vamos alterá-lo.

    *Alternativa (manual)*: Se preferir instalar manualmente:
    ```bash
    npm install husky --save-dev
    npx husky install # Para ativar os hooks (deve ser rodado uma vez)
    # Adicione "prepare": "husky install" ao seu package.json nos scripts
    ```

### 6. Configuração das Ferramentas para os Hooks

Para demonstrar os hooks, vamos instalar e configurar TypeScript (para compilação), ESLint (para linting) e Jest (para testes).

1.  **Instale as dependências de desenvolvimento**:
    ```bash
    npm install typescript eslint jest @types/node @types/jest ts-jest @eslint/js typescript-eslint --save-dev
    ```

2.  **Configure o TypeScript (`tsconfig.json`)**:
    Crie um arquivo `tsconfig.json` na raiz do projeto:
    ```json
    {
      "compilerOptions": {
        "target": "es2020",
        "module": "commonjs",
        "rootDir": "./src",
        "outDir": "./dist",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "noEmit": false // Manter false para o build, mas no hook usaremos --noEmit
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"]
    }
    ```

3.  **Configure o ESLint (`eslint.config.js`)**:
    Crie um arquivo `eslint.config.js` na raiz do projeto (usando a nova "flat config"):
    ```javascript
    // eslint.config.js
    import eslintJs from "@eslint/js";
    import tseslint from "typescript-eslint";

    export default tseslint.config(
      eslintJs.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked, // Para regras que usam type information
      {
        languageOptions: {
          parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname,
          },
        },
        rules: {
          "no-console": "warn",
          "no-unused-vars": "warn",
          "@typescript-eslint/no-unused-vars": "warn",
          "@typescript-eslint/no-explicit-any": "warn"
        }
      },
      {
        ignores: ["dist/", "node_modules/", "coverage/", "*.md", "jest.config.js"]
      }
    );
    ```

4.  **Configure o Jest (`jest.config.js`)**:
    Crie um arquivo `jest.config.js` na raiz do projeto:
    ```javascript
    module.exports = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/src/**/*.test.ts', '**/src/**/*.spec.ts'],
      collectCoverage: true,
      coverageDirectory: "coverage",
      coverageReporters: ["json", "lcov", "text", "clover"]
    };
    ```

5.  **Adicione scripts ao `package.json`**:
    ```json
    {
      "name": "husky-quality-gate-demo",
      "version": "1.0.0",
      "description": "",
      "main": "dist/index.js",
      "scripts": {
        "build": "tsc",
        "lint": "eslint . --ext .ts,.tsx",
        "lint:fix": "eslint . --ext .ts,.tsx --fix",
        "test": "jest",
        "test:watch": "jest --watch",
        "typecheck": "tsc --noEmit",
        "prepare": "husky install"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        // suas dependências listadas aqui
      }
    }
    ```
    * `build`: Compila o código TypeScript.
    * `lint`: Executa o ESLint.
    * `test`: Executa os testes com Jest.
    * `typecheck`: Verifica os tipos com TypeScript sem gerar arquivos (`--noEmit`).

6.  **Crie código de exemplo**:
    Crie a pasta `src` e adicione alguns arquivos:

    * `src/calculator.ts`:
        ```typescript
        export function add(a: number, b: number): number {
          // Exemplo para o linter (no-console) - remova para passar no lint
          // console.log("Adding numbers...");
          return a + b;
        }

        export function subtract(a: number, b: number): number {
          return a - b;
        }

        // Para causar um erro de tipo no pré-commit (descomente para testar falha):
        // const wrongType: string = 123;
        ```

    * `src/index.ts`:
        ```typescript
        import { add } from './calculator';

        const result = add(5, 3);
        console.log(`5 + 3 = ${result}`); // Linter pode reclamar se no-console for "error"
        ```

    * `src/calculator.test.ts`:
        ```typescript
        import { add, subtract } from './calculator';

        describe('Calculator', () => {
          it('should add two numbers correctly', () => {
            expect(add(2, 3)).toBe(5);
          });

          it('should subtract two numbers correctly', () => {
            expect(subtract(5, 2)).toBe(3);
          });

          // Para causar uma falha no teste de pré-push (descomente para testar falha):
          // it('should intentionally fail', () => {
          //  expect(add(1,1)).toBe(3);
          // });
        });
        ```

7.  **Faça um commit inicial das configurações**:
    ```bash
    git add .
    git commit -m "feat: Initial project setup with TS, ESLint, Jest"
    ```

### 7. Configuração dos Hooks do Husky

Agora vamos configurar os hooks de pré-commit e pré-push.

1.  **Hook de Pré-Commit (`.husky/pre-commit`)**:
    Este hook será executado antes de cada commit. Queremos que ele execute o lint e a verificação de tipos.
    Se você usou `npx husky-init`, o arquivo `.husky/pre-commit` já existe. Substitua seu conteúdo ou crie-o com:

    ```bash
    npx husky add .husky/pre-commit "echo 'Running pre-commit hook...' && npm run lint && npm run typecheck"
    ```
    Isso cria/atualiza o arquivo `.husky/pre-commit` com o seguinte conteúdo:
    ```sh
    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    echo 'Running pre-commit hook...'
    npm run lint && npm run typecheck
    ```
    * `npm run lint`: Verifica as boas práticas de codificação.
    * `npm run typecheck`: Executa `tsc --noEmit` para garantir que o código compile corretamente (verificação de tipos) sem gerar arquivos JavaScript.

    **Observação:** Certifique-se de que o arquivo `.husky/pre-commit` tem permissão de execução. O comando `npx husky add` geralmente cuida disso. Se não, use `chmod +x .husky/pre-commit`.

2.  **Hook de Pré-Push (`.husky/pre-push`)**:
    Este hook será executado antes de cada push para o repositório remoto. Queremos que ele execute todos os testes.

    ```bash
    npx husky add .husky/pre-push "echo 'Running pre-push hook...' && npm run test"
    ```
    Isso cria/atualiza o arquivo `.husky/pre-push` com o seguinte conteúdo:
    ```sh
    #!/usr/bin/env sh
    . "$(dirname -- "$0")/_/husky.sh"

    echo 'Running pre-push hook...'
    npm run test
    ```
    * `npm run test`: Executa todos os testes definidos no projeto.

3.  **Faça commit dos hooks configurados**:
    ```bash
    git add .husky/pre-commit .husky/pre-push
    git commit -m "chore: Configure husky pre-commit and pre-push hooks"
    ```

### 8. Verificação e Demonstração dos Hooks

#### a. Testando o Pré-Commit (Sucesso)

1.  Certifique-se de que não há erros de lint ou de tipo no seu código.
    * No `src/calculator.ts`, a linha `const wrongType: string = 123;` deve estar comentada.
    * A linha `console.log("Adding numbers...");` em `calculator.ts` deve estar comentada (ou configure o ESLint para permitir `console.log` se desejar).
2.  Faça uma pequena alteração em um arquivo (ex: adicione um comentário no `README.md`).
3.  Tente fazer um commit:
    ```bash
    git add .
    git commit -m "test: Test pre-commit hook (success)"
    ```
4.  **Saída esperada no terminal (Print/Screenshot do terminal mostrando esta saída bem-sucedida)**:
    ```
    Running pre-commit hook...

    > husky-quality-gate-demo@1.0.0 lint
    > eslint . --ext .ts,.tsx


    > husky-quality-gate-demo@1.0.0 typecheck
    > tsc --noEmit

    [main xxxxxxx] test: Test pre-commit hook (success)
     1 file changed, 1 insertion(+)
    ```

#### b. Testando o Pré-Commit (Falha - Erro de Lint)

1.  Introduza um erro de lint. Por exemplo, descomente `// console.log("Adding numbers...");` em `src/calculator.ts` (assumindo que `no-console` está como "warn" ou "error" no ESLint).
2.  Tente fazer um commit:
    ```bash
    git add src/calculator.ts
    git commit -m "test: Test pre-commit hook (lint fail)"
    ```
3.  **Saída esperada no terminal (Print/Screenshot do terminal mostrando esta falha e a mensagem do ESLint)**:
    ```
    Running pre-commit hook...

    > husky-quality-gate-demo@1.0.0 lint
    > eslint . --ext .ts,.tsx

    /path/to/your/project/src/calculator.ts
      2:3  warning  Unexpected console statement  no-console

    ✖ 1 problem (0 errors, 1 warning)

    husky - pre-commit hook exited with code 1 (error)
    ```

#### c. Testando o Pré-Commit (Falha - Erro de Compilação/Tipo)

1.  Corrija o erro de lint anterior.
2.  Introduza um erro de tipo. Por exemplo, descomente `// const wrongType: string = 123;` em `src/calculator.ts`.
3.  Tente fazer um commit:
    ```bash
    git add src/calculator.ts
    git commit -m "test: Test pre-commit hook (type fail)"
    ```
4.  **Saída esperada no terminal (Print/Screenshot do terminal mostrando esta falha e a mensagem do TypeScript)**:
    ```
    Running pre-commit hook...

    > husky-quality-gate-demo@1.0.0 lint
    > eslint . --ext .ts,.tsx


    > husky-quality-gate-demo@1.0.0 typecheck
    > tsc --noEmit

    src/calculator.ts:10:7 - error TS2322: Type 'number' is not assignable to type 'string'.
    10 const wrongType: string = 123;
             ~~~~~~~~~

    Found 1 error.

    husky - pre-commit hook exited with code 1 (error)
    ```
5.  Corrija o erro de tipo e faça o commit das correções:
    ```bash
    # Comente a linha 'const wrongType: string = 123;' novamente
    git add src/calculator.ts
    git commit -m "fix: Correct type error for pre-commit testing"
    ```

#### d. Testando o Pré-Push (Sucesso)

1.  Certifique-se de que todos os testes estão passando.
    * No arquivo `src/calculator.test.ts`, a linha `expect(add(1,1)).toBe(3);` (se você a descomentou para testar falha) deve estar comentada.
2.  Tente fazer um push para o repositório remoto (assumindo que você configurou um `origin`):
    ```bash
    git push origin main # ou o nome da sua branch principal
    ```
3.  **Saída esperada no terminal (Print/Screenshot do terminal mostrando a execução bem-sucedida dos testes e o push)**:
    ```
    Running pre-push hook...

    > husky-quality-gate-demo@1.0.0 test
    > jest

     PASS  src/calculator.test.ts (XX.XXX s)
      Calculator
        ✓ should add two numbers correctly (X ms)
        ✓ should subtract two numbers correctly (X ms)

    Test Suites: 1 passed, 1 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        XX.XXX s
    Ran all test suites.
    --------------|---------|----------|---------|---------|-------------------
    File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    --------------|---------|----------|---------|---------|-------------------
    All files     |     100 |      100 |     100 |     100 |
     calculator.ts|     100 |      100 |     100 |     100 |
     index.ts     |     100 |      100 |     100 |     100 |
    --------------|---------|----------|---------|---------|-------------------
    Enumerating objects: X, done.
    Counting objects: 100% (X/X), done.
    Delta compression using up to X threads
    Compressing objects: 100% (X/X), done.
    Writing objects: 100% (X/X), X KiB | X KiB/s, done.
    Total X (delta X), reused X (delta X), pack-reused X
    To github.com:your-username/husky-quality-gate-demo.git
       xxxxxxx..yyyyyyy  main -> main
    ```

#### e. Testando o Pré-Push (Falha)

1.  Introduza um erro em um teste. Por exemplo, em `src/calculator.test.ts`, descomente e use o teste que falha intencionalmente:
    ```typescript
    // it('should intentionally fail', () => {
    //  expect(add(1,1)).toBe(3); // 1+1 is 2, not 3
    // });
    ```
    Altere para:
    ```typescript
    it('should intentionally fail', () => {
     expect(add(1,1)).toBe(3); // This will fail
    });
    ```
2.  Tente fazer um push:
    ```bash
    git add src/calculator.test.ts
    git commit -m "test: Introduce failing test for pre-push demo"
    # O pre-commit deve passar (assumindo que o código está sintaticamente correto e tipado)
    git push origin main
    ```
3.  **Saída esperada no terminal (Print/Screenshot do terminal mostrando a falha dos testes e o push abortado)**:
    ```
    Running pre-push hook...

    > husky-quality-gate-demo@1.0.0 test
    > jest

     FAIL  src/calculator.test.ts
      Calculator
        ✓ should add two numbers correctly (X ms)
        ✓ should subtract two numbers correctly (X ms)
        ✕ should intentionally fail (X ms)

      ● Calculator › should intentionally fail

        expect(received).toBe(expected) // Object.is equality

        Expected: 3
        Received: 2

          20 |
          21 |   it('should intentionally fail', () => {
        > 22 |    expect(add(1,1)).toBe(3); // This will fail
             |                     ^
          23 |   });
          24 | });
          25 |

          at Object.<anonymous> (src/calculator.test.ts:22:21)

    Test Suites: 1 failed, 1 total
    Tests:       1 failed, 2 passed, 3 total
    Snapshots:   0 total
    Time:        XX.XXX s
    Ran all test suites.
    husky - pre-push hook exited with code 1 (error)
    error: failed to push some refs to 'git@github.com:your-username/husky-quality-gate-demo.git'
    ```
4.  Corrija o teste, faça commit e push novamente para garantir que tudo está funcionando.
    ```bash
    # Corrija o teste em src/calculator.test.ts
    git add src/calculator.test.ts
    git commit -m "fix: Correct failing test"
    git push origin main # Desta vez deve passar
    ```

### 9. Commits Semânticos

Durante toda a atividade, foram utilizados commits semânticos para clareza e organização do histórico do Git. Exemplos:
* `feat: Initial project setup...` (para novas funcionalidades)
* `fix: Correct type error...` (para correções de bugs)
* `chore: Configure husky...` (para tarefas de manutenção que não alteram código de produção)
* `test: Introduce failing test...` (para adição ou modificação de testes)

Essa prática facilita o entendimento das mudanças e pode ser usada para automatizar a geração de changelogs.

### 10. Conclusão

A configuração do Husky com hooks de pré-commit e pré-push foi realizada com sucesso.
* O hook de **pré-commit** agora executa automaticamente o linting (`npm run lint`) e a verificação de tipos (`npm run typecheck`), garantindo que apenas código que adere aos padrões de codificação e que compila corretamente seja commitado.
* O hook de **pré-push** executa automaticamente todos os testes (`npm run test`), assegurando que as alterações que chegam ao repositório remoto passaram nos testes definidos.

Essas automações contribuem significativamente para a qualidade do código, reduzem a chance de integrar código com problemas e melhoram a eficiência do fluxo de desenvolvimento, alinhando-se com as melhores práticas de Integração Contínua. O repositório e este relatório demonstram a configuração e o funcionamento eficaz dos hooks.
