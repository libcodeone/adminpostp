<template>
    <div class="main-header" style="display: flex; padding-left: 0.5rem">
        <div class="logo">
            <router-link to="/app/dashboard">
                <img :src="'/images/logo-2.png'" alt width="60" height="60" />
            </router-link>
        </div>

        <div @click="sideBarToggle" class="menu-toggle">
            <div></div>
            <div></div>
            <div></div>
        </div>

        <div style="margin: auto"></div>

        <div class="header-part-right">
            <div v-if="isMobile || isMobileDevice">
                <div style="display: flex;">
                    <button
                        v-if="
                            currentUserPermissions &&
                                currentUserPermissions.includes('posAuthTokenGen')
                        "
                        style="margin-right: 1.25px; padding: 2.5px; display: flex; align-items: center; justify-content: center;"
                        class="btn btn-outline-success btn-sm btn-rounded"
                        @click="openModalForNewGeneratedPosAuthCode"
                        type="button"
                    >
                        <span style="font-size: 67.5%; font-weight: bold; text-align: center;">Token</span>
                    </button>

                    <router-link
                        v-if="currentUserPermissions && currentUserPermissions.includes('Pos_view')"
                        class="btn btn-outline-primary btn-sm btn-rounded"
                        style="margin-left: 1.25px; padding: 2.5px;"
                        to="/app/pos"
                    >
                        <span style="font-size: 67.5%; font-weight: bold; text-align: center;">POS</span>
                    </router-link>
                </div>
            </div>

            <div v-else>
                <div style="display: flex;">
                    <button
                        v-if="
                            currentUserPermissions &&
                                currentUserPermissions.includes('posAuthTokenGen')
                        "
                        style="margin-right: 1.25px;"
                        class="btn btn-outline-success btn-sm btn-rounded"
                        @click="openModalForNewGeneratedPosAuthCode"
                        type="button"
                    >
                        <span style="font-weight: bold; text-align: center;">Token</span>
                    </button>

                    <router-link
                        v-if="currentUserPermissions && currentUserPermissions.includes('Pos_view')"
                        class="btn btn-outline-primary btn-sm btn-rounded"
                        style="margin-left: 1.25px;"
                        to="/app/pos"
                    >
                        <span style="font-weight: bold; text-align: center;">POS</span>
                    </router-link>
                </div>
            </div>

            <b-modal
                size="md"
                hide-footer
                :no-close-on-esc="true"
                :no-close-on-backdrop="true"
                id="generatedPosAuthTokenModal"
                :title="$t('authorizedCodeLabel')"
            >
                <b-form>
                    <b-row>
                        <b-col>
                            <!-- <b-form-group class="input-select-group">
                                <div class="input-group">
                                    <select class="form-control" v-model="timeUnit">
                                        <option value="segundos">Segundos</option>
                                        <option value="minutos">Minutos</option>
                                        <option value="horas">Horas</option>
                                        <option value="dias">Días</option>
                                        <option value="semanas">Semanas</option>
                                        <option value="meses">Meses</option>
                                        <option value="anios">Años</option>
                                    </select>
                                    <input type="number" class="form-control" v-model="timeValue" placeholder="Ingresa la cantidad en la unidad que desees seleccionar" />
                                </div>
                            </b-form-group> -->
                            <input
                                type="text"
                                v-model="generatedToken"
                                class="form-control"
                                name="GeneratedToken"
                                readonly="true"
                            />
                        </b-col>
                    </b-row>
                    <b-row
                        style="align-items: center; display: flex; justify-content: space-evenly; margin: 1rem 0 0 0;"
                    >
                        <b-col style="align-items: center; justify-content: center;">
                            <b-button
                                type="button"
                                variant="primary"
                                size="sm"
                                block
                                @click="copyToClipboard(generatedToken)"
                            >
                                Copiar al portapapeles
                            </b-button>
                        </b-col>
                        <b-col style="align-items: center; justify-content: center;">
                            <b-button
                                type="button"
                                variant="danger"
                                size="sm"
                                block
                                @click="exitModal"
                            >
                                Cerrar
                            </b-button>
                        </b-col>
                    </b-row>
                </b-form>
            </b-modal>

            <div style="display: flex;">
                <!-- Full screen toggle -->
                <div style="display: flex; align-items: center; justify-content: center;">
                    <i
                        class="i-Full-Screen header-icon d-none d-sm-inline-block"
                        @click="handleFullScreen"
                    ></i>
                </div>

                <!-- Grid menu Dropdown -->
                <div class="dropdown">
                    <b-dropdown
                        id="dropdown"
                        text="Dropdown Button"
                        class="m-md-2 d-md-block"
                        toggle-class="text-decoration-none"
                        no-caret
                        variant="link"
                    >
                        <template slot="button-content">
                            <i
                                class="i-Globe text-muted header-icon"
                                role="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            ></i>
                        </template>
                        <vue-perfect-scrollbar
                            :settings="{
                                suppressScrollX: true,
                                wheelPropagation: false
                            }"
                            ref="myData"
                            class="dropdown-menu-right rtl-ps-none notification-dropdown ps scroll"
                        >
                            <div class="menu-icon-grid">
                                <a @click="SetLocal('es')">
                                    <i
                                        title="es"
                                        class="flag-icon flag-icon-squared flag-icon-es"
                                    ></i>
                                    <span class="title-lang">Español</span>
                                </a>
                                <a @click="SetLocal('en')">
                                    <i
                                        title="en"
                                        class="flag-icon flag-icon-squared flag-icon-gb"
                                    ></i>
                                    English
                                </a>
                                <!-- <a @click="SetLocal('fr')">
                                    <i title="fr" class="flag-icon flag-icon-squared flag-icon-fr"></i>
                                    <span class="title-lang">French</span>
                                </a> -->
                                <!-- <a @click="SetLocal('ar')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-sa"></i>
                                    <span class="title-lang">Arabic</span>
                                </a>
                                <a @click="SetLocal('tur')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-tr"></i>
                                    <span class="title-lang">Turkish</span>
                                </a> -->
                                <!-- <a @click="SetLocal('sm_ch')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-cn"></i>
                                    <span class="title-lang">Simplified Chinese</span>
                                </a> -->
                                <!-- <a @click="SetLocal('thai')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-tw"></i>
                                    <span class="title-lang">Thaï</span>
                                </a>
                                <a @click="SetLocal('hn')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-in"></i>
                                    <span class="title-lang">Hindi</span>
                                </a> -->
                                <!-- <a @click="SetLocal('de')">
                                    <i title="de" class="flag-icon flag-icon-squared flag-icon-de"></i>
                                    <span class="title-lang">German</span>
                                </a> -->
                                <!-- <a @click="SetLocal('it')">
                                    <i title="it" class="flag-icon flag-icon-squared flag-icon-it"></i>
                                    <span class="title-lang">Italien</span>
                                </a>
                                <a @click="SetLocal('Ind')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-id"></i>
                                    <span class="title-lang">Indonesian</span>
                                </a> -->
                                <!-- <a @click="SetLocal('tr_ch')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-cn"></i>
                                    <span class="title-lang">Traditional Chinese</span>
                                </a>
                                <a @click="SetLocal('ru')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-ru"></i>
                                    <span class="title-lang">Russian</span>
                                </a>
                                <a @click="SetLocal('vn')">
                                    <i title="sa" class="flag-icon flag-icon-squared flag-icon-vn"></i>
                                    <span class="title-lang">Vietnamese</span>
                                </a> -->
                            </div>
                        </vue-perfect-scrollbar>
                    </b-dropdown>
                </div>
                <!-- Notificaiton -->
                <div class="dropdown">
                    <b-dropdown
                        id="dropdown-1"
                        text="Dropdown Button"
                        class="m-md-2 badge-top-container d-sm-inline-block"
                        toggle-class="text-decoration-none"
                        no-caret
                        variant="link"
                    >
                        <template slot="button-content">
                            <span
                                class="badge badge-primary"
                                v-if="notifs_alert > 0"
                                >1</span
                            >
                            <i class="i-Bell text-muted header-icon"></i>
                        </template>
                        <!-- Notification dropdown -->
                        <vue-perfect-scrollbar
                            :settings="{
                                suppressScrollX: true,
                                wheelPropagation: false
                            }"
                            :class="{
                                open: getSideBarToggleProperties.isSideNavOpen
                            }"
                            ref="myData"
                            class="dropdown-menu-right rtl-ps-none notification-dropdown ps scroll"
                        >
                            <div
                                class="dropdown-item d-flex"
                                v-if="notifs_alert > 0"
                            >
                                <div class="notification-icon">
                                    <i class="i-Bell text-primary mr-1"></i>
                                </div>
                                <div
                                    class="notification-details flex-grow-1"
                                    v-if="
                                        currentUserPermissions &&
                                            currentUserPermissions.includes(
                                                'Reports_quantity_alerts'
                                            )
                                    "
                                >
                                    <router-link
                                        tag="a"
                                        to="/app/reports/quantity_alerts"
                                    >
                                        <p class="text-small text-muted m-0">
                                            {{ notifs_alert }}
                                            {{ $t("ProductQuantityAlerts") }}
                                        </p>
                                    </router-link>
                                </div>
                            </div>
                        </vue-perfect-scrollbar>
                    </b-dropdown>
                </div>
                <!-- Notification End -->

                <!-- User avatar dropdown -->
                <div class="dropdown">
                    <b-dropdown
                        id="dropdown-1"
                        text="Dropdown Button"
                        class="m-md-2 user align-self-end d-md-block"
                        toggle-class="text-decoration-none"
                        no-caret
                        variant="link"
                    >
                        <template slot="button-content">
                            <img
                                :src="'/images/avatar/' + currentUser.avatar"
                                id="userDropdown"
                                alt
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            />
                        </template>

                        <div
                            class="dropdown-menu-right"
                            aria-labelledby="userDropdown"
                        >
                            <div class="dropdown-header">
                                <i class="i-Lock-User mr-1"></i>
                                <span>{{ currentUser.username }}</span>
                            </div>
                            <router-link to="/app/profile" class="dropdown-item">{{
                                $t("profil")
                            }}</router-link>
                            <router-link
                                v-if="
                                    currentUserPermissions &&
                                        currentUserPermissions.includes(
                                            'setting_system'
                                        )
                                "
                                to="/app/settings/System_settings"
                                class="dropdown-item"
                                >{{ $t("Settings") }}</router-link
                            >
                            <a
                                class="dropdown-item"
                                href="#"
                                @click.prevent="logoutUser"
                                >{{ $t("logout") }}</a
                            >
                        </div>
                    </b-dropdown>
                </div>
            </div>
        </div>
    </div>

    <!-- header top menu end -->
