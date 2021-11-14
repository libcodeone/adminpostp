<template>
  <div class="pos_page">
    <div class="container-fluid p-0 app-admin-wrap layout-sidebar-large clearfix" id="pos">
      <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>
      <b-row v-if="!isLoading">
        <!-- Card Left Panel Details Sale-->
        <b-col md="5">
          <b-card no-body class="card-order">
            <div class="main-header">
              <div class="logo">
                <router-link to="/app/dashboard">
                  <img :src="'/images/'+currentUser.logo" alt width="60" height="60">
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
                      :settings="{ suppressScrollX: true, wheelPropagation: false }"
                      ref="myData"
                      class="dropdown-menu-left rtl-ps-none notification-dropdown ps scroll"
                    >
                      <div class="menu-icon-grid">
                        <a @click="SetLocal('es')">
                          <i title="es" class="flag-icon flag-icon-squared flag-icon-es"></i>
                          <span class="title-lang">Español</span>
                        </a>
                        <a @click="SetLocal('en')">
                          <i title="en" class="flag-icon flag-icon-squared flag-icon-gb"></i> English
                        </a>
                      </div>
                    </vue-perfect-scrollbar>
                  </b-dropdown>
                </div>

                <!-- User avatar dropdown 
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
                        :src="'/images/avatar/'+currentUser.avatar"
                        id="userDropdown"
                        alt
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                    </template>

                    <div class="dropdown-menu-left" aria-labelledby="userDropdown">
                      <div class="dropdown-header">
                        <i class="i-Lock-User mr-1"></i>
                        <span>{{currentUser.username}}</span>
                      </div>
                      <router-link to="/app/profile" class="dropdown-item">{{$t('profil')}}</router-link>
                      <router-link
                        v-if="currentUserPermissions && currentUserPermissions.includes('setting_system')"
                        to="/app/settings/System_settings"
                        class="dropdown-item"
                      >{{$t('Settings')}}</router-link>
                      <a class="dropdown-item" href="#" @click.prevent="logoutUser">{{$t('logout')}}</a>
                    </div>
                  </b-dropdown>
                </div>-->
              </div>
            </div>
            
            <validation-observer ref="create_pos">
              <b-form @submit.prevent="Submit_Pos">
                <b-card-body>
                  <b-row>
                    <!-- Customer -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider name="Customer" :rules="{ required: true}">
                        <b-input-group slot-scope="{ valid, errors }" class="input-customer">
                          <v-select
                            :class="{'is-invalid': !!errors.length}"
                            :state="errors[0] ? false : (valid ? true : null)"
                            v-model="sale.client_id"
                            :reduce="label => label.value"
                            :placeholder="$t('Choose_Customer')"
                            class="w-100"
                            :options="clients.map(clients => ({label: clients.name, value: clients.id}))"
                          />
                          <b-input-group-append>
                            <b-button variant="primary" @click="New_Client()">
                              <span>
                                <i class="i-Add-User"></i>
                              </span>
                            </b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </validation-provider>
                    </b-col>

                    <!-- warehouse -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider name="warehouse" :rules="{ required: true}">
                        <b-form-group slot-scope="{ valid, errors }" class="mt-2">
                          <v-select
                            :class="{'is-invalid': !!errors.length}"
                            :state="errors[0] ? false : (valid ? true : null)"
                            :disabled="details.length > 0"
                            @input="Selected_Warehouse"
                            v-model="sale.warehouse_id"
                            :reduce="label => label.value"
                            :placeholder="$t('Choose_Warehouse')"
                            :options="warehouses.map(warehouses => ({label: warehouses.name, value: warehouses.id}))"
                          />
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <!-- Details Product  -->
                    <b-col md="12" class="mt-2">
                      <div class="pos-detail">
                        <div class="table-responsive">
                          <table class="table table-striped">
                            <thead>
                              <tr>
                                <th scope="col">{{$t('ProductName')}}</th>
                                <th scope="col">{{$t('Price')}}</th>
                                <th scope="col" class="text-center">{{$t('Qty')}}</th>
                                <th
                                  scope="col"
                                  class="text-center"
                                >{{$t('SubTotal')}}</th>
                                <th scope="col" class="text-center">
                                  <i class="fa fa-trash"></i>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-if="details.length <= 0">
                                <td colspan="5">{{$t('NodataAvailable')}}</td>
                              </tr>
                              <tr v-for="(detail, index) in details" :key="index">
                                <td>
                                  <span>{{detail.code}}</span>
                                  <br>
                                  <span class="badge badge-success">{{detail.name}}</span>
                                  <i @click="Modal_Update_Detail(detail)" class="i-Edit"></i>
                                </td>
                                <td>{{formatNumber(detail.Total_price, 2)}} {{currentUser.currency}}</td>
                                <td>
                                  <div class="quantity">
                                    <b-input-group>
                                      <b-input-group-prepend>
                                        <span
                                          class="btn btn-primary btn-sm"
                                          @click="decrement(detail ,detail.detail_id)"
                                        >-</span>
                                      </b-input-group-prepend>

                                      <input
                                        class="form-control"
                                        @keyup="Verified_Qty(detail,detail.detail_id)"
                                        v-model.number="detail.quantity"
                                      >

                                      <b-input-group-append>
                                        <span
                                          class="btn btn-primary btn-sm"
                                          @click="increment(detail ,detail.detail_id)"
                                        >+</span>
                                      </b-input-group-append>
                                    </b-input-group>
                                  </div>
                                </td>
                                <td
                                  class="text-center"
                                >{{formatNumber((detail.subtotal),2)}} {{currentUser.currency}}</td>
                                <td>
                                  <a
                                    @click="delete_Product_Detail(detail.detail_id)"
                                    title="Delete"
                                  >
                                    <i class="i-Close-Window text-25 text-danger"></i>
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
                        <div class="grandtotal">
                          <span>{{$t("Total")}} : {{formatNumber(GrandTotal , 2)}} {{currentUser.currency}}</span>
                        </div>
                      </b-col>

                      <!-- Order Tax  -->
                      <b-col lg="4" md="4" sm="12">
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
                      </b-col>

                      <!-- Discount -->
                      <b-col lg="4" md="4" sm="12">
                        <validation-provider
                          name="Discount"
                          :rules="{ regex: /^\d*\.?\d*$/}"
                          v-slot="validationContext"
                        >
                          <b-form-group :label="$t('Discount')" append="%">
                            <b-input-group append="$">
                              <b-form-input
                                :state="getValidationState(validationContext)"
                                aria-describedby="Discount-feedback"
                                label="Discount"
                                v-model.number="sale.discount"
                                @keyup="keyup_Discount()"
                              ></b-form-input>
                            </b-input-group>
                            <b-form-invalid-feedback
                              id="Discount-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>

                      <!-- Shipping  -->
                      <b-col lg="4" md="4" sm="12">
                        <validation-provider
                          name="Shipping"
                          :rules="{ regex: /^\d*\.?\d*$/}"
                          v-slot="validationContext"
                        >
                          <b-form-group :label="$t('Shipping')">
                            <b-input-group append="$">
                              <b-form-input
                                :state="getValidationState(validationContext)"
                                aria-describedby="Shipping-feedback"
                                label="Shipping"
                                v-model.number="sale.shipping"
                                @keyup="keyup_Shipping()"
                              ></b-form-input>
                            </b-input-group>

                            <b-form-invalid-feedback
                              id="Shipping-feedback"
                            >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </b-col>

                      <b-col md="6" sm="12">
                        <b-button
                          @click="Reset_Pos()"
                          variant="danger ripple btn-rounded btn-block mt-1"
                        >
                          <i class="i-Power-2"></i>
                          {{ $t("Reset") }}
                        </b-button>
                      </b-col>
                      <b-col md="6" sm="12">
                        <b-button type="submit" variant="primary ripple mt-1 btn-rounded btn-block">
                          <i class="i-Checkout"></i>
                          {{ $t("sendtobox") }}
                        </b-button>
                      </b-col>
                    </b-row>
                  </div>
                </b-card-body>
              </b-form>
            </validation-observer>

            <!-- Update Detail Product -->
            <validation-observer ref="Update_Detail">
              <b-modal hide-footer size="md" id="form_Update_Detail" :title="detail.name">
                <b-form @submit.prevent="submit_Update_Detail">
                  <b-row>
                    <!-- Unit Price -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider
                        name="Product Price"
                        :rules="{ required: true , regex: /^\d*\.?\d*$/}"
                        v-slot="validationContext"
                      >
                        <b-form-group :label="$t('ProductPrice')" id="Price-input">
                          <b-form-input
                            label="Product Price"
                            v-model="detail.Unit_price"
                            :state="getValidationState(validationContext)"
                            aria-describedby="Price-feedback"
                          ></b-form-input>
                          <b-form-invalid-feedback
                            id="Price-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <!-- Tax Method -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider name="Tax Method" :rules="{ required: true}">
                        <b-form-group slot-scope="{ valid, errors }" :label="$t('TaxMethod')">
                          <v-select
                            :class="{'is-invalid': !!errors.length}"
                            :state="errors[0] ? false : (valid ? true : null)"
                            v-model="detail.tax_method"
                            :reduce="label => label.value"
                            :placeholder="$t('Choose_Method')"
                            :options="
                           [
                            {label: 'Exclusive', value: '1'},
                            {label: 'Inclusive', value: '2'}
                           ]"
                          ></v-select>
                          <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <!-- Tax -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider
                        name="Tax"
                        :rules="{ required: true , regex: /^\d*\.?\d*$/}"
                        v-slot="validationContext"
                      >
                        <b-form-group :label="$t('Tax')">
                          <b-input-group append="%">
                            <b-form-input
                              label="Tax"
                              v-model="detail.tax_percent"
                              :state="getValidationState(validationContext)"
                              aria-describedby="Tax-feedback"
                            ></b-form-input>
                          </b-input-group>
                          <b-form-invalid-feedback
                            id="Tax-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <!-- Discount Method -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider name="Discount Method" :rules="{ required: true}">
                        <b-form-group slot-scope="{ valid, errors }" :label="$t('Discount_Method')">
                          <v-select
                            v-model="detail.discount_Method"
                            :reduce="label => label.value"
                            :placeholder="$t('Choose_Method')"
                            :class="{'is-invalid': !!errors.length}"
                            :state="errors[0] ? false : (valid ? true : null)"
                            :options="
                              [
                                {label: 'Percent %', value: '1'},
                                {label: 'Fixed', value: '2'}
                              ]"
                          ></v-select>
                          <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <!-- Discount Rate -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider
                        name="Discount Rate"
                        :rules="{ required: true , regex: /^\d*\.?\d*$/}"
                        v-slot="validationContext"
                      >
                        <b-form-group :label="$t('Discount')">
                          <b-form-input
                            label="Discount"
                            v-model="detail.discount"
                            :state="getValidationState(validationContext)"
                            aria-describedby="Discount-feedback"
                          ></b-form-input>
                          <b-form-invalid-feedback
                            id="Discount-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                    <b-col md="12">
                      <b-form-group>
                        <b-button variant="primary" type="submit">{{$t('submit')}}</b-button>
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
                <button v-b-toggle.sidebar-category class="btn btn-outline-info mt-1 btn-block">
                  <i class="i-Two-Windows"></i>
                  {{$t('ListofCategory')}}
                </button>
              </b-col>
              <b-col md="6">
                <button v-b-toggle.sidebar-brand class="btn btn-outline-info mt-1 btn-block">
                  <i class="i-Library"></i>
                  {{$t('ListofBrand')}}
                </button>
              </b-col>
              <b-col md="12 mt-2">
                <div class="input-group">
                  <input
                    @keyup="getProducts()"
                    v-model="SearchProduct"
                    type="text"
                    :placeholder="$t('Search_Product_by_Code_Name')"
                    class="form-control"
                  >
                  <div class="input-group-append">
                    <span class="input-group-text">
                      <i class="i-Bar-Code"></i>
                    </span>
                  </div>
                </div>
              </b-col>

              <div class="col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2">
                <div
                  @click="Check_Product_Exist(product , product.id)"
                  v-for="product in products"
                  class="card bd-highlight m-1"
                >
                  <div class="list-thumb d-flex">
                    <img alt :src="'/images/products/'+product.image">
                  </div>
                  <div class="flex-grow-1 d-bock">
                    <div
                      class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                    >
                      <div class="w-40 w-sm-100 item-title">{{product.category}} -  {{product.name}}</div>
                      <p class="text-muted text-small w-15 w-sm-100 mb-2">{{product.code}}</p>

                      <span
                        class="badge badge-primary w-15 w-sm-100 mb-2"
                      >{{formatNumber(product.Net_price , 2)}} {{currentUser.currency}}</span>
                      <p
                        class="m-0 text-muted text-small w-15 w-sm-100 d-none d-lg-block item-badges"
                      >
                        <span
                          class="badge badge-info"
                        >{{formatNumber(product.qte_sale , 2)}} {{product.unitSale}}</span>
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
        <b-sidebar id="sidebar-brand" :title="$t('ListofBrand')" bg-variant="white" right shadow>
          <div class="px-3 py-2">
            <b-row>
              <b-col md="12 mt-2">
                <div class="input-group">
                  <input
                    @keyup="Get_Brands()"
                    v-model="search_brand"
                    type="text"
                    :placeholder="$t('Search_this_table')"
                    class="form-control"
                  >
                </div>
              </b-col>
            </b-row>
            <b-row>
              <div class="col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2">
                <div
                  @click="GetAllBrands()"
                  :class="{ 'brand-Active' : brand_id == ''}"
                  class="card o-hidden bd-highlight m-1"
                >
                  <div class="list-thumb d-flex">
                    <img alt :src="'/images/no-image.png'">
                  </div>
                  <div class="flex-grow-1 d-bock">
                    <div
                      class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                    >
                      <div class="item-title">{{$t('All_Brand')}}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="card o-hidden bd-highlight m-1"
                  v-for="brand in paginated_Brands"
                  :key="brand.id"
                  @click="Products_by_Brands(brand.id)"
                  :class="{ 'brand-Active' : brand.id === brand_id}"
                >
                  <img alt :src="'/images/brands/'+brand.image">
                  <div class="flex-grow-1 d-bock">
                    <div
                      class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                    >
                      <div class="item-title">{{brand.name}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </b-row>

            <b-row>
              <b-col md="12" class="mt-4">
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

        <!-- Sidebar category -->
        <b-sidebar
          id="sidebar-category"
          :title="$t('ListofCategory')"
          bg-variant="white"
          right
          shadow
        >
          <div class="px-3 py-2">
            <b-row>
              <b-col md="12 mt-2">
                <div class="input-group">
                  <input
                    @keyup="Get_Categories()"
                    v-model="search_category"
                    type="text"
                    :placeholder="$t('Search_this_table')"
                    class="form-control"
                  >
                </div>
              </b-col>
            </b-row>
            <b-row>
              <div class="col-md-12 d-flex flex-row flex-wrap bd-highlight list-item mt-2">
                <div
                  @click="getAllCategory()"
                  :class="{ 'brand-Active' : category_id == ''}"
                  class="card o-hidden bd-highlight m-1"
                >
                  <div class="list-thumb d-flex">
                    <img alt :src="'/images/no-image.png'">
                  </div>
                  <div class="flex-grow-1 d-bock">
                    <div
                      class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                    >
                      <div class="item-title">{{$t('All_Category')}}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="card o-hidden bd-highlight m-1"
                  v-for="category in paginated_Category"
                  :key="category.id"
                  @click="Products_by_Category(category.id)"
                  :class="{ 'brand-Active' : category.id === category_id}"
                >
                  <img alt :src="'/images/no-image.png'">
                  <div class="flex-grow-1 d-bock">
                    <div
                      class="card-body align-self-center d-flex flex-column justify-content-between align-items-lg-center"
                    >
                      <div class="item-title">{{category.name}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </b-row>

            <b-row>
              <b-col md="12" class="mt-4">
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
          <b-modal hide-footer size="lg" id="New_Customer" :title="$t('Add')">
            <b-form @submit.prevent="Submit_Customer">
              <b-row>
                <!-- Customer Name -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="Name Customer"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('CustomerName')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="name-feedback"
                        label="name"
                        v-model="client.name"
                      ></b-form-input>
                      <b-form-invalid-feedback id="name-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <!-- Customer Email -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="Email customer"
                    :rules="{ required: false}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('Email')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="Email-feedback"
                        label="Email"
                        v-model="client.email"
                      ></b-form-input>
                      <b-form-invalid-feedback id="Email-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <!-- Customer Phone -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="Phone Customer"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('Phone')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="Phone-feedback"
                        label="Phone"
                        v-model="client.phone"
                      ></b-form-input>
                      <b-form-invalid-feedback id="Phone-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <!-- Customer Country -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="Country customer"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('Country')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="Country-feedback"
                        label="Country"
                        v-model="client.country"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        id="Country-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <!-- Customer City -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="City Customer"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('City')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="City-feedback"
                        label="City"
                        v-model="client.city"
                      ></b-form-input>
                      <b-form-invalid-feedback id="City-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <!-- Customer Adress -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="Adress customer"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('Adress')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="Adress-feedback"
                        label="Adress"
                        v-model="client.adresse"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        id="Adress-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <!-- Customer NIT -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="NIT"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('NIT')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="NIT-feedback"
                        label="NIT"
                        v-model="client.NIT"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        id="NIT-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <!-- Customer NRC -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="NRC"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('NRC')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="NRC-feedback"
                        label="NRC"
                        v-model="client.NRC"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        id="NRC-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>
                <!-- Customer Giro -->
                <b-col md="6" sm="12">
                  <validation-provider
                    name="giro"
                    :rules="{ required: true}"
                    v-slot="validationContext"
                  >
                    <b-form-group :label="$t('Giro')">
                      <b-form-input
                        :state="getValidationState(validationContext)"
                        aria-describedby="giro-feedback"
                        label="giro"
                        v-model="client.giro"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        id="giro-feedback"
                      >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </b-col>

                <b-col md="12" class="mt-3">
                  <b-button variant="primary" type="submit">{{$t('submit')}}</b-button>
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


export default {
  components: {
    FlagIcon
  },
  metaInfo: {
    title: "POS"
  },
  data() {
    return {
      langs: [
        "es",
        "en",
      ],
      
      cardElement: {},
      paymentProcessing: false,
      payment: {
        amount: "",
        Reglement: "",
        notes: "",
        cash: 0,
        change: 0
      },
      isLoading: true,
      BillingMethod:0,
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
          date:"",
          tax_rate: 13,
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
        tax_rate: 13,
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
        NRC: "",
        giro: ""
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
        product_variant_id: ""
      },
      sound: "/audio/Beep.wav",
      audio: new Audio("/audio/Beep.wav"),
    };
  },

  computed: {
    ...mapGetters(["currentUser"]),
    
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


    
    Get_Categories() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios
        .get(
          "categories?page=" +
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


          // Complete the animation of theprogress bar.
          NProgress.done();
          this.isLoading = false;
        })
        .catch(response => {
          // Complete the animation of theprogress bar.
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
           "brands?page=" +
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

          // Complete the animation of theprogress bar.
          NProgress.done();
          this.isLoading = false;
        })
        .catch(response => {
          // Complete the animation of theprogress bar.
          NProgress.done();
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
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
          if (this.sale.client_id == "" || this.sale.client_id === null) {
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
            Fire.$emit("pay_now");
          } else {
            NProgress.done();
          }
        }
      });
    },
    //---Submit Validation Update Detail
    submit_Update_Detail() {
      this.$refs.Update_Detail.validate().then(success => {
        if (!success) {
          return;
        } else {
          this.Update_Detail();
        }
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
        .post("clients", {
          name: this.client.name,
          email: this.client.email,
          phone: this.client.phone,
          country: this.client.country,
          city: this.client.city,
          adresse: this.client.adresse,
          NIT: this.client.NIT,
          NRC: this.client.NRC,
          giro: this.client.giro
        })
        .then(response => {
          NProgress.done();
          this.makeToast(
            "success",
            this.$t("Create.TitleCustomer"),
            this.$t("Success")
          );
          this.Get_Client_Without_Paginate();
          this.$bvModal.hide("New_Customer");
        })
        .catch(error => {
          NProgress.done();
          this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
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
        giro: "",
        NRC: ""
      };
    },

    //------------------------------------ Get Clients Without Paginate -------------------------\\
    Get_Client_Without_Paginate() {
      axios
        .get("Get_Clients_Without_Paginate")
        .then(({ data }) => (this.clients = data));
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
    add_product(code) {
       if (this.details.some(detail => detail.code ===code)){
          this.makeToast("warning", this.$t("AlreadyAdd"), this.$t("Warning"));
          // Complete the animation of theprogress bar.
          NProgress.done();
        }else{
          if (this.details.length > 0) {
            this.order_detail_id();
          } else if (this.details.length === 0) {
            this.product.detail_id = 1;
          }
          this.details.push(this.product);
        }
    },

    //-------------------------------- order detail id -------------------------\\
    order_detail_id() {
      this.product.detail_id = 0;
      var len = this.details.length;
      this.product.detail_id = this.details[len - 1].detail_id + 1;
    },

    //-------------------------------- Show Modal Poduct Detail -------------------------\\
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

    //-------------------------------- Update Poduct Detail -------------------------\\
    Update_Detail() {
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].detail_id === this.detail.detail_id) {
          this.details[i].tax_percent = this.detail.tax_percent;
          this.details[i].Unit_price = this.detail.Unit_price;
          this.details[i].quantity = this.detail.quantity;
          this.details[i].tax_method = this.detail.tax_method;
          this.details[i].discount_Method = this.detail.discount_Method;
          this.details[i].discount = this.detail.discount;

          if (this.details[i].discount_Method == "2") {
            //Fixed
            this.details[i].DiscountNet = this.detail.discount;
          } else {
            //Percentage %
            this.details[i].DiscountNet = parseFloat(
              (this.detail.Unit_price * this.details[i].discount) / 100
            );
          }

          if (this.details[i].tax_method == "1") {
            //Exclusive
            this.details[i].Net_price = parseFloat(
              this.detail.Unit_price - this.details[i].DiscountNet
            );

            this.details[i].taxe = parseFloat(
              (this.detail.tax_percent *
                (this.detail.Unit_price - this.details[i].DiscountNet)) /
                100
            );

            this.details[i].Total_price = parseFloat(
              this.details[i].Net_price + this.details[i].taxe
            );
          } else {
            //Inclusive
            this.details[i].Net_price = parseFloat(
              (this.detail.Unit_price - this.details[i].DiscountNet) /
                (this.detail.tax_percent / 100 + 1)
            );

            this.details[i].taxe = parseFloat(
              this.detail.Unit_price -
                this.details[i].Net_price -
                this.details[i].DiscountNet
            );

            this.details[i].Total_price = parseFloat(
              this.details[i].Net_price + this.details[i].taxe
            );
          }

          this.$forceUpdate();
        }
      }
      this.CaclulTotal();
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
          this.makeToast("warning", this.$t("AddQuantity"), this.$t("Warning"));

          return false;
        } else {
          return true;
        }
      }
    },
    //----------------------------------Create POS ------------------------------\\
    CreatePOS() {
      
      NProgress.start();
      NProgress.set(0.1);
        axios
        .post("pos/CreatePOS", {
          client_id: this.sale.client_id,
          warehouse_id: this.sale.warehouse_id,
          tax_rate: this.sale.tax_rate,
          TaxNet: this.sale.TaxNet,
          discount: this.sale.discount,
          shipping: this.sale.shipping,
          details: this.details,
          GrandTotal: this.GrandTotal,
          payment: this.payment,
        })
        .then(response => {
          if (response.data.success === true) {
            // Complete the animation of theprogress bar.
            NProgress.done();
            this.Reset_Pos();
            this.makeToast("success", this.$t("sendtocheckin"), this.$t("Success"));

          }
        })
        .catch(error => {
          // Complete the animation of theprogress bar.
          NProgress.done();
          this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
        });
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

    Get_Product_Details(product, product_id) {
      axios.get("Products/" + product_id).then(response => {
        this.product.discount = 0;
        this.product.DiscountNet = 0;
        this.product.discount_Method = "2";
        this.product.product_id = response.data.id;
        this.product.name = response.data.name;
        this.product.Net_price = response.data.Net_price;
        this.product.Total_price = response.data.Total_price;
        this.product.Unit_price = response.data.Unit_price;
        this.product.taxe = response.data.tax_price;
        this.product.tax_method = response.data.tax_method;
        this.product.tax_percent = response.data.tax_percent;
        this.product.unitSale = response.data.unitSale;
        this.product.product_variant_id = product.product_variant_id;
        this.product.code = product.code;
        this.add_product(product.code);
        this.CaclulTotal();
        // Complete the animation of theprogress bar.
        NProgress.done();
      });
    },

    //----------- Calcul Total
    CaclulTotal() {
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
            this.makeToast("warning", this.$t("LowStock"), this.$t("Warning"));
            this.details[i].quantity = detail.current;
          } else {
            this.details[i].quantity = detail.quantity;
          }
        }
      }
      this.$forceUpdate();
      this.CaclulTotal();
    },

    //----------------------------------- Increment QTY ------------------------------\\
    increment(detail, id) {
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].detail_id == id) {
          if (this.details[i].quantity + 1 > this.details[i].current) {
            this.makeToast("warning", this.$t("LowStock"), this.$t("Warning"));
          } else {
            this.details[i].quantity++;
          }
        }
      }
      this.CaclulTotal();
      this.$forceUpdate();
    },

    //----------------------------------- decrement QTY ------------------------------\\
    decrement(detail, id) {
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].detail_id == id) {
          if (detail.quantity - 1 > detail.current || detail.quantity - 1 < 1) {
            this.makeToast("warning", this.$t("LowStock"), this.$t("Warning"));
          } else {
            this.details[i].quantity--;
          }
        }
      }
      this.CaclulTotal();
      this.$forceUpdate();
    },

    //---------- keyup OrderTax

    keyup_OrderTax() {
      if (isNaN(this.sale.tax_rate)) {
        this.sale.tax_rate = 13;
      } else {
        this.CaclulTotal();
      }
    },

    //---------- keyup Discount

    keyup_Discount() {
      if (isNaN(this.sale.discount)) {
        this.sale.discount = 0;
      } else {
        this.CaclulTotal();
      }
    },

    //---------- keyup Shipping

    keyup_Shipping() {
      if (isNaN(this.sale.shipping)) {
        this.sale.shipping = 0;
      } else {
        this.CaclulTotal();
      }
    },
    keyup_Cash() {
      if (isNaN(this.payment.cash)) {
        this.payment.cash = 0;
      }
    },
    keyup_Change(){
      this.payment.change = this.formatNumber(this.payment.cash - this.payment.amount , 2);  
      this.$forceUpdate();
      // if (isNaN(this.payment.cash)) {
      //   this.payment.change = 0;
      // }else{
      //   this.payment.change = payment.amount-payment.cash;
      // }
    },

    //-----------------------------------Delete Detail Product ------------------------------\\
    delete_Product_Detail(id) {
      for (var i = 0; i < this.details.length; i++) {
        if (id === this.details[i].detail_id) {
          this.details.splice(i, 1);
          this.CaclulTotal();
        }
      }
    },

    //----------Reset Pos
    Reset_Pos() {
      this.details = [];
      this.product = {};
      this.sale.client_id = "";
      this.sale.tax_rate = 13;
      this.sale.TaxNet = 0;
      this.sale.shipping = 0;
      this.sale.discount = 0;
      this.GrandTotal = 0;
      this.total = 0;
      this.category_id = "";
      this.brand_id = "";
      this.search = "";
      this.getProducts(1);
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
        this.Get_Product_Details(product, id);
        NProgress.done();
    },

    //--- Get Products by Category
    Products_by_Category(id) {
      this.category_id = id;
      this.getProducts(1);
    },

    //--- Get Products by Brand
    Products_by_Brands(id) {
      this.brand_id = id;
      this.getProducts(1);
    },

    //--- Get All Category
    getAllCategory() {
      this.category_id = "";
      this.getProducts(1);
    },

    //--- Get All Brands
    GetAllBrands() {
      this.brand_id = "";
      this.getProducts(1);
    },
    //------------------------- get Result Value Search Product

    getResultValue(result) {
      return result.code + " " + "(" + result.name + ")";
    },
    SearchProduct(result) {
      this.product = {};
      if (
        this.details.length > 0 &&
        this.details.some(detail => detail.code === result.code)
      ) {
        this.makeToast("warning", this.$t("AlreadyAdd"), this.$t("Warning"));
      } else {
        this.product.code = result.code;
        this.product.stock = result.qte_sale;
        if (result.qte_sale < 1) {
          this.product.quantity = result.qte_sale;
        } else {
          this.product.quantity = 1;
        }
        this.product.product_variant_id = result.product_variant_id;
        this.Get_Product_Details(result.id);
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

          // Complete the animation of theprogress bar.
          NProgress.done();
        })
        .catch(response => {
          // Complete the animation of theprogress bar.
          NProgress.done();
        });
    },

    //---------------------------------------Get Elements ------------------------------\\
    GetElementsPos() {
      axios
        .get("pos/GetELementPos")
        .then(response => {
          this.clients = response.data.clients;
          this.warehouses = response.data.warehouses;
          this.categories = response.data.categories;
          this.brands = response.data.brands;
          this.sale.warehouse_id = response.data.defaultWarehouse;
           this.sale.client_id = response.data.defaultClient;
          this.getProducts();
          this.paginate_Brands(this.brand_perPage, 0);
          this.paginate_Category(this.category_perPage, 0);
          this.stripe_key = response.data.stripe_key;
          this.isLoading = false;
        })
        .catch(response => {
          this.isLoading = false;
        });
    }
  },

  //-------------------- Created Function -----\\

  created() {
    this.GetElementsPos();
    Fire.$on("pay_now", () => {
      setTimeout(() => {
        this.payment.amount = this.formatNumber(this.GrandTotal , 2);
        this.payment.cash = this.formatNumber(this.GrandTotal , 2);
        this.payment.Reglement = "Cash";
        // this.$bvModal.show("Add_Payment");
        this.CreatePOS();
        // Complete the animation of theprogress bar.
        NProgress.done();
      }, 500);
    });
  },


};
</script>
