(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d226718"],{e94b:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("b-container",{attrs:{fluid:"xl"}},[a("h1",[e._v("Debug")]),a("b-textarea",{ref:"area",attrs:{rows:"10"},model:{value:e.trade,callback:function(t){e.trade=t},expression:"trade"}}),a("b-button",{staticClass:"mt-3",attrs:{variant:"danger",block:""},on:{click:function(t){return e.addTrade()}}},[e._v("Add trade")]),a("trader-filter",{model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}}),a("trades-table",{attrs:{settings:e.settings,"trader-filter":e.filter}})],1)},n=[],s=a("5530"),i=(a("d81d"),a("eba6")),d=a("0991"),l=a("c1df"),o=a.n(l),c=a("6d8c"),u=a("2f62"),m=a("8c84"),b=Object(u["a"])("events"),f=b.mapMutations,p=b.mapGetters,v={name:"Debug",data:function(){var e={data:{achg:-95.94521883,gain:.0004554530648,id:123,man:!1,norm:.017443932,normch:5.144265423e-9,open:533919899e-14,p0:5906359106e-15,pl:.00982398386,pos:7511.12096288,price:474e-8,rpl:.014395703,time:o()().valueOf(),volume:.0004491420531},id:"1111",symbol:null,type:"trade"};return{filter:[],settings:{show:!0,modern:!0},trade:JSON.stringify(e,void 0,2)}},components:{TradesTable:i["a"],TraderFilter:d["a"]},computed:Object(s["a"])({},p(["infos"])),methods:Object(s["a"])(Object(s["a"])({},f({commitBatch:c["a"]})),{},{addTrade:function(){var e={};m["a"].reset(e);var t=JSON.parse(this.trade);t.symbol||(t.symbol=this.infos[0].symbol),m["a"].add(e,m["a"].map(t)),this.commitBatch(e)}})},h=v,g=a("2877"),w=Object(g["a"])(h,r,n,!1,null,null,null);t["default"]=w.exports}}]);
//# sourceMappingURL=chunk-2d226718.f241fff2.js.map