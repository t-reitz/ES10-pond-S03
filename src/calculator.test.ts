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
