class DebugManager{constructor(){this.isDebugEnabled=this.checkDebugParameter();this.originalConsole={log:console.log,warn:console.warn,error:console.error,info:console.info};this.setupConsoleOverride();}
checkDebugParameter(){const urlParams=new URLSearchParams(window.location.search);return urlParams.get('debug')==='true';}
setupConsoleOverride(){if(!this.isDebugEnabled){console.log=()=>{};console.info=()=>{};console.warn=()=>{};}}
restoreConsole(){console.log=this.originalConsole.log;console.warn=this.originalConsole.warn;console.error=this.originalConsole.error;console.info=this.originalConsole.info;}
log(message,data=null){if(this.isDebugEnabled){if(data){this.originalConsole.log(`[DEBUG]${message}`,data);}else{this.originalConsole.log(`[DEBUG]${message}`);}}}
warn(message,data=null){if(this.isDebugEnabled){if(data){this.originalConsole.warn(`[DEBUG]${message}`,data);}else{this.originalConsole.warn(`[DEBUG]${message}`);}}}
info(message,data=null){if(this.isDebugEnabled){if(data){this.originalConsole.info(`[DEBUG]${message}`,data);}else{this.originalConsole.info(`[DEBUG]${message}`);}}}
isEnabled(){return this.isDebugEnabled;}
enable(){this.isDebugEnabled=true;this.restoreConsole();}
disable(){this.isDebugEnabled=false;this.setupConsoleOverride();}
addDebugToUrl(){const url=new URL(window.location.href);url.searchParams.set('debug','true');window.history.replaceState({},'',url);this.enable();}
removeDebugFromUrl(){const url=new URL(window.location.href);url.searchParams.delete('debug');window.history.replaceState({},'',url);this.disable();}}
window.Debug=new DebugManager();if(typeof module!=='undefined'&&module.exports){module.exports=DebugManager;}