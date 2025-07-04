class Component{constructor(options={}){this.name=options.name;this.template=options.template||'';this.styles=options.styles||'';this.state=options.state||{};this.props=options.props||{};this.events=options.events||{};}
beforeMount(){}
mounted(){}
beforeUpdate(){}
updated(){}
beforeUnmount(){}
setTemplate(template){this.template=template;}
setStyles(styles){this.styles=styles;}
setState(newState){this.state={...this.state,...newState};this.render();}
getState(){return this.state;}
setProps(newProps){this.props={...this.props,...newProps};this.render();}
getProps(){return this.props;}
on(event,callback){if(!this.events[event]){this.events[event]=[];}
this.events[event].push(callback);}
off(event,callback){if(this.events[event]){this.events[event]=this.events[event].filter(cb=>cb!==callback);}}
trigger(event,data){if(this.events[event]){this.events[event].forEach(callback=>callback(data));}}
render(){const element=document.querySelector(`[data-component="${this.name}"]`);if(!element)return;this.beforeUpdate();if(!document.getElementById(`${this.name}-styles`)){const styleElement=document.createElement('style');styleElement.id=`${this.name}-styles`;styleElement.textContent=this.styles;document.head.appendChild(styleElement);}
element.innerHTML=this.template;this.updated();this.mounted();}
static register(name){window.core.registerComponent(name,this);}}