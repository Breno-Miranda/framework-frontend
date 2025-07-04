/**
 * Sistema de Validação e Sanitização
 * Fornece validação robusta para todos os inputs do usuário
 */

class Validator {
  constructor() {
    this.errors = [];
    this.customValidators = new Map();
  }

  /**
   * Limpa os erros acumulados
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Adiciona um erro à lista
   * @param {string} field - Campo com erro
   * @param {string} message - Mensagem de erro
   */
  addError(field, message) {
    this.errors.push({ field, message });
  }

  /**
   * Retorna todos os erros
   * @returns {Array} - Lista de erros
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Verifica se há erros
   * @returns {boolean} - True se há erros
   */
  hasErrors() {
    return this.errors.length > 0;
  }

  /**
   * Valida se um campo é obrigatório
   * @param {any} value - Valor a ser validado
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  required(value, fieldName = 'Campo') {
    if (value === null || value === undefined || value === '') {
      this.addError(fieldName, `${fieldName} é obrigatório`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor é uma string
   * @param {any} value - Valor a ser validado
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  isString(value, fieldName = 'Campo') {
    if (typeof value !== 'string') {
      this.addError(fieldName, `${fieldName} deve ser uma string`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor é um número
   * @param {any} value - Valor a ser validado
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  isNumber(value, fieldName = 'Campo') {
    if (typeof value !== 'number' || isNaN(value)) {
      this.addError(fieldName, `${fieldName} deve ser um número válido`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor é um email válido
   * @param {string} email - Email a ser validado
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  isEmail(email, fieldName = 'Email') {
    if (!this.required(email, fieldName)) return false;
    if (!this.isString(email, fieldName)) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.addError(fieldName, `${fieldName} deve ser um email válido`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor tem um comprimento mínimo
   * @param {string} value - Valor a ser validado
   * @param {number} minLength - Comprimento mínimo
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  minLength(value, minLength, fieldName = 'Campo') {
    if (!this.required(value, fieldName)) return false;
    if (!this.isString(value, fieldName)) return false;

    if (value.length < minLength) {
      this.addError(fieldName, `${fieldName} deve ter pelo menos ${minLength} caracteres`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor tem um comprimento máximo
   * @param {string} value - Valor a ser validado
   * @param {number} maxLength - Comprimento máximo
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  maxLength(value, maxLength, fieldName = 'Campo') {
    if (!this.required(value, fieldName)) return false;
    if (!this.isString(value, fieldName)) return false;

    if (value.length > maxLength) {
      this.addError(fieldName, `${fieldName} deve ter no máximo ${maxLength} caracteres`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor está dentro de um intervalo
   * @param {number} value - Valor a ser validado
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  range(value, min, max, fieldName = 'Campo') {
    if (!this.isNumber(value, fieldName)) return false;

    if (value < min || value > max) {
      this.addError(fieldName, `${fieldName} deve estar entre ${min} e ${max}`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor é uma URL válida
   * @param {string} url - URL a ser validada
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  isUrl(url, fieldName = 'URL') {
    if (!this.required(url, fieldName)) return false;
    if (!this.isString(url, fieldName)) return false;

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        this.addError(fieldName, `${fieldName} deve usar HTTP ou HTTPS`);
        return false;
      }
    } catch {
      this.addError(fieldName, `${fieldName} deve ser uma URL válida`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor é um telefone válido
   * @param {string} phone - Telefone a ser validado
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  isPhone(phone, fieldName = 'Telefone') {
    if (!this.required(phone, fieldName)) return false;
    if (!this.isString(phone, fieldName)) return false;

    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Valida formato brasileiro (10 ou 11 dígitos)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      this.addError(fieldName, `${fieldName} deve ter 10 ou 11 dígitos`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor é uma data válida
   * @param {string} date - Data a ser validada
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  isDate(date, fieldName = 'Data') {
    if (!this.required(date, fieldName)) return false;
    if (!this.isString(date, fieldName)) return false;

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      this.addError(fieldName, `${fieldName} deve ser uma data válida`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor está em uma lista de valores permitidos
   * @param {any} value - Valor a ser validado
   * @param {Array} allowedValues - Valores permitidos
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  in(value, allowedValues, fieldName = 'Campo') {
    if (!this.required(value, fieldName)) return false;

    if (!allowedValues.includes(value)) {
      this.addError(fieldName, `${fieldName} deve ser um dos valores: ${allowedValues.join(', ')}`);
      return false;
    }
    return true;
  }

  /**
   * Valida se um valor é um CPF válido
   * @param {string} cpf - CPF a ser validado
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} - True se válido
   */
  isCPF(cpf, fieldName = 'CPF') {
    if (!this.required(cpf, fieldName)) return false;
    if (!this.isString(cpf, fieldName)) return false;

    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) {
      this.addError(fieldName, `${fieldName} deve ter 11 dígitos`);
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) {
      this.addError(fieldName, `${fieldName} não pode ter todos os dígitos iguais`);
      return false;
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder < 2 ? 0 : remainder;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder < 2 ? 0 : remainder;

    if (parseInt(cleanCPF.charAt(9)) !== digit1 || parseInt(cleanCPF.charAt(10)) !== digit2) {
      this.addError(fieldName, `${fieldName} não é válido`);
      return false;
    }

    return true;
  }

  /**
   * Adiciona um validador customizado
   * @param {string} name - Nome do validador
   * @param {Function} validator - Função de validação
   */
  addCustomValidator(name, validator) {
    this.customValidators.set(name, validator);
  }

  /**
   * Executa um validador customizado
   * @param {string} name - Nome do validador
   * @param {any} value - Valor a ser validado
   * @param {string} fieldName - Nome do campo
   * @param {...any} args - Argumentos adicionais
   * @returns {boolean} - True se válido
   */
  custom(name, value, fieldName = 'Campo', ...args) {
    const validator = this.customValidators.get(name);
    if (!validator) {
      this.addError(fieldName, `Validador '${name}' não encontrado`);
      return false;
    }

    return validator(value, fieldName, ...args);
  }

  /**
   * Valida um objeto completo
   * @param {object} data - Dados a serem validados
   * @param {object} rules - Regras de validação
   * @returns {boolean} - True se todos os campos são válidos
   */
  validate(data, rules) {
    this.clearErrors();
    let isValid = true;

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field];

      for (const rule of fieldRules) {
        if (typeof rule === 'string') {
          // Regra simples (ex: 'required', 'email')
          if (!this[rule](value, field)) {
            isValid = false;
            break;
          }
        } else if (typeof rule === 'object') {
          // Regra com parâmetros (ex: {minLength: 5}, {range: [1, 10]})
          for (const [ruleName, params] of Object.entries(rule)) {
            if (Array.isArray(params)) {
              if (!this[ruleName](value, ...params, field)) {
                isValid = false;
                break;
              }
            } else {
              if (!this[ruleName](value, params, field)) {
                isValid = false;
                break;
              }
            }
          }
        }
      }
    }

    return isValid;
  }
}

// Instância global do validador
window.validator = new Validator();

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validator;
} 