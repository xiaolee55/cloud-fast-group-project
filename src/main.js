import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cloudbase from "@cloudbase/vue-provider";
import config from "../cloudbaserc";

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.use(Cloudbase, {
  env: config.envId,
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
