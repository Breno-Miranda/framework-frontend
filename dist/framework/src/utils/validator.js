class Validator{constructor(){this.errors=[];this.customValidators=new Map();}
clearErrors(){this.errors=[];}
addError(field,message){this.errors.push({field,message});}
getErrors(){return this.errors;}
hasErrors(){return this.errors.length>0;}
required(value,fieldName='Campo'){if(value===null||value===undefined||value===''){this.addError(fieldName,`${fieldName}é obrigatório`);return false;}
return true;}
isString(value,fieldName='Campo'){if(typeof value!=='string'){this.addError(fieldName,`${fieldName}deve ser uma string`);return false;}
return true;}
isNumber(value,fieldName='Campo'){if(typeof value!=='number'||isNaN(value)){this.addError(fieldName,`${fieldName}deve ser um número válido`);return false;}
return true;}
isEmail(email,fieldName='Email'){if(!this.required(email,fieldName))return false;if(!this.isString(email,fieldName))return false;const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!emailRegex.test(email)){this.addError(fieldName,`${fieldName}deve ser um email válido`);return false;}
return true;}
minLength(value,minLength,fieldName='Campo'){if(!this.required(value,fieldName))return false;if(!this.isString(value,fieldName))return false;if(value.length<minLength){this.addError(fieldName,`${fieldName}deve ter pelo menos ${minLength}caracteres`);return false;}
return true;}
maxLength(value,maxLength,fieldName='Campo'){if(!this.required(value,fieldName))return false;if(!this.isString(value,fieldName))return false;if(value.length>maxLength){this.addError(fieldName,`${fieldName}deve ter no máximo ${maxLength}caracteres`);return false;}
return true;}
range(value,min,max,fieldName='Campo'){if(!this.isNumber(value,fieldName))return false;if(value<min||value>max){this.addError(fieldName,`${fieldName}deve estar entre ${min}e ${max}`);return false;}
return true;}
isUrl(url,fieldName='URL'){if(!this.required(url,fieldName))return false;if(!this.isString(url,fieldName))return false;try{const urlObj=new URL(url);if(!['http:','https:'].includes(urlObj.protocol)){this.addError(fieldName,`${fieldName}deve usar HTTP ou HTTPS`);return false;}}catch{this.addError(fieldName,`${fieldName}deve ser uma URL válida`);return false;}
return true;}
isPhone(phone,fieldName='Telefone'){if(!this.required(phone,fieldName))return false;if(!this.isString(phone,fieldName))return false;const cleanPhone=phone.replace(/\D/g,'');if(cleanPhone.length<10||cleanPhone.length>11){this.addError(fieldName,`${fieldName}deve ter 10 ou 11 dígitos`);return false;}
return true;}
isDate(date,fieldName='Data'){if(!this.required(date,fieldName))return false;if(!this.isString(date,fieldName))return false;const dateObj=new Date(date);if(isNaN(dateObj.getTime())){this.addError(fieldName,`${fieldName}deve ser uma data válida`);return false;}
return true;}
in(value,allowedValues,fieldName='Campo'){if(!this.required(value,fieldName))return false;if(!allowedValues.includes(value)){this.addError(fieldName,`${fieldName}deve ser um dos valores:${allowedValues.join(', ')}`);return false;}
return true;}
isCPF(cpf,fieldName='CPF'){if(!this.required(cpf,fieldName))return false;if(!this.isString(cpf,fieldName))return false;const cleanCPF=cpf.replace(/\D/g,'');if(cleanCPF.length!==11){this.addError(fieldName,`${fieldName}deve ter 11 dígitos`);return false;}
if(/^(\d)\1{10}$/.test(cleanCPF)){this.addError(fieldName,`${fieldName}não pode ter todos os dígitos iguais`);return false;}
let sum=0;for(let i=0;i<9;i++){sum+=parseInt(cleanCPF.charAt(i))*(10-i);}
let remainder=11-(sum%11);let digit1=remainder<2?0:remainder;sum=0;for(let i=0;i<10;i++){sum+=parseInt(cleanCPF.charAt(i))*(11-i);}
remainder=11-(sum%11);let digit2=remainder<2?0:remainder;if(parseInt(cleanCPF.charAt(9))!==digit1||parseInt(cleanCPF.charAt(10))!==digit2){this.addError(fieldName,`${fieldName}não é válido`);return false;}
return true;}
addCustomValidator(name,validator){this.customValidators.set(name,validator);}
custom(name,value,fieldName='Campo',...args){const validator=this.customValidators.get(name);if(!validator){this.addError(fieldName,`Validador'${name}'não encontrado`);return false;}
return validator(value,fieldName,...args);}
validate(data,rules){this.clearErrors();let isValid=true;for(const[field,fieldRules]of Object.entries(rules)){const value=data[field];for(const rule of fieldRules){if(typeof rule==='string'){if(!this[rule](value,field)){isValid=false;break;}}else if(typeof rule==='object'){for(const[ruleName,params]of Object.entries(rule)){if(Array.isArray(params)){if(!this[ruleName](value,...params,field)){isValid=false;break;}}else{if(!this[ruleName](value,params,field)){isValid=false;break;}}}}}}
return isValid;}}
window.validator=new Validator();if(typeof module!=='undefined'&&module.exports){module.exports=Validator;}