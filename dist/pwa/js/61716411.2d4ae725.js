(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["61716411"],{"061d":function(e,t){function i(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}e.exports=i},"252f":function(e,t,i){"use strict";(function(e){i("20d6");var s=i("b2cb"),n=i.n(s),o=i("d2a2"),r=i("2f62");t["a"]={name:"MisRequerimientosMenuFiltros",components:{SelectCustom:o["a"]},props:{},data:function(){return{input:"",widthInputDescripcion:0,popupOpened:!1,usuariosAsignadosOptionsFiltered:null}},computed:n()({},Object(r["d"])("requerimientos",{areas:function(e){return e.options.areas},sistemas:function(e){return e.options.sistemas},requerimientosTipos:function(e){return e.options.requerimientosTipos}}),{},Object(r["c"])("auth",["userSistemas","userYoYReportantes"]),{sistemasUsuarioOptions:function(){var t=this;return e.filter(this.sistemas,function(i){return-1!==e.findIndex(t.userSistemas,{id:i.id})})},__descripcion:{get:function(){return this.$store.state.asignacionRequerimientos.filtros.descripcion},set:function(e){this.$store.dispatch("asignacionRequerimientos/setFilter",{filter:"descripcion",value:e})}},__sistema:{get:function(){return this.$store.state.asignacionRequerimientos.filtros.sistema},set:function(e){this.$store.dispatch("asignacionRequerimientos/setFilter",{filter:"sistema",value:e})}},__tipo:{get:function(){return this.$store.state.asignacionRequerimientos.filtros.requerimientoTipo},set:function(e){this.$store.dispatch("asignacionRequerimientos/setFilter",{filter:"requerimientoTipo",value:e})}},__usuariosAsignados:{get:function(){return this.$store.state.asignacionRequerimientos.filtros.usuariosAsignados},set:function(e){this.$store.dispatch("asignacionRequerimientos/setFilter",{filter:"usuariosAsignados",value:e})}},iconOpenFilter:function(){return this.popupOpened?"arrow_drop_up":"arrow_drop_down"},sistemaDescripcion:function(){return e.get(this,"__sistema.descripcion",null)},sistemaSetted:function(){return this.__sistema&&Boolean(this.__sistema.id)},tipoRequerimientoDescripcion:function(){return e.get(this,"__tipo.descripcion",null)},tipoRequerimientoSetted:function(){return this.__tipo&&Boolean(this.__tipo.id)},usuariosAsignadosDescripcion:function(){return this.usuariosAsignadosSetted?this.__usuariosAsignados.map(function(e){return e.label}).join(", "):""},usuariosAsignadosSetted:function(){return this.__usuariosAsignados&&this.__usuariosAsignados.length>0}}),methods:{onResize:function(e){this.widthInputDescripcion=e.width},removeFilter:function(e){this.$store.dispatch("asignacionRequerimientos/setFilter",{filter:e,value:null})},clearFilters:function(){this.$store.dispatch("asignacionRequerimientos/clearFilters")},closeFilters:function(){this.popupOpened=!1},filterUsuariosAsignados:function(e,t){var i=this;t(""!==e?function(){var t=e.toLowerCase();i.usuariosAsignadosOptionsFiltered=i.userYoYReportantes.filter(function(e){return e.label.toLowerCase().indexOf(t)>-1})}:function(){i.usuariosAsignadosOptionsFiltered=i.userYoYReportantes})}}}}).call(this,i("2ef0"))},"469f":function(e,t,i){i("6c1c"),i("1654"),e.exports=i("7d7b")},"52cf":function(e,t,i){},"5d73":function(e,t,i){e.exports=i("469f")},"7d7b":function(e,t,i){var s=i("e4ae"),n=i("7cd6");e.exports=i("584a").getIterator=function(e){var t=n(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return s(t.call(e))}},"7e9a":function(e,t,i){var s=i("5d73");function n(e,t){var i=[],n=!0,o=!1,r=void 0;try{for(var a,c=s(e);!(n=(a=c.next()).done);n=!0)if(i.push(a.value),t&&i.length===t)break}catch(l){o=!0,r=l}finally{try{n||null==c["return"]||c["return"]()}finally{if(o)throw r}}return i}e.exports=n},8120:function(e,t,i){"use strict";i.d(t,"b",function(){return o}),i.d(t,"a",function(){return r});i("a481"),i("6b54"),i("06db"),i("28a5");var s=i("f3e3"),n=i.n(s),o=function(e,t,i,s){var o,r,a,c,l,u,d,p,m=parseInt,g=Math.round,f="string"==typeof i;return"number"!=typeof e||e<-1||e>1||"string"!=typeof t||"r"!=t[0]&&"#"!=t[0]||i&&!f?null:(o||(o=function(e){var t=e.length,i={};if(t>9){var s,o;if(s=e=e.split(","),o=n()(s,4),r=o[0],a=o[1],c=o[2],f=o[3],t=e.length,t<3||t>4)return null;i.r=m("a"==r[3]?r.slice(5):r.slice(4)),i.g=m(a),i.b=m(c),i.a=f?parseFloat(f):-1}else{if(8==t||6==t||t<4)return null;t<6&&(e="#"+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]+(t>4?e[4]+e[4]:"")),e=m(e.slice(1),16),9==t||5==t?(i.r=e>>24&255,i.g=e>>16&255,i.b=e>>8&255,i.a=g((255&e)/.255)/1e3):(i.r=e>>16,i.g=e>>8&255,i.b=255&e,i.a=-1)}return i}),p=t.length>9,p=f?i.length>9||"c"==i&&!p:p,u=o(t),l=e<0,d=i&&"c"!=i?o(i):l?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},e=l?-1*e:e,l=1-e,u&&d?(s?(r=g(l*u.r+e*d.r),a=g(l*u.g+e*d.g),c=g(l*u.b+e*d.b)):(r=g(Math.pow(l*Math.pow(u.r,2)+e*Math.pow(d.r,2),.5)),a=g(Math.pow(l*Math.pow(u.g,2)+e*Math.pow(d.g,2),.5)),c=g(Math.pow(l*Math.pow(u.b,2)+e*Math.pow(d.b,2),.5))),f=u.a,d=d.a,u=f>=0||d>=0,f=u?f<0?d:d<0?f:f*l+d*e:0,p?"rgb"+(u?"a(":"(")+r+","+a+","+c+(u?","+g(1e3*f)/1e3:"")+")":"#"+(4294967296+16777216*r+65536*a+256*c+(u?g(255*f):0)).toString(16).slice(1,u?void 0:-2)):null)};function r(e,t){var i=a(e);return i.h+=t,i.h>360?i.h-=360:i.h<0&&(i.h+=360),c(i)}function a(e){e=e.replace(/^\s*#|\s*$/g,""),3==e.length&&(e=e.replace(/(.)/g,"$1$1"));var t=parseInt(e.substr(0,2),16)/255,i=parseInt(e.substr(2,2),16)/255,s=parseInt(e.substr(4,2),16)/255,n=Math.max(t,i,s),o=Math.min(t,i,s),r=n-o,a=(n+o)/2,c=0,l=0;return c=0==r?0:n==t?(i-s)/r%6*60:n==i?60*((s-t)/r+2):60*((t-i)/r+4),l=0==r?0:r/(1-Math.abs(2*a-1)),{h:c,s:l,l:a}}function c(e){var t,i,s,n=e.h,o=e.s,r=e.l,a=(1-Math.abs(2*r-1))*o,c=a*(1-Math.abs(n/60%2-1)),d=r-a/2;return n<60?(t=a,i=c,s=0):n<120?(t=c,i=a,s=0):n<180?(t=0,i=a,s=c):n<240?(t=0,i=c,s=a):n<300?(t=c,i=0,s=a):(t=a,i=0,s=c),t=l(t,d),i=l(i,d),s=l(s,d),u(t,i,s)}function l(e,t){return e=Math.floor(255*(e+t)),e<0&&(e=0),e}function u(e,t,i){return"#"+((1<<24)+(e<<16)+(t<<8)+i).toString(16).slice(1)}},8937:function(e,t,i){"use strict";(function(e){var s=i("b2cb"),n=i.n(s),o=(i("c5f6"),i("2f62")),r=i("dd8c"),a=i("8120"),c=i("0a59");t["a"]={name:"AsignarRequerimientosItem",mixins:[r["a"]],props:{req:{type:Object,required:!0},index:{type:Number,required:!0}},computed:n()({},Object(o["c"])("auth",["esElUltimoDeLaCadenaDeMando"]),{},Object(o["c"])("requerimientos",["getEstadoByCodigo","getEstadoById"]),{esArregloRapido:function(){return 1===this.req.tipo.id},reqOrden:function(){return e.get(this,"req.estado.asignacion.orden","")},estaAsignado:function(){var t=e.get(this,"req.estado.asignacion",null);return null!==t},usuarioAsignado:function(){return e.get(this,"req.estado.asignacion.usuario_nombre","")},tieneComentario:function(){return this.req.comentario&&this.req.comentario.length>0},estadoEnProcesos:function(){var e=this.getEstadoByCodigo("STPR");return this.req.estado.id===e.id},estadoNoAsignado:function(){var e=this.getEstadoByCodigo("NOAS");return this.req.estado.id===e.id},estadoAsignado:function(){var e=this.getEstadoByCodigo("ASSI");return this.req.estado.id===e.id},estadoProcesos:function(){var t=this.getEstadoByCodigo("NOAS"),i=this.getEstadoByCodigo("ASSI"),s=this.getEstadoByCodigo("EXEC"),n=this.getEstadoByCodigo("RESC"),o=e.get(this,"req.estado.estado_procesos.id",null);if(o){if(o===t.id)return t;if(o===i.id)return i;if(o===s.id)return s;if(o===n.id)return n}return{}},bgCardColor:function(){var e="#FFFFFF";if(!this.req.vence)return e;var t=this.req.diasToVencimiento;if(t>7)return e;var i=this.getColorVencimiento();return"linear-gradient(45deg, #fff 0%, #fff 25%, ".concat(i," 100%)")},diasVencimiento:function(){return this.req.diasToVencimiento},isDevelopment:function(){return!1},reqProcesosId:function(){return e.get(this.req,"requerimientoProcesos.IdRequerimiento",null)},reqProcesosEstado:function(){var t=e.get(this.req,"requerimientoProcesos.IdRequerimientoEstadoSistemas",null),i=this.getEstadoById(t);return i.descripcion},estaEnTesting:function(){var e=c["a"].getEstadoId("TEST");return this.req.estado.id===e},usuarioTesting:function(){return this.req.estado.asignacion_testing.usuario_nombre}}),methods:{getColorVencimiento:function(){var e="#ef5350",t="#FFFFFF";if(!this.req.vence)return t;var i=this.req.diasToVencimiento;if(i>7)return t;if(i>-15&&i<=7){var s=100*(i+15),n=s/22/100;return Object(a["b"])(n,e,!1,!0)}return e}}}}).call(this,i("2ef0"))},9549:function(e,t,i){"use strict";var s=i("f03e"),n=i.n(s);n.a},b2ed:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-page",{attrs:{padding:""}},[i("page-header",{attrs:{title:"Asignar Requerimientos","no-margin":""}},[i("div",[i("div",{staticClass:"d-ib cursor-pointer",on:{click:function(t){return e.aplicarFiltroRapidoTipoReq("Arreglo")}}},[i("div",{staticClass:"square d-ib bg-red-7"},[e._v(" ")]),e._v("\n        Arreglo Rápido    -   \n      ")]),i("div",{staticClass:"d-ib cursor-pointer",on:{click:function(t){return e.aplicarFiltroRapidoTipoReq("Desarrollo")}}},[i("div",{staticClass:"square d-ib bg-light-blue-7"},[e._v(" ")]),e._v("\n        Desarrollo / Mejora   \n      ")])])]),i("div",{staticClass:"row"},[i("div",{staticClass:"col"},[i("asignar-requerimientos-filtros")],1)]),i("div",{staticClass:"row q-pt-md q-px-xs q-col-gutter-sm"},[i("div",{staticClass:"col-sm-4 col-xs-12"},[i("asignar-requerimientos-list",{attrs:{"requerimientos-list":e.requerimientosFiltered("NOAS"),"loading-list":e.loadingList,title:"Requerimientos Por Asignar",draggable:!0,"group-name":"asignarRequerimientos","list-name":"source"}})],1),i("div",{staticClass:"col-sm-4 col-xs-12"},[i("asignar-requerimientos-list",{attrs:{"requerimientos-list":e.requerimientosFiltered("ASSI"),"loading-list":e.loadingList,title:"Requerimientos Asignados",draggable:!0,"group-name":"asignarRequerimientos","list-name":"target"}})],1),i("div",{staticClass:"col-sm-4 col-xs-12"},[i("asignar-requerimientos-list",{attrs:{"requerimientos-list":e.requerimientosFiltered("EXEC/TEST"),"loading-list":e.loadingList,title:"Reqs. en Ejecucion / Testing"}})],1)]),i("dialog-detalle-requerimiento"),i("asignar-requerimientos-dialog-confirm-operation")],1)},n=[],o=i("b2cb"),r=i.n(o),a=i("2f62"),c=i("1050"),l=i("1011"),u=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("list-requerimientos",{attrs:{"loading-list":e.loadingList,title:e.title}},[e.draggable?[e.loadingList?e._e():i("Container",{attrs:{"group-name":e.groupName,"get-child-payload":e.getPayload,"drag-class":"card-ghost","drop-class":"card-ghost-drop","drop-placeholder":e.dropPlaceholderOptions},on:{drop:function(t){return e.onDrop(e.listName,t)}}},[e.listEmpty?[i("div",{staticClass:"text-h6 text-center"},[e._v("\n          No hay requerimientos\n          "),i("br"),e._v("\n          para mostrar!\n        ")])]:e._l(e.requerimientosList,function(t,s){return i("Draggable",{key:"req_"+t.id},[i("asignar-requerimientos-item",{attrs:{req:t,index:s},nativeOn:{click:function(i){return e.abrirDetalleRequerimiento({reqId:t.id,listName:"asignar-requerimientos"})}}})],1)})],2)]:[e.listEmpty?[i("div",{staticClass:"text-h6 text-center"},[e._v("\n        No hay requerimientos\n        "),i("br"),e._v("\n        para mostrar!\n      ")])]:e._l(e.requerimientosList,function(t,s){return i("asignar-requerimientos-item",{key:"req_"+t.id,attrs:{req:t,index:s},nativeOn:{click:function(i){return e.abrirDetalleRequerimiento({reqId:t.id,listName:"asignar-requerimientos"})}}})})]],2)},d=[],p=i("3f7d"),m=i("2fa3"),g=i("fcd5"),f=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-item",{staticClass:"q-ma-sm shadow-2 rounded-borders-8 cursor-pointer card-row",class:{"card--default":!e.esArregloRapido,"card--qf":e.esArregloRapido},style:{background:e.bgCardColor}},[e.estadoEnProcesos?i("div",{staticClass:"row card__process-row"},[i("div",{staticClass:"col-12 text-right"},["NOAS"===e.estadoProcesos.codigo?[i("div",{staticClass:"card__process-ind"},[e._v(" ")])]:e._e(),"ASSI"===e.estadoProcesos.codigo?[i("div",{staticClass:"card__process-ind"},[e._v(" ")]),i("div",{staticClass:"card__process-ind"},[e._v(" ")])]:e._e(),"EXEC"===e.estadoProcesos.codigo?[i("div",{staticClass:"card__process-ind"},[e._v(" ")]),i("div",{staticClass:"card__process-ind"},[e._v(" ")]),i("div",{staticClass:"card__process-ind"},[e._v(" ")])]:e._e(),"RESC"===e.estadoProcesos.codigo?[i("div",{staticClass:"card__process-ind"},[e._v(" ")]),i("div",{staticClass:"card__process-ind"},[e._v(" ")]),i("div",{staticClass:"card__process-ind"},[e._v(" ")]),i("div",{staticClass:"card__process-ind"},[e._v(" ")])]:e._e()],2),i("q-tooltip",{attrs:{target:!0,"content-class":"bg-green-7","content-style":"font-size: 12px"}},[e._v("\n      Estado Procesos:\n      "),i("strong",[e._v(e._s(e.estadoProcesos.descripcion))])])],1):e._e(),i("div",{staticClass:"row"},[i("div",{staticClass:"col-12"},[i("q-item-label",{attrs:{lines:"1"}},[i("span",{staticClass:"text-weight-medium"},[e._v(e._s(e.req.asunto))])]),i("q-item-label",[i("span",{staticClass:"text-weight-regular card__text-body"},[i("span",{staticClass:"avatar-letter"},[e._v("A")]),e._v("\n          "+e._s(e.req.area.descripcion)+"\n          "),i("q-tooltip",[e._v("\n            Area:\n            "),i("strong",[e._v(e._s(e.req.area.descripcion))])])],1)]),e.req.vence?i("q-item-label",[i("span",{staticClass:"card__text-body"},[i("q-icon",{staticClass:"vertical-top q-mr-xs q-pl-xs",attrs:{name:"far fa-calendar-alt"}}),e._v("\n          "+e._s(e.req.fechaLimite)+"\n          "),e.diasVencimiento<7?i("q-icon",{staticClass:"vertical-top q-mr-xs q-pl-xs",style:{color:e.getColorVencimiento()},attrs:{name:"fas fa-exclamation-triangle"}}):e._e(),i("q-tooltip",[e._v("\n            Vencimiento:\n            "),i("strong",[e._v(e._s(e.req.fechaLimite))]),null!==e.diasVencimiento?[e.diasVencimiento>0?i("span",{staticClass:"text-black"},[e._v("\n                (Faltan\n                "),i("strong",[e._v(e._s(e.diasVencimiento))]),e._v("\n                días)\n              ")]):e._e(),0===e.diasVencimiento?i("span",{staticClass:"text-black"},[e._v("\n                (HOY es el día de vencimiento)\n              ")]):e._e(),e.diasVencimiento<0?i("strong",[e._v("\n                (Este req. lleva "+e._s(-1*e.diasVencimiento)+" días vencido)\n              ")]):e._e()]:e._e()],2)],1)]):e._e(),e.req.fueEnviadoAProcesos?i("q-item-label",[i("span",{staticClass:"card__text-body"},[i("q-icon",{staticClass:"vertical-top q-mr-xs q-pl-xs",attrs:{name:"fas fa-cogs"}}),e._v("\n          Req. Procesos\n          "),i("strong",[e._v("#"+e._s(e.reqProcesosId))]),e._v("\n          ("+e._s(e.reqProcesosEstado)+")\n          "),i("q-tooltip",[e._v("\n            - Requerimiento Asociado en Procesos:\n            "),i("strong",[e._v("#"+e._s(e.reqProcesosId))]),i("br"),e._v("\n            - Estado:\n            "),i("strong",[e._v(e._s(e.reqProcesosEstado))])])],1)]):e._e(),e.estaAsignado?i("q-item-label",[i("span",{staticClass:"card__text-user"},[i("q-icon",{staticClass:"vertical-top q-mr-xs q-pl-sm",attrs:{name:"fas fa-user-check"}}),e._v("\n          "+e._s(e.usuarioAsignado)+"\n          "),i("q-tooltip",[e._v("\n            Usuario Asignado:\n            "),i("strong",[e._v(e._s(e.usuarioAsignado))])])],1)]):e._e(),e.estaEnTesting?i("q-item-label",[i("span",{staticClass:"card__text-user"},[i("q-icon",{staticClass:"vertical-top q-mr-xs q-pl-xs",attrs:{name:"fas fas fa-flask"}}),e._v("\n          "+e._s(e.usuarioTesting)+"\n          "),i("q-tooltip",[e._v("\n            Usuario Tester:\n            "),i("strong",[e._v(e._s(e.usuarioTesting))])])],1)]):e._e()],1)]),i("div",{staticClass:"row justify-between"},[i("div",{staticClass:"text-left col-3"},[i("q-badge",{class:{"nro-req--default":!e.esArregloRapido,"nro-req--qf":e.esArregloRapido}},[e._v("\n        #"+e._s(e.req.id)+"\n      ")])],1),e.esArregloRapido||!e.estadoNoAsignado&&!e.estadoEnProcesos?e._e():i("div",{staticClass:"col-9 text-right"},[e.estadoEnProcesos?i("q-badge",{attrs:{color:"green-7","text-color":"white"}},[e._v("\n        EN PROCESOS\n      ")]):e._e(),e.estadoNoAsignado?i("q-badge",{style:{color:e.getColorPrioridadText(e.req.prioridad),backgroundColor:e.getColorPrioridad(e.req.prioridad)}},[e._v("\n        PR: "+e._s(e.req.prioridad)+"\n      ")]):e._e()],1),e.isDevelopment&&e.estadoAsignado?i("div",{staticClass:"col-3 text-right"},[i("q-badge",{attrs:{color:"red-7","text-color":"white"}},[e._v("\n        ORDEN: "+e._s(e.reqOrden)+"\n      ")])],1):e._e()])])},q=[],_=i("8937"),v=_["a"],h=(i("cfa0"),i("2877")),b=Object(h["a"])(v,f,q,!1,null,"9f5c0f2e",null),C=b.exports,x={name:"AsignarRequerimientosList",components:{ListRequerimientos:g["a"],AsignarRequerimientosItem:C,Container:p["Container"],Draggable:p["Draggable"]},props:{requerimientosList:{type:Array,required:!0},loadingList:{type:Boolean,default:!0},title:{type:String,required:!0},draggable:{type:Boolean,default:!1},groupName:{type:String,default:""},listName:{type:String,default:""}},data:function(){return{dropPlaceholderOptions:{className:"drop-group",animationDuration:"150",showOnTop:!0}}},computed:{listEmpty:function(){return 0===this.requerimientosList.length}},methods:r()({},Object(a["b"])({abrirDetalleRequerimiento:"requerimientos/abrirDetalleRequerimiento"}),{getPayload:function(e){return this.requerimientosList[e]},onDrop:function(e,t){var i=Object(m["a"])(this.requerimientosList,t),s={listName:e,listResult:i,dropResult:t};this.$store.dispatch("asignacionRequerimientos/processUpdateList",s).then(function(e){e&&Object(m["i"])({message:e})}).catch(function(e){var t=e.message;Object(m["j"])({message:t})})}})},R=x,A=Object(h["a"])(R,u,d,!1,null,"341870c3",null),O=A.exports,y=i("cf9f"),w=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-dialog",{attrs:{persistent:"","transition-show":"slide-up","transition-hide":"slide-down"},model:{value:e.dialogConfirmOpen,callback:function(t){e.dialogConfirmOpen=t},expression:"dialogConfirmOpen"}},[i("q-card",{staticClass:"bg-accent text-white"},[i("q-bar",[i("q-btn",{attrs:{dense:"",flat:"",icon:"fas fa-exclamation-triangle"}}),i("q-space"),i("q-btn",{attrs:{dense:"",flat:"",icon:"close"},on:{click:e.cancelOperation}},[i("q-tooltip",{attrs:{"content-class":"bg-white text-primary"}},[e._v("Cancelar")])],1)],1),i("q-card-section",[i("span",{staticClass:"text-h6"},[e._v("\n        Confirmación -\n        "),i("q-chip",{attrs:{dense:"",color:"accent-light","text-color":"white"}},[e._v("\n          Req #"+e._s(e.detalleRequerimientoId)+"\n        ")])],1)]),i("q-card-section",[i("asignar-requerimientos-actions",{ref:"actions",attrs:{dark:!0,"hide-save-button":"","hide-order-asignacion":"",color:"white","operation-type":e.operationType}})],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{attrs:{label:"CANCELAR",flat:"",color:"red-7"},on:{click:e.cancelOperation}}),i("q-btn",{attrs:{label:"CONFIRMAR",color:"deep-purple-10"},on:{click:e.confirmOperation}})],1)],1)],1)},E=[],F=i("58c1"),S={name:"AsignarRequerimientosDialogConfirmOperation",components:{AsignarRequerimientosActions:F["a"]},computed:r()({},Object(a["d"])("asignacionRequerimientos",{dialogConfirmOpenState:function(e){return e.dialogConfirmOpen}}),{},Object(a["c"])("asignacionRequerimientos",["operationType"]),{},Object(a["c"])("requerimientos",["detalleRequerimientoId"]),{dialogConfirmOpen:{get:function(){return this.dialogConfirmOpenState},set:function(e){this.$store.dispatch("asignacionRequerimientos/setDialogConfirmOperationOpen",e)}}}),methods:{cancelOperation:function(){this.dialogConfirmOpen=!1},confirmOperation:function(){this.$refs.actions.saveChanges()}}},T=S,k=Object(h["a"])(T,w,E,!1,null,"92b4c3c8",null),D=k.exports,P=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"q-py-md"},[i("q-resize-observer",{on:{resize:e.onResize}}),i("div",{staticClass:"q-mb-sm"},[i("q-input",{ref:"inputDescripcion",staticClass:"filter",class:{popupOpened:e.popupOpened},attrs:{dense:"",standout:"bg-white text-black",placeholder:"Buscar por Asunto, Descripcion, Usuario Asignado..."},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.closeFilters(t)}},scopedSlots:e._u([{key:"prepend",fn:function(){return[i("q-icon",{attrs:{name:"search"}})]},proxy:!0},{key:"append",fn:function(){return[i("q-icon",{staticClass:"filter__icon cursor-pointer",attrs:{name:e.iconOpenFilter},on:{click:function(t){e.popupOpened=!e.popupOpened}}})]},proxy:!0}]),model:{value:e.__descripcion,callback:function(t){e.__descripcion="string"===typeof t?t.trim():t},expression:"__descripcion"}}),i("q-menu",{attrs:{"no-parent-event":"","content-class":"q-menu-fix",offset:[0,-4]},model:{value:e.popupOpened,callback:function(t){e.popupOpened=t},expression:"popupOpened"}},[i("div",{staticClass:"q-pa-md",style:{width:e.widthInputDescripcion+"px"}},[i("div",{staticClass:"row q-pt-sm q-col-gutter-xs"},[i("div",{staticClass:"col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md"},[e._v("\n            Sistema\n          ")]),i("div",{staticClass:"col-xs-9 col-sm-9 col-md-10 col-lg-11"},[i("select-custom",{attrs:{options:e.sistemasUsuarioOptions,dense:"",label:"Sistema",color:"deep-purple-10","use-filter":!1,loading:0===e.sistemas.length},model:{value:e.__sistema,callback:function(t){e.__sistema=t},expression:"__sistema"}})],1),i("div",{staticClass:"col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md"},[e._v("\n            Tipo de Requerimiento\n          ")]),i("div",{staticClass:"col-xs-9 col-sm-9 col-md-10 col-lg-11"},[i("select-custom",{attrs:{options:e.requerimientosTipos,dense:"",label:"Tipo de Requerimiento",color:"deep-purple-10","use-filter":!1,loading:0===e.requerimientosTipos.length},model:{value:e.__tipo,callback:function(t){e.__tipo=t},expression:"__tipo"}})],1)]),i("div",{staticClass:"row q-pt-sm q-col-gutter-xs"},[i("div",{staticClass:"col-12 text-caption q-pt-md text-caption"},[e._v('\n            Para las columans de "Requerimientos Asignados" y "Requerimientos\n            en Ejecución"\n          ')]),i("div",{staticClass:"col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md"},[e._v("\n            Usuarios Asignados\n          ")]),i("div",{staticClass:"col-xs-9 col-sm-9 col-md-10 col-lg-11"},[i("q-select",{attrs:{options:e.usuariosAsignadosOptionsFiltered,clearable:"",dense:"","hide-bottom-space":!0,label:"Usuarios Asignados","use-input":"","use-chips":"",multiple:"",color:"deep-purple-10"},on:{filter:e.filterUsuariosAsignados},model:{value:e.__usuariosAsignados,callback:function(t){e.__usuariosAsignados=t},expression:"__usuariosAsignados"}})],1)]),i("div",{staticClass:"row q-pt-md justify-end q-col-gutter-x-md"},[i("div",{staticClass:"col-auto"},[i("q-btn",{attrs:{color:"negative",flat:"",size:"md"},on:{click:e.clearFilters}},[e._v("\n              Limpiar Filtros\n            ")])],1),i("div",{staticClass:"col-auto"},[i("q-btn",{attrs:{color:"deep-purple-10",size:"md"},on:{click:e.closeFilters}},[e._v("\n              FILTRAR\n            ")])],1)])])])],1),i("div",{staticClass:"q-mt-sm"},[e.sistemaSetted||e.tipoRequerimientoSetted?i("span",[e._v("Filtros:")]):e._e(),e.sistemaSetted?i("span",{staticClass:"q-mx-xs"},[i("q-chip",{attrs:{removable:""},on:{remove:function(t){return e.removeFilter("sistema")}}},[i("q-avatar",{staticClass:"filter-label",attrs:{color:"red","text-color":"white"}},[e._v("\n          Sist:\n        ")]),e._v("\n        "+e._s(e.sistemaDescripcion)+"\n        "),i("q-tooltip",[e._v("Sistema")])],1)],1):e._e(),e.tipoRequerimientoSetted?i("span",{staticClass:"q-mx-xs"},[i("q-chip",{attrs:{removable:""},on:{remove:function(t){return e.removeFilter("requerimientoTipo")}}},[i("q-avatar",{staticClass:"filter-label",attrs:{color:"blue","text-color":"white"}},[e._v("\n          Tipo:\n        ")]),e._v("\n        "+e._s(e.tipoRequerimientoDescripcion)+"\n        "),i("q-tooltip",[e._v("Tipo de Requerimiento")])],1)],1):e._e(),e.usuariosAsignadosSetted?i("span",{staticClass:"q-mx-xs"},[i("q-chip",{attrs:{removable:""},on:{remove:function(t){return e.removeFilter("usuariosAsignados")}}},[i("q-avatar",{staticClass:"filter-label",attrs:{color:"green","text-color":"white"}},[e._v("\n          U.A.:\n        ")]),e._v("\n        "+e._s(e.usuariosAsignadosDescripcion)+"\n        "),i("q-tooltip",[e._v("Usuarios Asignados")])],1)],1):e._e()])],1)},I=[],j=i("252f"),L=j["a"],$=Object(h["a"])(L,P,I,!1,null,null,null),M=$.exports,N={name:"AsignarRequerimientos",components:{PageHeader:l["a"],AsignarRequerimientosList:O,DialogDetalleRequerimiento:y["a"],AsignarRequerimientosDialogConfirmOperation:D,AsignarRequerimientosFiltros:M},mixins:[c["a"]],computed:r()({},Object(a["d"])("asignacionRequerimientos",{reqs:function(e){return e.requerimientos},loadingList:function(e){return e.loadingRequerimientos}}),{},Object(a["c"])("asignacionRequerimientos",["requerimientosFiltered"])),created:function(){this.$store.dispatch("requerimientos/createRequerimiento"),this.$store.dispatch("asignacionRequerimientos/fetchRequerimientos")},methods:{aplicarFiltroRapidoTipoReq:function(e){var t=null;"Arreglo"===e?t={descripcion:"Arreglo rápido",id:1}:"Desarrollo"===e&&(t={descripcion:"Desarrollos / Modificaciones / Implementaciones",id:2}),this.$store.dispatch("asignacionRequerimientos/setFilter",{filter:"requerimientoTipo",value:t})}}},B=N,V=(i("9549"),Object(h["a"])(B,s,n,!1,null,"5d323a9d",null));t["default"]=V.exports},cfa0:function(e,t,i){"use strict";var s=i("52cf"),n=i.n(s);n.a},f03e:function(e,t,i){},f1b7:function(e,t,i){var s=i("a745");function n(e){if(s(e))return e}e.exports=n},f3e3:function(e,t,i){var s=i("f1b7"),n=i("7e9a"),o=i("061d");function r(e,t){return s(e)||n(e,t)||o()}e.exports=r}}]);