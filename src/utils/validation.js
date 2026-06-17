export function required(value, label = 'Campo') {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `${label} é obrigatório.`;
  }
  return null;
}

export function validateEmail(value) {
  const req = required(value, 'E-mail');
  if (req) return req;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value.trim()) ? null : 'E-mail inválido.';
}

export function validateSenha(value, min = 6) {
  const req = required(value, 'Senha');
  if (req) return req;
  return value.length >= min ? null : `Senha deve ter ao menos ${min} caracteres.`;
}

export function validateNome(value) {
  const req = required(value, 'Nome');
  if (req) return req;
  return value.trim().length >= 3 ? null : 'Nome deve ter ao menos 3 caracteres.';
}

export function validateDataNascimento(value) {
  const req = required(value, 'Data de nascimento');
  if (req) return req;
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if (!re.test(value.trim())) return 'Use o formato AAAA-MM-DD.';
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const valida =
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  if (!valida) return 'Data inválida.';
  if (date > new Date()) return 'Data não pode estar no futuro.';
  return null;
}

export function validateSexo(value) {
  return required(value, 'Sexo');
}

export function runValidators(validators) {
  const erros = {};
  for (const [campo, fn] of Object.entries(validators)) {
    const erro = fn();
    if (erro) erros[campo] = erro;
  }
  return { erros, valido: Object.keys(erros).length === 0 };
}
