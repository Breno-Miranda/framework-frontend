class EnvironmentConfig{constructor(){this.env={};this.loadEnvironment();}
loadEnvironment(){this.loadFromFile();this.loadFromMetaTags();this.loadFromLocalStorage();this.setDefaults();}
loadFromFile(){try{if(window.ENV_CONFIG){Object.assign(this.env,window.ENV_CONFIG);}}catch(error){console.warn('[ENV] Erro ao carregar arquivo de configuração:',error);}}
loadFromMetaTags(){const metaTags=document.querySelectorAll('meta[name^="env-"]');metaTags.forEach(meta=>{const name=meta.getAttribute('name').replace('env-','');const value=meta.getAttribute('content');this.env[name]=value;});}
loadFromLocalStorage(){try{const stored=localStorage.getItem('msoft_env');if(stored){const parsed=JSON.parse(stored);Object.assign(this.env,parsed);}}catch(error){console.warn('[ENV] Erro ao carregar do localStorage:',error);}}
setDefaults(){const defaults={NODE_ENV:'development',API_BASE_URL:'http://localhost:3003',USE_PROXY:'false',PROXY_URL:'',ANALYTICS_ENABLED:'false',GA_TRACKING_ID:'',FB_PIXEL_ID:'',LOG_LEVEL:'info',LOG_ENDPOINT:'',VAPID_PUBLIC_KEY:'',BUILD_NUMBER:'dev',BASE_PATH:'/framework'};Object.entries(defaults).forEach(([key,value])=>{if(!this.env[key]){this.env[key]=value;}});}
get(key,defaultValue=null){return this.env[key]!==undefined?this.env[key]:defaultValue;}
set(key,value){this.env[key]=value;try{const stored=JSON.parse(localStorage.getItem('msoft_env')||'{}');stored[key]=value;localStorage.setItem('msoft_env',JSON.stringify(stored));}catch(error){console.warn('[ENV] Erro ao salvar no localStorage:',error);}}
has(key){return this.env[key]!==undefined;}
getAll(){return{...this.env};}
isDevelopment(){return this.get('NODE_ENV')==='development';}
isProduction(){return this.get('NODE_ENV')==='production';}
isStaging(){return this.get('NODE_ENV')==='staging';}
getBoolean(key){const value=this.get(key);return value==='true'||value===true;}
getNumber(key){const value=this.get(key);return value?Number(value):0;}}
window.ENV=new EnvironmentConfig();if(typeof module!=='undefined'&&module.exports){module.exports=EnvironmentConfig;}