</template>

<!-- <style>
.input-select-group .input-group {
    display: flex;
}

.input-select-group select.form-control {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.input-select-group input.form-control {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style> -->

<script>
import NProgress from "nprogress";
import Util from "./../../../utils";
// import Sidebar from "./Sidebar";
import { isMobile } from "mobile-device-detect";
import { mapGetters, mapActions } from "vuex";
import { mixin as clickaway } from "vue-clickaway";
// import { setTimeout } from 'timers';
import FlagIcon from "vue-flag-icon";

export default {
    mixins: [clickaway],
    components: {
        FlagIcon
    },

    data() {
        return {
            isMobileDevice: (navigator.userAgent) ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : window.innerWidth <= 600,
            langs: [
                "en",
                "fr",
                "ar",
                "de",
                "es",
                "it",
                "Ind",
                "thai",
                "tr_ch",
                "sm_ch",
                "tur",
                "ru",
                "hn",
                "vn"
            ],
            // timeUnit: 'segundos',
            // timeValue: null,
            generatedToken: null,
            isDisplay: true,
            isStyle: true,
            isSearchOpen: false,
            isMouseOnMegaMenu: true,
            isMegaMenuOpen: false,
            is_Load: false
            // alerts:0,
        };
    },

    computed: {
        ...mapGetters([
            "currentUser",
            "getSideBarToggleProperties",
            "currentUserPermissions",
            "notifs_alert"
        ])
    },

    methods: {
        ...mapActions([
            "changeSecondarySidebarProperties",
            "changeSidebarProperties",
            "changeThemeMode",
            "logout"
        ]),

        async copyToClipboard(text) {
            let textToCopy = text;
            let clipboard = navigator.clipboard;

            if (clipboard)
            {
                await navigator.permissions.query({ name: 'clipboard-write' }).then(async (result) =>
                    {
                        if (result.state === "granted" || result.state === "prompt")
                        {
                            await navigator.clipboard.writeText(textToCopy).then(() =>
                                {
                                    this.makeToast("success", "¡Contenido copiado al portapapeles!", "¡Éxito!");
                                }
                            ).catch((error) =>
                                {
                                    this.makeToast("danger", "¡Error al copiar al portapapeles!", "¡Fallido!");
                                    console.warn("Copy to clipboard failed!\n\n", error);
                                }
                            );
                        }
                    }
                );

                return true;
            }
            else if (document.queryCommandSupported && document.queryCommandSupported("copy"))
            {
                let textarea = document.createElement("textarea");
                textarea.style.display = "none";
                textarea.style.position = "fixed";
                textarea.textContent = textToCopy;

                document.body.appendChild(textarea);
                textarea.select();

                try {
                    this.makeToast("success", "¡Contenido copiado al portapapeles!", "¡Éxito!");
                    return document.execCommand("copy");
                } catch (exception) {
                    this.makeToast("danger", "¡Error al copiar al portapapeles!", "¡Fallido!");
                    console.warn("Copy to clipboard failed!\n\n", exception);
                    return false;
                } finally {
                    document.body.removeChild(textarea);
                }
            }
            else
            {
                this.makeToast("danger", "¡Error al copiar al portapapeles!", "¡Fallido!");
                return false;
            }
        },

        openModalForNewGeneratedPosAuthCode() {
            NProgress.start();
            NProgress.set(0.1);

            axios
                .get("pos/generateNewPosAuthToken")
                .then(response => {
                    if (response.status === 200) {
                        this.generatedToken = response.data.token;
                        this.$bvModal.show("generatedPosAuthTokenModal");
                    }

                    NProgress.done();
                    this.isLoading = false;
                })
                .catch(() => {
                    NProgress.done();

                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
        },

        exitModal() {
            this.generatedToken = null;
            this.$bvModal.hide("generatedPosAuthTokenModal");
        },

        logoutUser() {
            this.$store.dispatch("logout");
        },

        SetLocal(locale) {
            this.$i18n.locale = locale;
            this.$store.dispatch("language/setLanguage", locale);
            Fire.$emit("ChangeLanguage");
        },

        makeToast(variant, message, title) {
            this.$root.$bvToast.toast(message,
                {
                    title: title,
                    variant: variant,
                    solid: true
                }
            );
        },

        handleFullScreen() {
            Util.toggleFullScreen();
        },

        logoutUser() {
            this.logout();
        },

        closeMegaMenu() {
            this.isMegaMenuOpen = false;
        },
        toggleMegaMenu() {
            this.isMegaMenuOpen = !this.isMegaMenuOpen;
        },
        toggleSearch() {
            this.isSearchOpen = !this.isSearchOpen;
        },

        sideBarToggle(el) {
            if (
                this.getSideBarToggleProperties.isSideNavOpen &&
                this.getSideBarToggleProperties.isSecondarySideNavOpen &&
                isMobile
            ) {
                this.changeSidebarProperties();
                this.changeSecondarySidebarProperties();
            } else if (
                this.getSideBarToggleProperties.isSideNavOpen &&
                this.getSideBarToggleProperties.isSecondarySideNavOpen
            ) {
                this.changeSecondarySidebarProperties();
            } else if (this.getSideBarToggleProperties.isSideNavOpen) {
                this.changeSidebarProperties();
            } else if (
                !this.getSideBarToggleProperties.isSideNavOpen &&
                !this.getSideBarToggleProperties.isSecondarySideNavOpen &&
                !this.getSideBarToggleProperties.isActiveSecondarySideNav
            ) {
                this.changeSidebarProperties();
            } else if (
                !this.getSideBarToggleProperties.isSideNavOpen &&
                !this.getSideBarToggleProperties.isSecondarySideNavOpen
            ) {
                this.changeSidebarProperties();
                this.changeSecondarySidebarProperties();
            }
        }
    }
};
</script>
