<template>
    <div class="pos_page">
        <div
            class="container-fluid p-0 app-admin-wrap layout-sidebar-large clearfix"
            id="pos"
        >
            <div
                v-if="isLoading"
                class="loading_page spinner spinner-primary mr-3"
            ></div>
            <b-row v-if="!isLoading">
                <!-- Card Left Panel Details Sale-->
                <b-col md="5">
                    <b-card no-body class="card-order">
                        <div class="main-header">
                            <div
                                class="logo"
                                v-show="
                                    currentUserPermissions &&
                                        currentUserPermissions.includes(
                                            'dashboard'
                                        )
                                "
                            >
                                <router-link to="/app/dashboard">
                                    <img
                                        :src="'/images/logo-2.png'"
                                        alt
                                        width="60"
                                        height="60"
                                    />
                                </router-link>
                            </div>
                            <div class="mx-auto"></div>

                            <div class="header-part-right">
                                <!-- Full screen toggle -->
                                <i
                                    class="i-Full-Screen header-icon d-none d-sm-inline-block"
                                    @click="handleFullScreen"
                                ></i>
                                <!-- Grid menu Dropdown -->

                                <div class="dropdown">
                                    <b-dropdown
                                        id="dropdown"
                                        text="Dropdown Button"
                                        class="m-md-2"
                                        toggle-class="text-decoration-none"
                                        no-caret
                                        right
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
                                            class="dropdown-menu-left rtl-ps-none notification-dropdown ps scroll"
                                        >
                                            <div class="menu-icon-grid">
                                                <a @click="SetLocal('es')">
                                                    <i
                                                        title="es"
                                                        class="flag-icon flag-icon-squared flag-icon-es"
                                                    ></i>
                                                    <span class="title-lang"
                                                        >Español</span
                                                    >
                                                </a>
                                                <a @click="SetLocal('en')">
                                                    <i
                                                        title="en"
                                                        class="flag-icon flag-icon-squared flag-icon-gb"
                                                    ></i>
                                                    English
                                                </a>
                                            </div>
                                        </vue-perfect-scrollbar>
                                    </b-dropdown>
                                </div>

                                <!-- User avatar dropdown -->
                                <div class="dropdown">
                                    <b-dropdown
                                        id="dropdown-1"
                                        text="Dropdown Button"
                                        class="m-md-2 user col align-self-end"
                                        toggle-class="text-decoration-none"
                                        no-caret
                                        variant="link"
                                        right
                                    >
                                        <template slot="button-content">
                                            <img
                                                :src="
                                                    '/images/avatar/' +
                                                        currentUser.avatar
                                                "
                                                id="userDropdown"
                                                alt
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            />
                                        </template>

                                        <div
                                            class="dropdown-menu-left"
                                            aria-labelledby="userDropdown"
                                        >
                                            <div class="dropdown-header">
                                                <i class="i-Lock-User mr-1"></i>
                                                <span>{{
                                                    currentUser.username
                                                }}</span>
                                            </div>
                                            <!--<router-link to="/app/profile" class="dropdown-item">{{$t('profil')}}</router-link>-->
                                            <router-link
                                                v-if="
                                                    currentUserPermissions &&
                                                        currentUserPermissions.includes(
                                                            'setting_system'
                                                        )
                                                "
                                                to="/app/settings/System_settings"
                                                class="dropdown-item"
                                                >{{
                                                    $t("Settings")
                                                }}</router-link
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

                        <validation-observer ref="create_pos">
                            <b-form @submit.prevent="Submit_Pos">
                                <b-card-body>
                                    <b-row>
                                        <!-- Customer -->
                                        <b-col lg="12" md="12" sm="12">
                                            <validation-provider
                                                name="Customer"
                                                :rules="{ required: true }"
                                            >
                                                <b-input-group
                                                    slot-scope="{
                                                        valid,
                                                        errors
                                                    }"
                                                    class="input-customer"
                                                >
                                                    <div style="width: 100%;">
                                                        <label
                                                            for="customer-select"
                                                            >Seleccione un
                                                            cliente:</label
                                                        >
                                                        <input
                                                            class="form-control"
                                                            id="customer-select"
                                                            name="customer-select"
                                                            list="customer-options"
                                                            v-model="
                                                                sale.client_id
                                                            "
                                                            :class="{
                                                                'is-invalid': !!errors.length,
                                                                'is-valid': valid
                                                            }"
                                                            placeholder="Ingrese el nombre o ID de cliente"
                                                        />
                                                        <datalist
                                                            id="customer-options"
                                                        >
                                                            <option
                                                                v-for="client in clients"
                                                                :key="client.id"
                                                                :value="
                                                                    client.id
                                                                "
                                                            >
                                                                {{
                                                                    client.name
                                                                }}
                                                                -
                                                                {{
                                                                    client.final_consumer
                                                                }}
                                                                ({{
                                                                    client.phone
                                                                }})
                                                            </option>
                                                        </datalist>
                                                    </div>

                                                    <!-- <b-col lg="12" md="12" sm="12" class="w-100">
                                                        <b-row>
                                                            <autocomplete
                                                            :search="search"
                                                            :placeholder="$t('Choose_Customer')"
                                                            aria-label="Choose_Customer"
                                                            :get-result-value="getResultValueClient"
                                                            @submit="SearchClient"
                                                            ref="autocompletec"
                                                            />
                                                        </b-row>
                                                        <b-row>
                                                            <span class="badge badge-success" v-if="sale.client_id != ''">{{sale.client_name}}</span>
                                                            <span class="badge badge-warning" v-if="sale.client_id == ''">{{$t('Choose_Customer')}}</span>
                                                        </b-row>
                                                    </b-col> -->

                                                    <div
                                                        style="margin-top: auto;"
                                                    >
                                                        <b-button
                                                            variant="primary"
                                                            @click="
                                                                New_Client()
                                                            "
                                                        >
                                                            <span>
                                                                <i
                                                                    class="i-Add-User"
                                                                ></i>
                                                            </span>
                                                        </b-button>
                                                    </div>
                                                </b-input-group>
                                            </validation-provider>
                                        </b-col>

                                        <!-- warehouse -->
                                        <b-col lg="12" md="12" sm="12">
                                            <validation-provider
                                                name="warehouse"
                                                :rules="{ required: true }"
                                            >
                                                <b-form-group
                                                    slot-scope="{
                                                        valid,
                                                        errors
                                                    }"
                                                    class="mt-2"
                                                >
                                                    <v-select
                                                        :class="{
                                                            'is-invalid': !!errors.length
                                                        }"
                                                        :state="
                                                            errors[0]
                                                                ? false
                                                                : valid
                                                                ? true
                                                                : null
                                                        "
                                                        :disabled="
                                                            details.length > 0
                                                        "
                                                        @input="
                                                            Selected_Warehouse
                                                        "
                                                        v-model="
                                                            sale.warehouse_id
                                                        "
                                                        :reduce="
                                                            label => label.value
                                                        "
                                                        :placeholder="
                                                            $t(
                                                                'Choose_Warehouse'
                                                            )
                                                        "
                                                        :options="
                                                            warehouses.map(
                                                                warehouses => ({
                                                                    label:
                                                                        warehouses.name,
                                                                    value:
                                                                        warehouses.id
                                                                })
                                                            )
                                                        "
                                                    />
                                                </b-form-group>
                                            </validation-provider>
                                        </b-col>

                                        <!-- Details Product  -->
                                        <b-col md="12" class="mt-2">
                                            <div class="pos-detail">
                                                <div class="table-responsive">
                                                    <table
                                                        class="table table-striped"
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">
                                                                    {{
                                                                        $t(
                                                                            "ProductName"
                                                                        )
                                                                    }}
                                                                </th>
                                                                <th scope="col">
                                                                    {{
                                                                        $t(
                                                                            "Price"
                                                                        )
                                                                    }}
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    class="text-center"
                                                                >
                                                                    {{
                                                                        $t(
                                                                            "Qty"
                                                                        )
                                                                    }}
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    class="text-center"
                                                                >
                                                                    {{
                                                                        $t(
                                                                            "SubTotal"
                                                                        )
                                                                    }}
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    class="text-center"
                                                                >
                                                                    <i
                                                                        class="fa fa-trash"
                                                                    ></i>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr
                                                                v-if="
                                                                    details.length <=
                                                                        0
                                                                "
                                                            >
                                                                <td colspan="5">
                                                                    {{
                                                                        $t(
                                                                            "NodataAvailable"
                                                                        )
                                                                    }}
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                v-for="(detail,
                                                                index) in details"
                                                                :key="index"
                                                            >
                                                                <td>
                                                                    <span>{{
                                                                        detail.code
                                                                    }}</span>
                                                                    <br />
                                                                    <span
                                                                        class="badge badge-success"
                                                                        >{{
                                                                            detail.name
                                                                        }}</span
                                                                    >
                                                                    <i
                                                                        @click="
                                                                            Modal_Update_Detail(
                                                                                detail
                                                                            )
                                                                        "
                                                                        class="i-Edit"
                                                                    ></i>
                                                                </td>
                                                                <!-- <td>{{formatNumber(detail.Total_price, 2)}} {{currentUser.currency}}</td> -->
                                                                <td>
                                                                    <!-- <div class="price">
                                                                        <b-form-input
                                                                            :state="getValidationState(validationContext)"
                                                                            v-model.number="detail.Total_price"
                                                                            @keyup="keyup_price_product()"
                                                                        ></b-form-input>
                                                                        <input
                                                                            class="form-control"
                                                                            @keyup="keyup_price_product(detail ,detail.detail_id)"
                                                                            v-model.number="detail.Net_price" :disabled="currentUserPermissions && (currentUserPermissions.includes('Sales_edit'))"
                                                                        >
                                                                    </div>-->
                                                                    <div
                                                                        class="logo"
                                                                        v-show="
                                                                            currentUserPermissions &&
                                                                                !currentUserPermissions.includes(
                                                                                    'Pos_price_edit'
                                                                                )
                                                                        "
                                                                    >
                                                                        <span>{{
                                                                            detail.Net_price
                                                                        }}</span>
                                                                    </div>
                                                                    <div
                                                                        class="logo"
                                                                        v-show="
                                                                            currentUserPermissions &&
                                                                                currentUserPermissions.includes(
                                                                                    'Pos_price_edit'
                                                                                )
                                                                        "
                                                                    >
                                                                        <!-- <input
                                                                            class="form-control"
                                                                            @keyup="
                                                                                keyup_price_product(
                                                                                    detail,
                                                                                    detail.detail_id
                                                                                )
                                                                            "
                                                                            disabled="disabled"
                                                                            v-model.number="detail.Net_price"
                                                                        /> -->
                                                                        <input
                                                                            class="form-control"
                                                                            disabled="disabled"
                                                                            v-model.number="
                                                                                detail.Net_price
                                                                            "
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div
                                                                        class="quantity"
                                                                    >
                                                                        <b-input-group>
                                                                            <b-input-group-prepend>
                                                                                <span
                                                                                    class="btn btn-primary btn-sm"
                                                                                    @click="
                                                                                        decrement(
                                                                                            detail,
                                                                                            detail.detail_id
                                                                                        )
                                                                                    "
                                                                                    >-</span
                                                                                >
                                                                            </b-input-group-prepend>

                                                                            <input
                                                                                class="form-control"
                                                                                @keyup="
                                                                                    Verified_Qty(
                                                                                        detail,
                                                                                        detail.detail_id
                                                                                    )
                                                                                "
                                                                                v-model.number="
                                                                                    detail.quantity
                                                                                "
                                                                            />

                                                                            <b-input-group-append>
                                                                                <span
                                                                                    class="btn btn-primary btn-sm"
                                                                                    @click="
                                                                                        increment(
                                                                                            detail,
                                                                                            detail.detail_id
                                                                                        )
                                                                                    "
                                                                                    >+</span
                                                                                >
                                                                            </b-input-group-append>
                                                                        </b-input-group>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    class="text-center"
                                                                >
                                                                    {{
                                                                        formatNumber(
                                                                            detail.subtotal,
                                                                            2
                                                                        )
                                                                    }}
                                                                    {{
                                                                        currentUser.currency
                                                                    }}
                                                                </td>
                                                                <td>
                                                                    <a
                                                                        @click="
                                                                            delete_product_detail(
                                                                                detail.detail_id
                                                                            )
                                                                        "
                                                                        title="Delete"
                                                                    >
                                                                        <i
                                                                            class="i-Close-Window text-25 text-danger"
                                                                        ></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </b-col>
                                    </b-row>

                                    <!-- Calcul Grand Total -->
                                    <div class="footer_panel">
                                        <b-row>
                                            <b-col md="12">
                                                <div
                                                    class="grandtotal"
                                                    style="color: #000 !important;"
                                                >
                                                    <span
                                                        >{{ $t("Total") }} :
                                                        {{
                                                            formatNumber(
                                                                GrandTotal,
                                                                2
                                                            )
                                                        }}
                                                        {{
                                                            currentUser.currency
                                                        }}</span
                                                    >
                                                </div>
                                            </b-col>

                                            <!-- Order Tax  -->
                                            <!-- <b-col lg="4" md="4" sm="12" v-if="sale.client_id != ''">
                                                <validation-provider
                                                    name="Order Tax"
                                                    :rules="{ regex: /^\d*\.?\d*$/}"
                                                    v-slot="validationContext"
                                                >
                                                    <b-form-group :label="$t('Tax')" append="%">
                                                        <b-input-group append="%">
                                                            <b-form-input
                                                            :state="getValidationState(validationContext)"
                                                            aria-describedby="OrderTax-feedback"
                                                            label="Order Tax"
                                                            v-model.number="sale.tax_rate"
                                                            @keyup="keyup_OrderTax()"
                                                            ></b-form-input>
                                                        </b-input-group>
                                                        <b-form-invalid-feedback
                                                            id="OrderTax-feedback"
                                                        >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                                                    </b-form-group>
                                                </validation-provider>
                                            </b-col> -->

                                            <!-- Discount -->
                                            <!-- <b-col lg="4" md="4" sm="12">
                                                <validation-provider
                                                    name="Discount"
                                                    :rules="{
                                                        regex: /^\d*\.?\d*$/
                                                    }"
                                                    v-slot="validationContext"
                                                >
                                                    <b-form-group
                                                        :label="$t('Discount')"
                                                        append="%"
                                                    >
                                                        <b-input-group
                                                            append="$"
                                                        >
                                                            <b-form-input
                                                                :state="
                                                                    getValidationState(
                                                                        validationContext
                                                                    )
                                                                "
                                                                aria-describedby="Discount-feedback"
                                                                label="Discount"
                                                                v-model.number="
                                                                    sale.discount
                                                                "
                                                                @keyup="
                                                                    keyup_discount()
                                                                "
                                                            ></b-form-input>
                                                        </b-input-group>
                                                        <b-form-invalid-feedback
                                                            id="Discount-feedback"
                                                            >{{
                                                                validationContext
                                                                    .errors[0]
                                                            }}</b-form-invalid-feedback
                                                        >
                                                    </b-form-group>
                                                </validation-provider>
                                            </b-col> -->

                                            <!-- Shipping  -->
                                            <b-col md="12">
                                                <validation-provider
                                                    name="Shipping"
                                                    :rules="{
                                                        regex: /^\d*\.?\d*$/
                                                    }"
                                                    v-slot="validationContext"
                                                >
                                                    <b-form-group
                                                        :label="$t('Shipping')"
                                                    >
                                                        <b-input-group
                                                            append="$"
                                                        >
                                                            <b-form-input
                                                                :state="
                                                                    getValidationState(
                                                                        validationContext
                                                                    )
                                                                "
                                                                aria-describedby="Shipping-feedback"
                                                                label="Shipping"
                                                                v-model.number="
                                                                    sale.shipping
                                                                "
                                                                @keyup="
                                                                    keyup_shipping()
                                                                "
                                                            ></b-form-input>
                                                        </b-input-group>

                                                        <b-form-invalid-feedback
                                                            id="Shipping-feedback"
                                                            >{{
                                                                validationContext
                                                                    .errors[0]
                                                            }}</b-form-invalid-feedback
                                                        >
                                                    </b-form-group>
                                                </validation-provider>
                                            </b-col>

                                            <b-col md="6" sm="12">
                                                <b-button
                                                    @click="resetPos()"
                                                    variant="danger ripple btn-rounded btn-block mt-1"
                                                >
                                                    <i class="i-Power-2"></i>
                                                    {{ $t("Reset") }}
                                                </b-button>
                                            </b-col>
                                            <b-col md="6" sm="12">
                                                <b-button
                                                    type="submit"
                                                    tag="button"
                                                    variant="primary ripple mt-1 btn-rounded btn-block"
                                                    :disabled="loading"
                                                >
                                                    <i class="i-Checkout"></i>
                                                    {{ $t("sendtobox") }}
                                                </b-button>
                                                <div
                                                    v-once
                                                    class="typo__p"
                                                    v-if="loading"
                                                >
                                                    <div
                                                        class="spinner sm spinner-primary mt-3"
                                                    ></div>
                                                </div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                </b-card-body>
                            </b-form>
                        </validation-observer>

                        <!--Modal authorization Code-->
                        <b-modal hide-footer size="md" id="form_Auth_Discount">
                            <b-form @submit.prevent="submitAuthPriceChange">
                                <b-row>
                                    <!-- Auth Code -->
                                    <!-- New AuthorizationCode -->
                                    <b-col md="6">
                                        <validation-provider
                                            name="New AuthorizationCode"
                                            :rules="{ min: 8, max: 8 }"
                                            v-slot="validationContext"
                                        >
                                            <b-form-group
                                                :label="
                                                    $t('authorizedCodeLabel')
                                                "
                                            >
                                                <b-form-input
                                                    :state="
                                                        getValidationState(
                                                            validationContext
                                                        )
                                                    "
                                                    aria-describedby="NewAuthorizedCodeLabel-feedback"
                                                    v-model="
                                                        authorizedCodeEntered
                                                    "
                                                    :placeholder="
                                                        $t(
                                                            'authorizedCodeLabel'
                                                        )
                                                    "
                                                    label="AuthorizedCodeLabel"
                                                    type="text"
                                                    autocomplete="off"
                                                >
                                                </b-form-input>
                                                <b-form-invalid-feedback
                                                    id="authorizedCodeLabel-feedback"
                                                    >{{
                                                        validationContext
                                                            .errors[0]
                                                    }}</b-form-invalid-feedback
                                                >
                                            </b-form-group>
                                        </validation-provider>
                                    </b-col>

                                    <b-col md="12">
                                        <b-form-group>
                                            <b-button
                                                variant="primary"
                                                type="submit"
                                                >{{ $t("submit") }}</b-button
                                            >
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-form>
                        </b-modal>

                        <!-- Update Detail Product -->
                        <validation-observer ref="Update_Detail">
                            <b-modal
                                hide-footer
                                size="md"
                                id="form_Update_Detail"
                                :title="detail.name"
                            >
                                <b-form @submit.prevent="changeProductDetail">
                                    <b-row>
                                        <!-- Unit Price -->
                                        <b-col lg="12" md="12" sm="12">
                                            <validation-provider
                                                name="Product Price"
                                                :rules="{
                                                    required: true,
                                                    regex: /^\d*\.?\d*$/
                                                }"
                                                v-slot="validationContext"
                                            >
                                                <b-form-group
                                                    :label="$t('ProductPrice')"
                                                    id="Price-input"
                                                >
                                                    <b-form-input
                                                        label="Product Price"
                                                        v-model="
                                                            detail.Unit_price
                                                        "
                                                        :state="
                                                            getValidationState(
                                                                validationContext
                                                            )
                                                        "
                                                        aria-describedby="Price-feedback"
                                                    ></b-form-input>
                                                    <b-form-invalid-feedback
                                                        id="Price-feedback"
                                                        >{{
                                                            validationContext
                                                                .errors[0]
                                                        }}</b-form-invalid-feedback
                                                    >
                                                </b-form-group>
                                            </validation-provider>
                                        </b-col>

                                        <!-- Tax Method -->
                                        <!-- <b-col lg="12" md="12" sm="12">
                                            <validation-provider
                                                name="Tax Method"
                                                :rules="{ required: true }"
                                            >
                                                <b-form-group
                                                    slot-scope="{
                                                        valid,
                                                        errors
                                                    }"
                                                    :label="$t('TaxMethod')"
                                                >
                                                    <select
                                                        :class="{
                                                            'is-invalid': !!errors.length
                                                        }"
                                                        :state="
                                                            errors[0]
                                                                ? false
                                                                : valid
                                                                ? true
                                                                : null
                                                        "
                                                        v-model="
                                                            detail.tax_method
                                                        "
                                                        :reduce="
                                                            label => label.value
                                                        "
                                                        :placeholder="
                                                            $t('Choose_Method')
                                                        "
                                                        :options="[
                                                            {
                                                                label:
                                                                    'Exclusive',
                                                                value: '1'
                                                            },
                                                            {
                                                                label:
                                                                    'Inclusive',
                                                                value: '2'
                                                            }
                                                        ]"
                                                    ></select>
                                                    <b-form-invalid-feedback>{{
                                                        errors[0]
                                                    }}</b-form-invalid-feedback>
                                                </b-form-group>
                                            </validation-provider>
                                        </b-col> -->

                                        <!-- Tax -->
                                        <!-- <b-col lg="12" md="12" sm="12">
                                            <validation-provider
                                                name="Tax"
                                                :rules="{
                                                    required: true,
                                                    regex: /^\d*\.?\d*$/
                                                }"
                                                v-slot="validationContext"
                                            >
                                                <b-form-group
                                                    :label="$t('Tax')"
                                                >
                                                    <b-input-group append="%">
                                                        <b-form-input
                                                            label="Tax"
                                                            v-model="
                                                                detail.tax_percent
                                                            "
                                                            :state="
                                                                getValidationState(
                                                                    validationContext
                                                                )
                                                            "
                                                            aria-describedby="Tax-feedback"
                                                        ></b-form-input>
                                                    </b-input-group>
                                                    <b-form-invalid-feedback
                                                        id="Tax-feedback"
                                                        >{{
                                                            validationContext
                                                                .errors[0]
                                                        }}</b-form-invalid-feedback
                                                    >
                                                </b-form-group>
                                            </validation-provider>
                                        </b-col> -->

                                        <!-- Discount Method -->
                                        <!-- <b-col lg="12" md="12" sm="12">
                                            <validation-provider
                                                name="Discount Method"
                                                :rules="{ required: true }"
                                            >
                                                <b-form-group
                                                    slot-scope="{
                                                        valid,
                                                        errors
                                                    }"
                                                    :label="
                                                        $t('Discount_Method')
                                                    "
                                                >
                                                    <select
                                                        v-model="
                                                            detail.discount_Method
                                                        "
                                                        :reduce="
                                                            label => label.value
                                                        "
                                                        :placeholder="
                                                            $t('Choose_Method')
                                                        "
                                                        :class="{
                                                            'is-invalid': !!errors.length
                                                        }"
                                                        :state="
                                                            errors[0]
                                                                ? false
                                                                : valid
                                                                ? true
                                                                : null
                                                        "
                                                        :options="[
                                                            {
                                                                label:
                                                                    'Percent %',
                                                                value: '1'
                                                            },
                                                            {
                                                                label: 'Fixed',
                                                                value: '2'
                                                            }
                                                        ]"
                                                    ></select>
                                                    <b-form-invalid-feedback>{{
                                                        errors[0]
                                                    }}</b-form-invalid-feedback>
                                                </b-form-group>
                                            </validation-provider>
                                        </b-col> -->

                                        <!-- Discount Rate -->
                                        <!-- <b-col lg="12" md="12" sm="12">
                                            <validation-provider
                                                name="Discount Rate"
                                                :rules="{
                                                    required: true,
                                                    regex: /^\d*\.?\d*$/
                                                }"
                                                v-slot="validationContext"
                                            >
                                                <b-form-group
                                                    :label="$t('Discount')"
                                                >
                                                    <b-form-input
                                                        label="Discount"
                                                        v-model="
                                                            detail.discount
                                                        "
                                                        :state="
                                                            getValidationState(
                                                                validationContext
                                                            )
                                                        "
                                                        aria-describedby="Discount-feedback"
                                                    ></b-form-input>
                                                    <b-form-invalid-feedback
                                                        id="Discount-feedback"
                                                        >{{
                                                            validationContext
                                                                .errors[0]
                                                        }}</b-form-invalid-feedback
                                                    >
                                                </b-form-group>
                                            </validation-provider>
                                        </b-col> -->

                                        <b-col md="12">
                                            <b-form-group>
                                                <b-button
                                                    variant="primary"
                                                    type="submit"
                                                    >{{
                                                        $t("submit")
                                                    }}</b-button
                                                >
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </b-form>
                            </b-modal>
                        </validation-observer>
                    </b-card>
                </b-col>

                <!-- Card right Of Products -->
                <b-col md="7">
                    <b-card class="list-grid">
                        <b-row>
                            <b-col md="6">
                                <button
                                    v-b-toggle.sidebar-category
                                    class="btn btn-outline-info mt-1 btn-block"
                                >
                                    <i class="i-Two-Windows"></i>
                                    {{ $t("ListofCategory") }}
                                </button>
                            </b-col>
                            <b-col md="6">
                                <button
                                    v-b-toggle.sidebar-brand
                                    class="btn btn-outline-info mt-1 btn-block"
                                >
                                    <i class="i-Library"></i>
                                    {{ $t("ListofBrand") }}
                                </button>
                            </b-col>
                            <b-col md="12 mt-2">
                                <div class="input-group">
                                    <input
                                        v-autofocus="focusSearchProduct"
                                        @keyup="getProducts()"
                                        v-model="SearchProduct"
                                        type="text"
                                        :placeholder="
                                            $t('Search_Product_by_Code_Name')
                                        "
                                        class="form-control"
                                        ref="SearchProducts"
                                        name="Search_Product"
                                    />
                                    <div class="input-group-append">
                                        <span class="input-group-text">
                                            <i class="i-Bar-Code"></i>
                                        </span>
                                    </div>
                                </div>
                            </b-col>

                            <div
                                class="col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2"
                            >
                                <div
                                    v-for="product in products"
                                    :key="product"
                                    class="card col-3"
                                >
                                    <span>
                                        <a
                                            title="Ver Imagen"
                                            v-b-tooltip.hover
                                            @click="
                                                showImages(product.imageList)
                                            "
                                        >
                                            <i
                                                class="i-Eye text-25 text-info"
                                                style="cursor: pointer;"
                                            ></i>
                                        </a>
                                    </span>
                                    <div
                                        @click="
                                            Check_Product_Exist(
                                                product,
                                                product.id
                                            )
                                        "
                                    >
                                        <img
                                            class="card-img-top"
                                            alt
                                            :src="
                                                '/images/products/' +
                                                    product.image
                                            "
                                        />
                                        <div class="card-body">
                                            <h5 class="card-title">
                                                {{ product.category }} -
                                                {{ product.name }}
                                            </h5>
                                            <p
                                                class="card-text text-muted text-small"
                                            >
                                                {{ product.code }}
                                            </p>
                                            <span
                                                class="badge w-15 w-sm-100 mb-2"
                                                style="color: #fff;background-color: #020202;"
                                                >{{
                                                    formatNumber(
                                                        product.Net_price,
                                                        2
                                                    )
                                                }}
                                                {{ currentUser.currency }}</span
                                            >
                                            <p
                                                class="m-0 text-muted text-small w-15 w-sm-100 d-none d-lg-block item-badges"
                                            >
                                                <span
                                                    class="badge"
                                                    style="color: #020202; background-color: #f5ba16;"
                                                    >{{ product.qte_sale }}
                                                    {{ product.unitSale }}</span
                                                >
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-row>

                        <b-row>
                            <b-col md="12" class="mt-4">
                                <b-pagination
                                    @change="Product_onPageChanged"
                                    :total-rows="product_totalRows"
                                    :per-page="product_perPage"
                                    v-model="product_currentPage"
                                    class="my-0 gull-pagination align-items-center"
                                    align="center"
                                    first-text
                                    last-text
                                >
                                    <p class="list-arrow m-0" slot="prev-text">
                                        <i class="i-Arrow-Left text-40"></i>
                                    </p>
                                    <p class="list-arrow m-0" slot="next-text">
                                        <i class="i-Arrow-Right text-40"></i>
                                    </p>
                                </b-pagination>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>

                <!-- Sidebar Brand -->
                <b-sidebar
                    id="sidebar-brand"
                    :title="$t('ListofBrand')"
                    bg-variant="white"
                    :backdrop-variant="variant"
                    right
                    shadow
                    backdrop
                    :visible="showSidebarBrands"
                    @shown="showSidebarBrand"
                    @hidden="hiddenSidebarBrand"
                    ref="sidebar_brand"
                >
                    <div class="px-3 py-2">
                        <b-row>
                            <b-col md="12 mt-2">
                                <div class="input-group">
                                    <input
                                        autofocus
                                        @keyup="Get_Brands()"
                                        v-model="search_brand"
                                        type="text"
                                        :placeholder="$t('Search_this_table')"
                                        class="form-control"
                                        ref="searchBrand"
                                        id="searchBrand"
                                    />
                                </div>
                            </b-col>
                        </b-row>

                        <b-row>
                            <div
                                class="col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2"
                            >
                                <div
                                    @click="getAllBrands()"
                                    :class="{ 'brand-Active': brand_id == '' }"
                                    class="card o-hidden bd-highlight m-1"
                                >
                                    <div class="list-thumb d-flex">
                                        <img
                                            alt
                                            :src="'/images/no-image.png'"
                                        />
                                    </div>
                                    <div class="flex-grow-1 d-bock">
                                        <div
                                            class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                                        >
                                            <div class="item-title">
                                                {{ $t("All_Brand") }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="card o-hidden bd-highlight m-1"
                                    v-for="brand in paginated_Brands"
                                    :key="brand.id"
                                    @click="Products_by_Brands(brand.id)"
                                    :class="{
                                        'brand-Active': brand.id === brand_id
                                    }"
                                >
                                    <img
                                        alt
                                        :src="'/images/brands/' + brand.image"
                                    />
                                    <div class="flex-grow-1 d-bock">
                                        <div
                                            class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                                        >
                                            <div class="item-title">
                                                {{ brand.name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-row>

                        <b-row>
                            <b-col
                                md="12"
                                class="d-flex flex-row flex-wrap mt-4"
                            >
                                <b-pagination
                                    @change="BrandonPageChanged"
                                    :total-rows="brand_totalRows"
                                    :per-page="brand_perPage"
                                    v-model="brand_currentPage"
                                    class="my-0 gull-pagination align-items-center"
                                    align="center"
                                    first-text
                                    last-text
                                >
                                    <p class="list-arrow m-0" slot="prev-text">
                                        <i class="i-Arrow-Left text-40"></i>
                                    </p>
                                    <p class="list-arrow m-0" slot="next-text">
                                        <i class="i-Arrow-Right text-40"></i>
                                    </p>
                                </b-pagination>
                            </b-col>
                        </b-row>
                    </div>
                </b-sidebar>

                <!-- visor imagenes -->

                <b-modal
                    hide-footer
                    size="md"
                    id="form_visor"
                    :title="Imagenes"
                >
                    <b-form>
                        <b-row>
                            <!-- visor -->
                            <b-col md="12" sm="12">
                                <div class="carousel_wrap">
                                    <b-carousel
                                        id="carousel-1"
                                        :interval="2000"
                                        controls
                                        indicators
                                        background="#ababab"
                                        style="text-shadow: 1px 1px 2px #333;"
                                        @sliding-start="onSlideStart"
                                        @sliding-end="onSlideEnd"
                                    >
                                        <b-carousel-slide
                                            v-for="(image, index) in this
                                                .imageList"
                                            :key="index"
                                            :img-src="
                                                '/images/products/' + image
                                            "
                                        ></b-carousel-slide>
                                    </b-carousel>
                                </div>
                            </b-col>
                        </b-row>
                    </b-form>
                </b-modal>

                <!-- Sidebar category -->
                <b-sidebar
                    id="sidebar-category"
                    :title="$t('ListofCategory')"
                    :visible="showSidebarCategorys"
                    backdrop
                    @shown="showSidebarCategory"
                    @hidden="hiddenSidebarCategory"
                    bg-variant="white"
                    right
                    shadow
                    ref="sidebar_category"
                >
                    <div class="px-3 py-2">
                        <b-row>
                            <b-col md="12 mt-2">
                                <div class="input-group">
                                    <input
                                        v-autofocus="focusSearchCategory"
                                        @keyup="Get_Categories()"
                                        v-model="search_category"
                                        type="text"
                                        :placeholder="$t('Search_this_table')"
                                        class="form-control"
                                        ref="searchCategory"
                                    />
                                </div>
                            </b-col>
                        </b-row>

                        <b-row>
                            <div
                                class="col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2"
                            >
                                <div
                                    @click="getAllCategory()"
                                    :class="{
                                        'brand-Active': category_id == ''
                                    }"
                                    class="card o-hidden bd-highlight m-1"
                                >
                                    <div class="list-thumb d-flex">
                                        <img
                                            alt
                                            :src="'/images/no-image.png'"
                                        />
                                    </div>
                                    <div class="flex-grow-1 d-bock">
                                        <div
                                            class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                                        >
                                            <div class="item-title">
                                                {{ $t("All_Category") }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="card o-hidden bd-highlight m-1"
                                    style="height:300px !important;"
                                    v-for="category in paginated_Category"
                                    :key="category.id"
                                    @click="Products_by_Category(category.id)"
                                    :class="{
                                        'brand-Active':
                                            category.id === category_id
                                    }"
                                >
                                    <img
                                        alt
                                        :src="
                                            '/images/categorys/' +
                                                category.image
                                        "
                                    />
                                    <div class="flex-grow-1 d-bock">
                                        <div
                                            class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                                        >
                                            <div class="item-title">
                                                {{ category.name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-row>

                        <b-row>
                            <b-col
                                md="12"
                                class="d-flex flex-row flex-wrap mt-4"
                            >
                                <b-pagination
                                    @change="Category_onPageChanged"
                                    :total-rows="category_totalRows"
                                    :per-page="category_perPage"
                                    v-model="category_currentPage"
                                    class="my-0 gull-pagination align-items-center"
                                    align="center"
                                    first-text
                                    last-text
                                >
                                    <p class="list-arrow m-0" slot="prev-text">
                                        <i class="i-Arrow-Left text-40"></i>
                                    </p>
                                    <p class="list-arrow m-0" slot="next-text">
                                        <i class="i-Arrow-Right text-40"></i>
                                    </p>
                                </b-pagination>
                            </b-col>
                        </b-row>
                    </div>
                </b-sidebar>

                <validation-observer ref="Create_Customer">
                    <b-modal
                        hide-footer
                        size="lg"
                        id="New_Customer"
                        :title="$t('Add')"
                    >
                        <b-form @submit.prevent="Submit_Customer">
                            <b-row>
                                <!-- Customer Name -->
                                <b-col md="6" sm="12">
                                    <validation-provider
                                        name="Name Customer"
                                        :rules="{ required: true }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group
                                            :label="$t('CustomerName')"
                                        >
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="name-feedback"
                                                label="name"
                                                v-model="client.name"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="name-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Customer Email -->
                                <b-col md="6" sm="12">
                                    <validation-provider
                                        name="Email customer"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('Email')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="Email-feedback"
                                                label="Email"
                                                v-model="client.email"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="Email-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Customer Phone -->
                                <b-col md="6" sm="12">
                                    <validation-provider
                                        name="Phone Customer"
                                        :rules="{ required: true }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('Phone')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="Phone-feedback"
                                                label="Phone"
                                                v-model="client.phone"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="Phone-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Customer Country -->
                                <b-col md="6" sm="12">
                                    <validation-provider
                                        name="Country customer"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('Country')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="Country-feedback"
                                                label="Country"
                                                v-model="client.country"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="Country-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Customer City -->
                                <b-col md="6" sm="12">
                                    <validation-provider
                                        name="City Customer"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('City')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="City-feedback"
                                                label="City"
                                                v-model="client.city"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="City-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Customer Adress -->
                                <b-col md="6" sm="12">
                                    <validation-provider
                                        name="Adress customer"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('Adress')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="Adress-feedback"
                                                label="Adress"
                                                v-model="client.adresse"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="Adress-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>
                                <!-- Customer NIT -->
                                <b-col
                                    md="6"
                                    sm="12"
                                    v-if="client.final_consumer == 0"
                                >
                                    <validation-provider
                                        name="NIT"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('NIT')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="NIT-feedback"
                                                label="NIT"
                                                v-model="client.NIT"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="NIT-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>
                                <!-- Customer DUI -->
                                <b-col
                                    md="6"
                                    sm="12"
                                    v-if="client.final_consumer == 0"
                                >
                                    <validation-provider
                                        name="DUI"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('DUI')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="DUI-feedback"
                                                label="DUI"
                                                v-model="client.DUI"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="DUI-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>
                                <!-- Customer NRC -->
                                <b-col
                                    md="6"
                                    sm="12"
                                    v-if="client.final_consumer == 0"
                                >
                                    <validation-provider
                                        name="NRC"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('NRC')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="NRC-feedback"
                                                label="NRC"
                                                v-model="client.NRC"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="NRC-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>
                                <!-- Customer Giro -->
                                <b-col
                                    md="6"
                                    sm="12"
                                    v-if="client.final_consumer == 0"
                                >
                                    <validation-provider
                                        name="giro"
                                        :rules="{ required: false }"
                                        v-slot="validationContext"
                                    >
                                        <b-form-group :label="$t('Giro')">
                                            <b-form-input
                                                :state="
                                                    getValidationState(
                                                        validationContext
                                                    )
                                                "
                                                aria-describedby="giro-feedback"
                                                label="giro"
                                                v-model="client.giro"
                                            ></b-form-input>
                                            <b-form-invalid-feedback
                                                id="giro-feedback"
                                                >{{
                                                    validationContext.errors[0]
                                                }}</b-form-invalid-feedback
                                            >
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>
                                <b-col md="6" sm="12" class="mt-2">
                                    <b-form-group
                                        :label="$t('TypeClient')"
                                        v-slot="{ ariaDescribedby }"
                                    >
                                        <b-form-radio
                                            v-model="client.final_consumer"
                                            :aria-describedby="ariaDescribedby"
                                            name="FinalConsumer"
                                            value="1"
                                            >{{
                                                $t("FinalConsumer")
                                            }}</b-form-radio
                                        >
                                        <b-form-radio
                                            v-model="client.final_consumer"
                                            :aria-describedby="ariaDescribedby"
                                            name="FiscalCredit"
                                            value="0"
                                            >{{
                                                $t("FiscalCredit")
                                            }}</b-form-radio
                                        >
                                    </b-form-group>
                                </b-col>
                                <b-col
                                    md="6"
                                    sm="12"
                                    class="mt-2"
                                    v-if="client.final_consumer == 0"
                                >
                                    <b-form-group
                                        :label="$t('BigContributor')"
                                        v-slot="{ ariaDescribedby }"
                                    >
                                        <b-form-radio
                                            v-model="client.big_consumer"
                                            :aria-describedby="ariaDescribedby"
                                            name="Si"
                                            value="1"
                                            >{{ $t("Yes") }}</b-form-radio
                                        >
                                        <b-form-radio
                                            v-model="client.big_consumer"
                                            :aria-describedby="ariaDescribedby"
                                            name="No"
                                            value="0"
                                            >No</b-form-radio
                                        >
                                    </b-form-group>
                                </b-col>

                                <b-col md="12" class="mt-3">
                                    <b-button variant="primary" type="submit">{{
                                        $t("submit")
                                    }}</b-button>
                                </b-col>
                            </b-row>
                        </b-form>
                    </b-modal>
                </validation-observer>
            </b-row>
        </div>
    </div>
</template>

<script>
import NProgress from "nprogress";
import { mapActions, mapGetters } from "vuex";
import FlagIcon from "vue-flag-icon";
import Util from "../../../utils";
import Vue from "vue";
import autofocus from "vue-autofocus-directive";
Vue.directive("autofocus", autofocus);

export default {
    components: {
        FlagIcon
    },
    metaInfo: {
        title: "POS"
    },
    data() {
        return {
            productsDiscounts: [],
            productsHaveDiscount: [],
            langs: ["es", "en"],
            imageList: [],
            cardElement: {},
            paymentProcessing: false,
            payment: {
                amount: "",
                Reglement: "",
                notes: "",
                cash: 0,
                change: 0
            },
            authorizedDiscount: false,
            authorizedPriceChange: false,
            authorizedCodeEntered: "",
            loading: false,
            isLoading: true,
            focusSearchProduct: true,
            showSidebarBrands: false,
            showSidebarCategorys: false,
            focusSearchBrand: true,
            focusSearchCategory: true,
            variant: "dark",
            BillingMethod: 0,
            GrandTotal: 0,
            GrandTotalText: "",
            total: 0,
            Ref: "",
            search: "",
            SearchProduct: "",
            search_category: "",
            search_brand: "",
            clients: [],
            warehouses: [],
            products: [],
            details: [],
            detail: {},
            categories: [],
            brands: [],
            product_currentPage: 1,
            paginated_Products: "",
            product_perPage: 8,
            product_totalRows: "",
            paginated_Brands: "",
            brand_currentPage: 1,
            brand_perPage: 3,
            paginated_Category: "",
            category_currentPage: 1,
            category_perPage: 3,
            barcodeFormat: "CODE128",
            invoice_pos: {
                sale: {
                    Ref: "",
                    client_name: "",
                    discount: "",
                    taxe: "",
                    date: "",
                    tax_rate: 0,
                    shipping: "",
                    GrandTotal: ""
                },
                details: [],
                setting: {
                    logo: "",
                    CompanyName: "",
                    CompanyAdress: "",
                    email: "",
                    CompanyPhone: ""
                }
            },
            sale: {
                warehouse_id: "",
                client_id: "",
                client_name: "",
                tax_rate: 0,
                shipping: 0,
                discount: 0,
                TaxNet: 0
            },
            client: {
                id: "",
                name: "",
                code: "",
                email: "",
                phone: "",
                country: "",
                city: "",
                adresse: "",
                NIT: "",
                DUI: "",
                NRC: "",
                giro: "",
                final_consumer: 1,
                big_consumer: 0
            },
            category_id: "",
            brand_id: "",
            product: {
                id: "",
                code: "",
                current: "",
                quantity: "",
                check_qty: "",
                discount: "",
                DiscountNet: "",
                discount_Method: "",
                name: "",
                unitSale: "",
                Net_price: "",
                Unit_price: "",
                Total_price: "",
                subtotal: "",
                product_id: "",
                detail_id: "",
                taxe: "",
                tax_percent: "",
                tax_method: "",
                product_variant_id: "",
                image: ""
            },
            sound: "/audio/Beep.wav",
            audio: new Audio("/audio/Beep.wav")
        };
    },

    computed: {
        ...mapGetters(["currentUser", "currentUserPermissions"]),

        brand_totalRows() {
            return this.brands.length;
        },
        category_totalRows() {
            return this.categories.length;
        }
    },

    mounted() {
        this.changeSidebarProperties();
        this.paginate_products(this.product_perPage, 0);
    },

    methods: {
        ...mapActions(["changeSidebarProperties", "changeThemeMode", "logout"]),
        ...mapGetters(["currentUser"]),
        logoutUser() {
            this.$store.dispatch("logout");
        },

        getResultValueClient(result) {
            return result.name;
        },
        SearchClient(result) {
            this.sale.client_id = result.id;
            this.sale.client_name = result.name;

            this.$refs.autocompletec.value = "";
        },
        //focus for search product
        Get_Categories() {
            // Start the progress bar.
            NProgress.start();
            NProgress.set(0.1);
            axios
                .get(
                    "categoriespos?page=" +
                        1 +
                        "&SortField=" +
                        "id" +
                        "&SortType=" +
                        "desc" +
                        "&search=" +
                        this.search_category +
                        "&limit=" +
                        10
                )
                .then(response => {
                    this.categories = response.data.categories;
                    this.paginate_Category(this.category_perPage, 0);

                    // Complete the animation of the progress bar.
                    NProgress.done();
                    this.isLoading = false;
                })
                .catch(response => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
        },

        //---------------------------------------- Get All brands-----------------\\
        Get_Brands() {
            // Start the progress bar.
            NProgress.start();
            NProgress.set(0.1);
            axios
                .get(
                    "brandspos?page=" +
                        1 +
                        "&SortField=" +
                        "id" +
                        "&SortType=" +
                        "desc" +
                        "&search=" +
                        this.search_brand +
                        "&limit=" +
                        10
                )
                .then(response => {
                    this.brands = response.data.brands;
                    this.paginate_Brands(this.brand_perPage, 0);

                    // Complete the animation of the progress bar.
                    NProgress.done();
                    this.isLoading = false;
                })
                .catch(response => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
        },

        // ----------------------- visor de imagenes ---------------------\\....................................................................

        showImages(imagen) {
            this.imageList = imagen;
            this.$bvModal.show("form_visor");
        },

        //---------------------- Event Select Payment Method ------------------------------\\

        Selected_PaymentMethod(value) {
            if (value == "credit card") {
                setTimeout(() => {
                    // this.loadStripe_payment();
                }, 500);
            }
        },

        SetLocal(locale) {
            this.$i18n.locale = locale;
            this.$store.dispatch("language/setLanguage", locale);
            Fire.$emit("ChangeLanguage");
        },

        handleFullScreen() {
            Util.toggleFullScreen();
        },
        logoutUser() {
            this.logout();
        },

        // ------------------------ Paginate Products --------------------\\
        Product_paginatePerPage() {
            this.paginate_products(this.product_perPage, 0);
        },

        paginate_products(pageSize, pageNumber) {
            let itemsToParse = this.products;
            this.paginated_Products = itemsToParse.slice(
                pageNumber * pageSize,
                (pageNumber + 1) * pageSize
            );
        },

        Product_onPageChanged(page) {
            this.paginate_products(this.product_perPage, page - 1);
            this.getProducts(page);
        },

        // ------------------------ Paginate Brands --------------------\\

        BrandpaginatePerPage() {
            this.paginate_Brands(this.brand_perPage, 0);
        },
        //------------------------ open and close modal category -----------------\\
        showSidebarBrand() {
            this.$refs.searchBrand.focus();
        },
        hiddenSidebarBrand() {
            this.$refs.SearchProducts.focus();
        },
        //------------------------ open and close modal category -----------------\\
        showSidebarCategory() {
            this.$refs.searchCategory.focus();
        },

        hiddenSidebarCategory() {
            this.$refs.SearchProducts.focus();
        },

        paginate_Brands(pageSize, pageNumber) {
            let itemsToParse = this.brands;
            this.paginated_Brands = itemsToParse.slice(
                pageNumber * pageSize,
                (pageNumber + 1) * pageSize
            );
        },

        BrandonPageChanged(page) {
            this.paginate_Brands(this.brand_perPage, page - 1);
        },

        // ------------------------ Paginate Categories --------------------\\

        Category_paginatePerPage() {
            this.paginate_Category(this.category_perPage, 0);
        },

        paginate_Category(pageSize, pageNumber) {
            let itemsToParse = this.categories;
            this.paginated_Category = itemsToParse.slice(
                pageNumber * pageSize,
                (pageNumber + 1) * pageSize
            );
        },

        Category_onPageChanged(page) {
            this.paginate_Category(this.category_perPage, page - 1);
        },

        //--- Submit Validate Create Sale
        Submit_Pos() {
            // Start the progress bar.
            NProgress.start();
            NProgress.set(0.1);
            this.$refs.create_pos.validate().then(success => {
                if (!success) {
                    NProgress.done();
                    if (
                        this.sale.client_id == "" ||
                        this.sale.client_id === null
                    ) {
                        this.makeToast(
                            "danger",
                            this.$t("Choose_Customer"),
                            this.$t("Failed")
                        );
                    } else if (
                        this.sale.warehouse_id == "" ||
                        this.sale.warehouse_id === null
                    ) {
                        this.makeToast(
                            "danger",
                            this.$t("Choose_Warehouse"),
                            this.$t("Failed")
                        );
                    } else {
                        this.makeToast(
                            "danger",
                            this.$t("Please_fill_the_form_correctly"),
                            this.$t("Failed")
                        );
                    }
                } else {
                    if (this.verifiedForm()) {
                        this.loading = true;
                        Fire.$emit("pay_now");
                    } else {
                        NProgress.done();
                    }
                }
            });
        },
        //---Submit Validation Update Detail
        changeProductDetail() {
            /*
            if (this.currentUser.authorizedCode != null && this.currentUser.authorizedCode != "null" && this.currentUser.authorizedCode != "")
                this.performUpdateDetail();
            else {
                this.authorizedCodeEntered = "";
                this.$bvModal.show("form_Auth_Discount");
            }
            */
            this.$bvModal.show("form_Auth_Discount");
        },
        performUpdateDetail() {
            this.$refs.Update_Detail.validate().then(success => {
                if (!success) return;
                else this.Update_Detail();
            });
        },

        //------------- Submit Validation Create & Edit Customer
        Submit_Customer() {
            // Start the progress bar.
            NProgress.start();
            NProgress.set(0.1);
            this.$refs.Create_Customer.validate().then(success => {
                if (!success) {
                    NProgress.done();
                    this.makeToast(
                        "danger",
                        this.$t("Please_fill_the_form_correctly"),
                        this.$t("Failed")
                    );
                } else {
                    this.Create_Client();
                }
            });
        },

        //---------------------------------------- Create new Customer -------------------------------\\
        Create_Client() {
            axios
                .post("clients/pos", {
                    name: this.client.name,
                    email: this.client.email,
                    phone: this.client.phone,
                    country: this.client.country,
                    city: this.client.city,
                    adresse: this.client.adresse,
                    NIT: this.client.NIT,
                    DUI: this.client.DUI,
                    NRC: this.client.NRC,
                    giro: this.client.giro,
                    final_consumer: this.client.final_consumer,
                    big_consumer: this.client.big_consumer
                })
                .then(response => {
                    NProgress.done();
                    this.makeToast(
                        "success",
                        this.$t("Create.TitleCustomer"),
                        this.$t("Success")
                    );
                    this.Get_Client_Without_Paginate();
                    this.sale.client_id = response.data.id_client;
                    this.$bvModal.hide("New_Customer");
                })
                .catch(error => {
                    NProgress.done();
                    this.makeToast(
                        "danger",
                        this.$t("InvalidData"),
                        this.$t("Failed")
                    );
                });
        },

        //------------------------------ New Model (create Customer) -------------------------------\\
        New_Client() {
            this.reset_Form_client();
            this.$bvModal.show("New_Customer");
        },

        //-------------------------------- reset Form -------------------------------\\
        reset_Form_client() {
            this.client = {
                id: "",
                name: "",
                email: "",
                phone: "",
                country: "",
                city: "",
                adresse: "",
                NIT: "",
                DUI: "",
                giro: "",
                NRC: "",
                final_consumer: 1,
                big_consumer: 0
            };
        },

        //------------------------------------ Get Clients Without Paginate -------------------------\\
        Get_Client_Without_Paginate() {
            axios
                .get("Get_Clients_Without_Paginate")
                .then(({ data }) => (this.clients = data));
            // console.log(this.clients);
        },

        //---Validate State Fields
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null;
        },

        //------ Toast
        makeToast(variant, msg, title) {
            this.$root.$bvToast.toast(msg, {
                title: title,
                variant: variant,
                solid: true
            });
        },

        //---------------------- Event Select Warehouse ------------------------------\\
        Selected_Warehouse(value) {
            this.Get_Products_By_Warehouse(value);
        },

        //------------------------------------ Get Products By Warehouse -------------------------\\

        Get_Products_By_Warehouse(id) {
            axios
                .get("Products/Warehouse/" + id + "?stock=" + 1)
                .then(({ data }) => (this.products = data));
        },

        //----------------------------------------- Add Detail of Sale -------------------------\\
        addProduct(code, productHasDiscount, productDiscount) {
            if (this.details.some(detail => detail.code === code)) {
                this.makeToast(
                    "warning",
                    this.$t("AlreadyAdd"),
                    this.$t("Warning")
                );
                // Complete the animation of the progress bar.
                NProgress.done();
            } else {
                if (this.details.length < 13) {
                    if (this.details.length > 0) {
                        this.order_detail_id();
                    } else if (this.details.length === 0) {
                        this.product.detail_id = 1;
                    }
                    this.details.push(this.product);
                    this.productsHaveDiscount.push(productHasDiscount);
                    this.productsDiscounts.push(productDiscount);
                } else {
                    this.makeToast(
                        "warning",
                        this.$t("max13"),
                        this.$t("Warning")
                    );
                    NProgress.done();
                }
            }
            this.$refs.SearchProducts.focus();
        },

        //-------------------------------- order detail id -------------------------\\
        order_detail_id() {
            this.product.detail_id = 0;
            var len = this.details.length;
            this.product.detail_id = this.details[len - 1].detail_id + 1;
        },

        //-------------------------------- Show Modal Product Detail -------------------------\\
        Modal_Update_Detail(detail) {
            this.detail = {};
            this.detail.name = detail.name;
            this.detail.detail_id = detail.detail_id;
            this.detail.Unit_price = detail.Unit_price;
            this.detail.tax_method = detail.tax_method;
            this.detail.discount_Method = detail.discount_Method;
            this.detail.discount = detail.discount;
            this.detail.quantity = detail.quantity;
            this.detail.tax_percent = detail.tax_percent;
            this.detail.taxe = detail.taxe;
            this.$bvModal.show("form_Update_Detail");
        },

        //-------------------------------- Update Product Detail -------------------------\\
        Update_Detail() {
            for (var i = 0; i < this.details.length; i++) {
                if (this.details[i].detail_id === this.detail.detail_id) {
                    this.details[i].Unit_price = this.detail.Unit_price;
                    // this.details[i].tax_percent = this.detail.tax_percent;
                    // this.details[i].quantity = this.detail.quantity;
                    // this.details[i].tax_method = this.detail.tax_method;
                    // this.details[i].discount_Method = this.detail.discount_Method;
                    // this.details[i].discount = this.detail.discount;

                    /*
                    if (this.details[i].discount_Method == "2") {
                        //Fixed
                        this.details[i].DiscountNet = this.detail.discount;
                    } else {
                        //Percentage %
                        this.details[i].DiscountNet = parseFloat(
                            (this.detail.Unit_price *
                                this.details[i].discount) /
                                100
                        );
                    }
                    */

                    if (this.details[i].tax_method == "1") {
                        //Exclusive
                        this.details[i].Net_price = parseFloat(
                            this.detail
                                .Unit_price /* - this.details[i].DiscountNet */
                        );

                        this.details[i].taxe = parseFloat(
                            (this.detail.tax_percent *
                                this.detail
                                    .Unit_price) /* - this.details[i].DiscountNet */ /
                                100
                        );

                        this.details[i].Total_price = parseFloat(
                            this.details[i].Net_price + this.details[i].taxe
                        );
                    } else {
                        //Inclusive
                        this.details[i].Net_price = parseFloat(
                            this.detail
                                .Unit_price /* - this.details[i].DiscountNet */ /
                                (this.detail.tax_percent / 100 + 1)
                        );

                        this.details[i].taxe = parseFloat(
                            this.detail.Unit_price -
                                this.details[i]
                                    .Net_price /* - this.details[i].DiscountNet */
                        );

                        this.details[i].Total_price = parseFloat(
                            this.details[i].Net_price + this.details[i].taxe
                        );
                    }

                    this.$forceUpdate();
                }
            }
            this.determineTotal();
            this.$bvModal.hide("form_Update_Detail");
        },

        //-- check Qty of  details order if Null or zero
        verifiedForm() {
            if (this.details.length <= 0) {
                this.makeToast(
                    "warning",
                    this.$t("AddProductToList"),
                    this.$t("Warning")
                );
                return false;
            } else {
                var count = 0;
                for (var i = 0; i < this.details.length; i++) {
                    if (
                        this.details[i].quantity == "" ||
                        this.details[i].quantity === 0
                    ) {
                        count += 1;
                    }
                }

                if (count > 0) {
                    this.makeToast(
                        "warning",
                        this.$t("AddQuantity"),
                        this.$t("Warning")
                    );

                    return false;
                } else {
                    return true;
                }
            }
        },

        showPreLoader() {
            setTimeout(function() {
                swal.fire({
                    icon: "success",
                    html: "<h4>Success!</h4>"
                });
            }, 1000);
        },
        //----------------------------------Create POS ------------------------------\\
        createPOS() {
            this.loading = true;
            NProgress.start();
            NProgress.set(0.1);
            axios
                .post("pos/CreatePOS", {
                    user_id: this.currentUser.id,
                    client_id: this.sale.client_id,
                    warehouse_id: this.sale.warehouse_id,
                    tax_rate: this.sale.tax_rate,
                    TaxNet: this.sale.TaxNet,
                    discount: this.sale.discount,
                    shipping: this.sale.shipping,
                    details: this.details,
                    GrandTotal: this.GrandTotal,
                    payment: this.payment,
                    productsHaveDiscount: this.productsHaveDiscount,
                    productsDiscounts: this.productsDiscounts,
                    posToken: this.authorizedCodeEntered
                })
                .then(response => {
                    if (response.data.success && response.data.message <= 0) {
                        // Complete the animation of the progress bar.
                        this.authorizedCodeEntered = "";
                        NProgress.done();
                        this.resetPos();
                        this.makeToast(
                            "success",
                            this.$t("sendtocheckin"),
                            this.$t("Success")
                        );
                        this.loading = false;
                    } else {
                        NProgress.done();
                        this.makeToast(
                            "danger",
                            response.data.slogan,
                            this.$t("Failed")
                        );
                        this.loading = false;
                    }
                })
                .catch(() => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                    this.makeToast(
                        "danger",
                        this.$t("InvalidData"),
                        this.$t("Failed")
                    );
                    this.loading = false;
                });

            // this.$refs.SearchProducts.focus();
        },

        //------------------------------Formetted Numbers -------------------------\\
        formatNumber(number, dec) {
            const value = (typeof number === "string"
                ? number
                : number.toString()
            ).split(".");
            if (dec <= 0) return value[0];
            let formated = value[1] || "";
            if (formated.length > dec)
                return `${value[0]}.${formated.substr(0, dec)}`;
            while (formated.length < dec) formated += "0";
            return `${value[0]}.${formated}`;
        },

        //---------------------------------Get Product Details ------------------------\\

        getProductDetails(product, product_id) {
            axios
                .get(
                    "products_details?id=" +
                        product_id +
                        "&warehouse_id=" +
                        this.sale.warehouse_id
                )
                .then(response => {
                    if (response.data.has_stock) {
                        this.product.discount = 0;
                        this.product.DiscountNet = 0;
                        this.product.discount_Method = "2";
                        this.product.product_id =
                            response.data.product_details.id;
                        this.product.name = response.data.product_details.name;
                        this.product.Net_price =
                            response.data.product_details.Net_price;
                        this.product.Total_price =
                            response.data.product_details.Total_price;
                        this.product.Unit_price =
                            response.data.product_details.Unit_price;
                        this.product.taxe =
                            response.data.product_details.tax_price;
                        this.product.tax_method =
                            response.data.product_details.tax_method;
                        this.product.tax_percent =
                            response.data.product_details.tax_percent;
                        this.product.unitSale =
                            response.data.product_details.unitSale;
                        this.product.product_variant_id =
                            product.product_variant_id;
                        this.product.code = product.code;
                        this.product.imageList = product.imageList;
                        this.addProduct(
                            product.code,
                            response.data.product_has_discount,
                            response.data.product_discount
                        );
                        this.determineTotal();
                    } else {
                        this.makeToast(
                            "warning",
                            this.$t("LowStock"),
                            this.$t("Warning")
                        );
                    }

                    // Complete the animation of the progress bar.
                    NProgress.done();
                });
        },

        //----------- Calcul Total
        determineTotal() {
            this.total = 0;
            for (var i = 0; i < this.details.length; i++) {
                var tax = this.details[i].taxe * this.details[i].quantity;
                this.details[i].subtotal = parseFloat(
                    this.details[i].quantity * this.details[i].Net_price + tax
                );

                this.total = parseFloat(this.total + this.details[i].subtotal);
            }
            const total_without_discount = parseFloat(
                this.total - this.sale.discount
            );
            this.sale.TaxNet = parseFloat(
                (total_without_discount * this.sale.tax_rate) / 100
            );
            this.GrandTotal = parseFloat(
                total_without_discount + this.sale.TaxNet + this.sale.shipping
            );
        },

        //-------Verified QTY
        Verified_Qty(detail, id) {
            for (var i = 0; i < this.details.length; i++) {
                if (this.details[i].detail_id === id) {
                    if (isNaN(detail.quantity)) {
                        this.details[i].quantity = detail.current;
                    }
                    if (detail.quantity > detail.current) {
                        this.makeToast(
                            "warning",
                            this.$t("LowStock"),
                            this.$t("Warning")
                        );
                        this.details[i].quantity = detail.current;
                    } else {
                        this.details[i].quantity = detail.quantity;
                    }
                }
            }
            this.$forceUpdate();
            this.determineTotal();
        },

        //----------------------------------- Increment QTY ------------------------------\\
        increment(detail, id) {
            for (var i = 0; i < this.details.length; i++) {
                if (this.details[i].detail_id == id) {
                    if (
                        this.details[i].quantity + 1 >
                        this.details[i].current
                    ) {
                        this.makeToast(
                            "warning",
                            this.$t("LowStock"),
                            this.$t("Warning")
                        );
                    } else {
                        this.details[i].quantity++;
                    }
                }
            }
            this.determineTotal();
            this.$forceUpdate();
            this.$refs.SearchProducts.focus();
        },

        //----------------------------------- decrement QTY ------------------------------\\
        decrement(detail, id) {
            for (var i = 0; i < this.details.length; i++) {
                if (this.details[i].detail_id == id) {
                    if (
                        detail.quantity - 1 > detail.current ||
                        detail.quantity - 1 < 1
                    ) {
                        this.makeToast(
                            "warning",
                            this.$t("LowStock"),
                            this.$t("Warning")
                        );
                    } else {
                        this.details[i].quantity--;
                    }
                }
            }
            this.determineTotal();
            this.$forceUpdate();
        },

        //---------- keyup OrderTax

        keyup_OrderTax() {
            if (isNaN(this.sale.tax_rate)) {
                this.sale.tax_rate = 0;
            } else {
                this.determineTotal();
            }
        },

        //---------- keyup Discount

        keyup_discount() {
            if (isNaN(this.sale.discount)) this.sale.discount = 0;
            else this.determineTotal();
        },
        keyup_price_product(detail, id) {
            for (var i = 0; i < this.details.length; i++) {
                if (this.details[i].detail_id == id)
                    this.details[i].Net_price = detail.Net_price;
            }
            this.determineTotal();
            this.$forceUpdate();
        },

        //---------- keyup Shipping

        keyup_shipping() {
            if (isNaN(this.sale.shipping)) {
                this.sale.shipping = 0;
            } else {
                this.determineTotal();
            }
        },
        keyup_cash() {
            if (isNaN(this.payment.cash)) {
                this.payment.cash = 0;
            }
        },
        keyup_change() {
            this.payment.change = this.formatNumber(
                this.payment.cash - this.payment.amount,
                2
            );
            this.$forceUpdate();
            // if (isNaN(this.payment.cash)) {
            //   this.payment.change = 0;
            // }else{
            //   this.payment.change = payment.amount-payment.cash;
            // }
        },

        //-----------------------------------Delete Detail Product ------------------------------\\
        delete_product_detail(id) {
            for (var i = 0; i < this.details.length; i++) {
                if (id === this.details[i].detail_id) {
                    this.details.splice(i, 1);
                    this.productsHaveDiscount.splice(i, 1);
                    this.productsDiscounts.splice(i, 1);
                    this.determineTotal();
                }
            }
            this.$refs.SearchProducts.focus();
        },

        //----------Reset Pos
        resetPos() {
            this.details = [];
            this.product = {};
            this.productsHaveDiscount = [];
            this.productsDiscounts = [];
            this.sale.client_id = "";
            this.sale.tax_rate = 0;
            this.sale.TaxNet = 0;
            this.sale.shipping = 0;
            this.sale.discount = 0;
            this.sale.warehouse_id = this.currentUser.warehouse_id;
            this.GrandTotal = 0;
            this.total = 0;
            this.category_id = "";
            this.brand_id = "";
            this.search = "";
            this.getProducts(1);
            this.$refs.SearchProducts.focus();
        },

        //---------------------------------- Check if Product Exist in Order List ---------------------\\

        Check_Product_Exist(product, id) {
            this.audio.play();
            // Start the progress bar.
            NProgress.start();
            NProgress.set(0.1);
            this.product = {};
            this.product.current = product.qte_sale;
            if (product.qte_sale < 1) {
                this.product.quantity = product.qte_sale;
            } else {
                this.product.quantity = 1;
            }
            this.getProductDetails(product, id);
            NProgress.done();
        },

        //--- Get Products by Category
        Products_by_Category(id) {
            this.category_id = id;
            this.getProducts(1);
            this.$refs.sidebar_category.hide();
        },

        //--- Get Products by Brand
        Products_by_Brands(id) {
            this.brand_id = id;
            this.getProducts(1);
            this.$refs.sidebar_brand.hide();
        },

        //--- Get All Category
        getAllCategory() {
            this.category_id = "";
            this.getProducts(1);
            this.$refs.sidebar_category.hide();
        },

        //--- Get All Brands
        getAllBrands() {
            this.brand_id = "";
            this.getProducts(1);
            this.$refs.sidebar_brand.hide();
        },

        //------------------------- get Result Value Search Product

        getResultValue(result) {
            return result.code + " " + "(" + result.name + ")";
        },

        searchProduct(result) {
            this.product = {};
            if (
                this.details.length > 0 &&
                this.details.some(detail => detail.code === result.code)
            ) {
                this.makeToast(
                    "warning",
                    this.$t("AlreadyAdd"),
                    this.$t("Warning")
                );
            } else {
                this.product.code = result.code;
                this.product.stock = result.qte_sale;
                if (result.qte_sale < 1) {
                    this.product.quantity = result.qte_sale;
                } else {
                    this.product.quantity = 1;
                }
                this.product.product_variant_id = result.product_variant_id;
                this.getProductDetails(result, result.id);
            }
            this.$refs.autocomplete.value = "";
        },

        //------------------------------- Get Products with Filters ------------------------------\\
        getProducts(page = 1) {
            // Start the progress bar.
            NProgress.start();
            NProgress.set(0.1);
            axios
                .get(
                    "GetProductsByParametre?page=" +
                        page +
                        "&category_id=" +
                        this.category_id +
                        "&brand_id=" +
                        this.brand_id +
                        "&warehouse_id=" +
                        this.sale.warehouse_id +
                        "&search=" +
                        this.SearchProduct +
                        "&stock=" +
                        1
                )
                .then(response => {
                    // this.products = [];
                    this.products = response.data.products;
                    this.product_totalRows = response.data.totalRows;
                    this.Product_paginatePerPage();

                    // Complete the animation of the progress bar.
                    NProgress.done();
                })
                .catch(response => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                });
        },

        //---------------------------------------Get Elements ------------------------------\\
        getElementsPos() {
            axios
                .get("pos/GetElementPos")
                .then(response => {
                    // console.log(this.currentUser);
                    this.clients = response.data.clients;
                    this.warehouses = response.data.warehouses;
                    this.categories = response.data.categories;
                    this.brands = response.data.brands;
                    this.sale.warehouse_id = this.currentUser.warehouse_id;
                    this.sale.client_id = response.data.defaultClient;
                    this.getProducts();
                    this.paginate_Brands(this.brand_perPage, 0);
                    this.paginate_Category(this.category_perPage, 0);
                    this.stripe_key = response.data.stripe_key;
                    this.isLoading = false;
                    this.$refs.SearchProducts.focus();
                })
                .catch(() => {
                    this.isLoading = false;
                });
        },
        //------------- Authorize Price Change -------------\\

        submitAuthPriceChange() {
            NProgress.start();
            NProgress.set(0.1);
            /*
                1. Call new modal authorize
                2. if auth is true perform Update Detail else return;
            */

            axios
                .post("pos/authPriceChange", {
                    authorizedCode: this.authorizedCodeEntered,
                    user_id: this.currentUser.id
                })
                .then(response => {
                    this.authorizedPriceChange = response.data.authorized;
                    console.log(this.authorizedPriceChange);
                    if (this.authorizedPriceChange > 0) {
                        this.performUpdateDetail();
                        this.$bvModal.hide("form_Auth_Discount");
                    } else {
                        alert(
                            "¡No es posible conceder la autorización para el cambio de precio!"
                        );
                    }

                    // Complete the animation of the progress bar.
                    NProgress.done();
                    this.isLoading = false;
                })
                .catch(() => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
        },

        //-----------Authorize Discount--------------//
        submitAuthDiscount() {
            NProgress.start();
            NProgress.set(0.1);
            /*
                1. Call new modal authorize
                2. if auth is true perform Update Detail else return;
            */

            axios
                .post("pos/authDiscount", {
                    authorizedCode: this.authorizedCodeEntered
                })
                .then(response => {
                    this.authorizedDiscount = response.data.authorized;
                    console.log(this.authorizedDiscount);
                    if (this.authorizedDiscount > 0) {
                        this.performUpdateDetail();
                        this.authorizedCodeEntered = "";
                        this.$bvModal.hide("form_Auth_Discount");
                    } else {
                        alert(
                            "No es posible conceder la autorización de descuento"
                        );
                    }

                    // Complete the animation of the progress bar.
                    NProgress.done();
                    this.isLoading = false;
                })
                .catch(response => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                });
        }
    },

    //-------------------- Created Function -----\\

    created() {
        this.getElementsPos();
        Fire.$on("pay_now", () => {
            setTimeout(() => {
                this.payment.amount = this.formatNumber(this.GrandTotal, 2);
                this.payment.cash = this.formatNumber(this.GrandTotal, 2);
                this.payment.Reglement = "Cash";
                // this.$bvModal.show("Add_Payment");
                this.createPOS();
                this.loading = false;
                // Complete the animation of the progress bar.
                NProgress.done();
            }, 500);
        });
        // this.$refs.SearchProducts.focus();
    }
};
</script>
