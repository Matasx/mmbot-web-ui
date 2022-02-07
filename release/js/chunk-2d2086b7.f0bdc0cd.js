(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2086b7"],{a55b:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("b-container",{attrs:{fluid:"xl"}},[r("h1",[e._v("Sign in")]),r("login-form")],1)},s=[],a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-form",{staticClass:"login mb-3",on:{submit:function(t){return t.preventDefault(),e.login.apply(null,arguments)}}},[r("b-form-group",{attrs:{"label-for":"input-1",label:"Username:"}},[r("b-input-group",[r("b-input-group-prepend",{attrs:{"is-text":""}},[r("fa-icon",{attrs:{icon:"user"}})],1),r("b-form-input",{attrs:{id:"input-1",state:!!e.username,autocomplete:"username",placeholder:"Enter your username",type:"text"},model:{value:e.username,callback:function(t){e.username=t},expression:"username"}})],1)],1),r("b-form-group",{attrs:{"label-for":"input-2",label:"Password:"}},[r("b-input-group",[r("b-input-group-prepend",{attrs:{"is-text":""}},[r("fa-icon",{attrs:{icon:"key"}})],1),r("b-form-input",{attrs:{id:"input-2",state:!!e.password,autocomplete:"current-password",placeholder:"Enter your password",type:"password"},model:{value:e.password,callback:function(t){e.password=t},expression:"password"}})],1)],1),r("b-input-group",[r("b-form-checkbox",{attrs:{switch:""},model:{value:e.persistent,callback:function(t){e.persistent=t},expression:"persistent"}},[e._v("Remember me")])],1),r("b-form-row",[r("b-col",{attrs:{cols:"3",offset:"6"}},[r("b-button",{attrs:{block:"",size:"lg",type:"reset",variant:"outline-danger"}},[e._v("Reset")])],1),r("b-col",{attrs:{cols:"3"}},[r("b-button",{attrs:{block:"",size:"lg",type:"submit",variant:"success"}},[e._v("Login")])],1)],1)],1),r("b-alert",{attrs:{show:e.alertCountDown,dismissible:"",variant:"danger"},on:{dismissed:function(t){e.alertCountDown=0},"dismiss-count-down":e.countDownChanged}},[r("p",[e._v(e._s(e.error))]),r("b-progress",{attrs:{variant:"danger",max:e.dismissSecs,value:e.alertCountDown,height:"4px"}})],1)],1)},o=[],i=r("1da1"),u=r("5530"),c=(r("96cf"),r("d3b7"),r("25f0"),r("d017")),p=r("2f62"),l=r("bc3a"),d=r.n(l),m=r("a18c"),b=Object(p["a"])("auth"),h=b.mapGetters,f=b.mapActions,w={name:"LoginForm",data:function(){return{username:"",password:"",error:"",persistent:!1,dismissSecs:5,alertCountDown:0}},computed:Object(u["a"])(Object(u["a"])({},h(["user","viewer","admin"])),{},{redirect:function(){var e=this.$route.query.redirect;return e&&e.length>0?e:"/"}}),methods:Object(u["a"])(Object(u["a"])({login:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,d.a.post("api/user",{user:this.username,password:this.password,cookie:this.persistent?"permanent":"temporary"});case 3:if(t=e.sent,!t.data||!t.data.viewer&&!t.data.admin){e.next=10;break}return e.next=7,this.authCheck();case 7:this.doRedirect(),e.next=11;break;case 10:throw new Error("Login attempt failed!");case 11:e.next=17;break;case 13:e.prev=13,e.t0=e["catch"](0),this.error=e.t0.toString(),this.alertCountDown=this.dismissSecs;case 17:case"end":return e.stop()}}),e,this,[[0,13]])})));function t(){return e.apply(this,arguments)}return t}(),countDownChanged:function(e){this.alertCountDown=e}},f({authCheck:c["a"]})),{},{doRedirect:function(){m["a"].push(this.redirect)}}),mounted:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.authCheck();case 3:e.admin&&e.doRedirect(),t.next=10;break;case 6:t.prev=6,t.t0=t["catch"](0),e.error=t.t0.toString(),e.alertCountDown=e.dismissSecs;case 10:case"end":return t.stop()}}),t,null,[[0,6]])})))()}},g=w,v=r("2877"),x=Object(v["a"])(g,a,o,!1,null,null,null),k=x.exports,C={components:{LoginForm:k}},y=C,D=Object(v["a"])(y,n,s,!1,null,null,null);t["default"]=D.exports}}]);
//# sourceMappingURL=chunk-2d2086b7.f0bdc0cd.js.map