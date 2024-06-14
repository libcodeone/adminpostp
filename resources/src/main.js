import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import router from "./router";
import Auth from "./auth/index.js";
import authorization from "./store/modules/auth.js"

window.auth = new Auth();

import "viewerjs/dist/viewer.css";
import {
    ValidationObserver,
    ValidationProvider,
    extend,
    localize
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import VueSweetalert2 from "vue-sweetalert2";

Vue.use(VueSweetalert2);

localize({
    en: {
        messages: {
            required: "This field is required",
            required_if: "This field is required",
            regex: "This field must be a valid",
            mimes: `This field must have a valid file type.`,
            size: (_, { size }) => `This field size must be less than ${size}.`,
            min: "This field must have no less than {length} characters",
            max: (_, { length }) =>
                `This field must have no more than ${length} characters`
        }
    }
});
// Install VeeValidate rules and localization
Object.keys(rules).forEach(rule => {
    extend(rule, rules[rule]);
});

// Register it globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);

import StockyKit from "./plugins/stocky.kit";
Vue.use(StockyKit);

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

var VueCookie = require("vue-cookie");
Vue.use(VueCookie);

window.axios = require("axios");
window.axios.defaults.baseURL = "/api/";

window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.data) {
            if (error.response.status === 401) {
                window.location.href = "/login";
            }
            if (error.response.status === 404) {
                router.push({ name: "NotFound" });
            }
            if (error.response.status === 403) {
                router.push({ name: redirectByRole() });
            }

            return Promise.reject(error.response.data);
        }
        return Promise.reject(error.message);
    }
);

function redirectByRole() {
    let userRoleName =
        (store.getters.currentUser === null || store.getters.currentUser == {})
            ? ((authorization.getters.currentUser.roles === undefined ||
            authorization.getters.currentUser.roles === null ||
            authorization.getters.currentUser.roles.length < 1)
                ? null
                : ((authorization.getters.currentUser.roles["name"] === undefined ||
                authorization.getters.currentUser.roles["name"] === null)
                    ? authorization.getters.currentUser.roles.name
                    : authorization.getters.currentUser.roles["name"]))
            : ((store.getters.currentUser.roles === undefined ||
            store.getters.currentUser.roles === null ||
            store.getters.currentUser.roles.length < 1)
                ? null
                : ((store.getters.currentUser.roles["name"] === undefined ||
                store.getters.currentUser.roles["name"] === null)
                    ? store.getters.currentUser.roles.name
                    : store.getters.currentUser.roles["name"]));

    let pathToRedirect = '';

    if (userRoleName !== null) {
        if (userRoleName === "Owner") pathToRedirect = "index_sales_pay";
        else if (userRoleName === "Secretaria") pathToRedirect = "index_sales_pay";
        else if (userRoleName === "Vendedor") pathToRedirect = "pos";
        else if (userRoleName === "Despachador") pathToRedirect = "index_products";
        else if (userRoleName === "MULTI") pathToRedirect = "index_purchase_return";
        else if (userRoleName === "Caja") pathToRedirect = "not_authorize";
        else pathToRedirect = "not_authorize";
    } else pathToRedirect = "not_authorize";

    return pathToRedirect;
}

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";

import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
Vue.use(Autocomplete);

window.Fire = new Vue();

import Breadcumb from "./components/breadcumb";
import { i18n } from "./plugins/i18n";

Vue.component("breadcumb", Breadcumb);

Vue.config.productionTip = true;
Vue.config.silent = true;
Vue.config.devtools = false;

new Vue({
    store,
    router,
    VueCookie,
    i18n,
    render: h => h(App)
}).$mount("#app");
