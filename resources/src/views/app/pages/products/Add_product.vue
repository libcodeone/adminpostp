<template>
    <div class="main-content">
        <breadcumb :page="$t('AddProduct')" :folder="$t('Products')" />
        <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>

        <validation-observer ref="Create_Product" v-if="!isLoading">
            <b-form @submit.prevent="Submit_Product" enctype="multipart/form-data">
                <b-row>
                    <b-col md="8">
                        <b-card>
                            <b-row>
                                <!-- Name -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Name" :rules="{ required: true, min: 3, max: 55 }"
                                        v-slot="validationContext">
                                        <b-form-group :label="$t('Name_product')">
                                            <b-form-input :state="getValidationState(validationContext)"
                                                aria-describedby="Name-feedback" label="Name"
                                                :placeholder="$t('Enter_Name_Product')"
                                                v-model="product.name"></b-form-input>
                                            <b-form-invalid-feedback id="Name-feedback">{{ validationContext.errors[0]
                                                }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Code Product"-->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Code Product"
                                        :rules="{ required: true, regex: /^\d*\.?\d*$/ }">
                                        <b-form-group slot-scope="{ valid, errors }" :label="$t('CodeProduct')">
                                            <div class="input-group">
                                                <b-form-input :class="{ 'is-invalid': !!errors.length }"
                                                    :state="errors[0] ? false : (valid ? true : null)"
                                                    aria-describedby="CodeProduct-feedback" disabled="disabled"
                                                    type="number" v-model="product.code"></b-form-input>
                                                <div class="input-group-append">
                                                    <span class="input-group-text">
                                                        <a @click="generateNumber()">
                                                            <i class="i-Bar-Code"></i>
                                                        </a>
                                                    </span>
                                                </div>
                                                <b-form-invalid-feedback id="CodeProduct-feedback">{{ errors[0]
                                                    }}</b-form-invalid-feedback>
                                            </div>
                                            <b-alert show variant="danger" class="error mt-1" v-if="code_exist != ''">{{
                                                code_exist }}</b-alert>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Category -->
                                <b-col md="6" class="mb-2">
                                    <div>
                                        <validation-provider name="categories" :rules="{ required: true }">
                                            <b-form-group slot-scope="{ valid, errors }" :label="$t('Categorie')">
                                                <!--multiselect -->
                                                <multiselect v-model="categories_id"
                                                    tag-placeholder="Agregar esta categoría"
                                                    placeholder="Buscar o agregar categoría" label="name" track-by="id"
                                                    :options="categories" :multiple="true" :taggable="true"
                                                    @tag="addCategory"></multiselect>

                                                <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                            </b-form-group>
                                        </validation-provider>
                                    </div>
                                </b-col>

                                <!-- Brand  -->
                                <b-col md="6" class="mb-2">
                                    <b-form-group :label="$t('Brand')">
                                        <v-select :placeholder="$t('Choose_Brand')" :reduce="label => label.value"
                                            v-model="product.brand_id"
                                            :options="brands.map(brands => ({ label: brands.name, value: brands.id }))" />
                                    </b-form-group>
                                </b-col>

                                <!-- Barcode Symbology  -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Barcode Symbology" :rules="{ required: true }">
                                        <b-form-group slot-scope="{ valid, errors }" :label="$t('BarcodeSymbology')">
                                            <v-select @input="changeTypeBarcode"
                                                :class="{ 'is-invalid': !!errors.length }"
                                                :state="errors[0] ? false : (valid ? true : null)"
                                                v-model="product.Type_barcode" :reduce="label => label.value"
                                                :placeholder="$t('Choose_Symbology')" :options="[
                                                    { label: 'Code 128', value: 'CODE128' },
                                                    { label: 'Code 39', value: 'CODE39' },
                                                    { label: 'EAN8', value: 'EAN8' },
                                                    { label: 'EAN13', value: 'EAN13' },
                                                    { label: 'UPC', value: 'UPC' },
                                                ]"></v-select>
                                            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Product Cost -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Product Cost"
                                        :rules="{ required: true, regex: /^\d*\.?\d*$/ }" v-slot="validationContext">
                                        <b-form-group :label="$t('ProductCost')">
                                            <b-form-input :state="getValidationState(validationContext)"
                                                aria-describedby="ProductCost-feedback" label="Cost"
                                                :placeholder="$t('Enter_Product_Cost')"
                                                v-model="product.cost"></b-form-input>
                                            <b-form-invalid-feedback id="ProductCost-feedback">{{
                                                validationContext.errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Product Price -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Product Price"
                                        :rules="{ required: true, regex: /^\d*\.?\d*$/ }" v-slot="validationContext">
                                        <b-form-group :label="$t('ProductPrice')">
                                            <b-form-input :state="getValidationState(validationContext)"
                                                aria-describedby="ProductPrice-feedback" label="Price"
                                                :placeholder="$t('Enter_Product_Price')"
                                                v-model="product.price"></b-form-input>

                                            <b-form-invalid-feedback id="ProductPrice-feedback">{{
                                                validationContext.errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Unit Product -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Unit Product" :rules="{ required: true }">
                                        <b-form-group slot-scope="{ valid, errors }" :label="$t('UnitProduct')">
                                            <v-select :class="{ 'is-invalid': !!errors.length }"
                                                :state="errors[0] ? false : (valid ? true : null)"
                                                v-model="product.unit_id" class="required" required
                                                @input="Selected_Unit" :placeholder="$t('Choose_Unit_Product')"
                                                :reduce="label => label.value"
                                                :options="units.map(units => ({ label: units.name, value: units.id }))" />
                                            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Unit Sale -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Unit Sale" :rules="{ required: true }">
                                        <b-form-group slot-scope="{ valid, errors }" :label="$t('UnitSale')">
                                            <v-select :class="{ 'is-invalid': !!errors.length }"
                                                :state="errors[0] ? false : (valid ? true : null)"
                                                v-model="product.unit_sale_id" :placeholder="$t('Choose_Unit_Sale')"
                                                :reduce="label => label.value"
                                                :options="units_sub.map(units_sub => ({ label: units_sub.name, value: units_sub.id }))" />
                                            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Unit Purchase -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Unit Purchase" :rules="{ required: true }">
                                        <b-form-group slot-scope="{ valid, errors }" :label="$t('UnitPurchase')">
                                            <v-select :class="{ 'is-invalid': !!errors.length }"
                                                :state="errors[0] ? false : (valid ? true : null)"
                                                v-model="product.unit_purchase_id"
                                                :placeholder="$t('Choose_Unit_Purchase')" :reduce="label => label.value"
                                                :options="units_sub.map(units_sub => ({ label: units_sub.name, value: units_sub.id }))" />
                                            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Stock Alert -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Stock Alert" :rules="{ regex: /^\d*\.?\d*$/ }"
                                        v-slot="validationContext">
                                        <b-form-group :label="$t('StockAlert')">
                                            <b-form-input :state="getValidationState(validationContext)"
                                                aria-describedby="StockAlert-feedback" label="Stock alert"
                                                :placeholder="$t('Enter_Stock_alert')"
                                                v-model="product.stock_alert"></b-form-input>
                                            <b-form-invalid-feedback id="StockAlert-feedback">{{
                                                validationContext.errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Order Tax -->
                                <b-col md="6" class="mb-2">
                                    <validation-provider name="Order Tax" :rules="{ regex: /^\d*\.?\d*$/ }"
                                        v-slot="validationContext">
                                        <b-form-group :label="$t('OrderTax')">
                                            <div class="input-group">
                                                <input :state="getValidationState(validationContext)"
                                                    aria-describedby="OrderTax-feedback" v-model="product.TaxNet"
                                                    type="number" class="form-control">
                                                <div class="input-group-append">
                                                    <span class="input-group-text">%</span>
                                                </div>
                                            </div>
                                            <b-form-invalid-feedback id="OrderTax-feedback">{{
                                                validationContext.errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Tax Method -->
                                <b-col lg="6" class="mb-2">
                                    <validation-provider name="Tax Method" :rules="{ required: true }">
                                        <b-form-group slot-scope="{ valid, errors }" :label="$t('TaxMethod')">
                                            <v-select :class="{ 'is-invalid': !!errors.length }"
                                                :state="errors[0] ? false : (valid ? true : null)"
                                                v-model="product.tax_method" :reduce="label => label.value"
                                                :placeholder="$t('Choose_Method')" :options="[
                                                    { label: 'Exclusive', value: '1' },
                                                    { label: 'Inclusive', value: '2' }
                                                ]"></v-select>
                                            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Item Type -->
                                <b-col lg="6" class="mb-2">
                                    <validation-provider name="Item Type" :rules="{ required: true }">
                                        <b-form-group slot-scope="{ valid, errors }" :label="'Tipo de Ítem'">
                                            <v-select :class="{ 'is-invalid': !!errors.length }"
                                                :state="errors[0] ? false : (valid ? true : null)"
                                                v-model="product.tipoItem" :reduce="label => label.value"
                                                :placeholder="'Elija el tipo de ítem'" :options="[
                                                    { label: 'Bienes', value: 1 },
                                                    { label: 'Servicios', value: 2 },
                                                    { label: 'Ambos (Bienes y Servicios, incluye los dos inherente a los Productos o servicios)', value: 3 },
                                                    { label: 'Otros tributos por ítem', value: 4 }
                                                ]"></v-select>
                                            <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>

                                <!-- Tax -->
                                <b-col lg="6" md="6" sm="12" class="mb-2">
                                    <div>
                                        <validation-provider name="taxes" :rules="{ required: true }">
                                            <b-form-group slot-scope="{ valid, errors }" :label="$t('ProductTax')">
                                                <!--multiselect -->
                                                <multiselect v-model="taxes_id"
                                                    tag-placeholder="Agregar este impuesto"
                                                    placeholder="Buscar o agregar impuesto" label="name" track-by="id"
                                                    :options="taxes" :multiple="true" :taggable="true"
                                                    @tag="addTax"></multiselect>

                                                <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                                            </b-form-group>
                                        </validation-provider>
                                    </div>
                                </b-col>

                                <b-col md="12" class="mb-2">
                                    <b-form-group :label="$t('Note')">
                                        <textarea rows="4" class="form-control" :placeholder="$t('Afewwords')"
                                            v-model="product.note"></textarea>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                    <b-col md="4">
                        <!-- upload-multiple-image -->
                        <b-card>
                            <div class="card-header">
                                <h5>{{ $t('MultipleImage') }}</h5>
                            </div>
                            <div class="card-body">
                                <b-row class="form-group">
                                    <b-col md="12 mb-5">
                                        <div id="my-strictly-unique-vue-upload-multiple-image"
                                            class="d-flex justify-content-center">
                                            <vue-upload-multiple-image @upload-success="uploadImageSuccess"
                                                @before-remove="beforeRemove"
                                                dragText="Drag & Drop Multiple images For product"
                                                dropText="Drag & Drop image" browseText="(or) Select"
                                                accept=image/gif,image/jpeg,image/png,image/bmp,image/jpg
                                                primaryText='success' markIsPrimaryText='success'
                                                popupText='have been successfully uploaded' :data-images="images"
                                                idUpload="myIdUpload" :showEdit="false" />
                                        </div>
                                    </b-col>
                                    <!-- Multiple Variants -->
                                    <b-col md="12 mb-2">
                                        <ValidationProvider rules vid="product" v-slot="x">
                                            <div class="form-check">
                                                <label class="checkbox checkbox-outline-primary">
                                                    <input type="checkbox" v-model="product.is_variant">
                                                    <span>{{ $t('ProductHasMultiVariants') }}</span>
                                                    <span class="checkmark"></span>
                                                </label>
                                            </div>
                                        </ValidationProvider>
                                    </b-col>
                                    <b-col md="12 mb-5" v-show="product.is_variant">
                                        <vue-tags-input placeholder="+ add" v-model="tag" :tags="variants"
                                            class="tag-custom text-15" @adding-duplicate="showNotifDuplicate()"
                                            @tags-changed="newTags => variants = newTags" />
                                    </b-col>
                                </b-row>
                            </div>
                        </b-card>
                    </b-col>
                    <b-col md="12" class="mt-3">
                        <b-button variant="primary" type="submit">{{ $t('submit') }}</b-button>
                    </b-col>
                </b-row>
            </b-form>
        </validation-observer>
    </div>
</template>


<script>

import VueUploadMultipleImage from "vue-upload-multiple-image";
import VueTagsInput from "@johmun/vue-tags-input";
import NProgress from "nprogress";
import Multiselect from 'vue-multiselect';

export default {
    metaInfo: {
        title: "Create Product"
    },
    data() {
        return {
            tag: "",
            len: 8,
            images: [],
            imageArray: [],
            change: false,
            isLoading: true,
            data: new FormData(),
            categories: [],
            taxes: [],
            units: [],
            units_sub: [],
            brands: [],
            roles: {},
            variants: [],
            product: {
                name: "",
                code: "",
                Type_barcode: "CODE128",
                cost: "",
                price: "",
                brand_id: "",
                category_id: [],
                TaxNet: "0",
                tax_method: "1",
                unit_id: "",
                unit_sale_id: "",
                unit_purchase_id: "",
                stock_alert: "0",
                image: "",
                note: "",
                is_variant: false,
                tipoItem: 1,
                hasIncomeTaxWithhold: false
            },
            categories_id: [],
            taxes_id: [],
            code_exist: ""
        };
    },

    components: {
        Multiselect,
        VueUploadMultipleImage,
        VueTagsInput
    },

    methods: {
        //------------- Submit Validation Create Product
        Submit_Product() {
            this.$refs.Create_Product.validate().then(success => {
                if (!success) {
                    this.makeToast(
                        "danger",
                        this.$t("Please_fill_the_form_correctly"),
                        this.$t("Failed")
                    );
                } else
                    this.Create_Product();
            });
        },

        //--- Multiple select
        addCategory(newTag) {
            const tag = {
                name: newTag,
                id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
            };
            this.categories.push(tag.name);
            this.categories_id.push(tag.id);
        },

        addTax(newTag) {
            const tag = {
                name: newTag,
                id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
            };
            this.categories.push(tag.name);
            this.categories_id.push(tag.id);
        },

        //------ Toast
        makeToast(variant, msg, title) {
            this.$root.$bvToast.toast(msg, {
                title: title,
                variant: variant,
                solid: true
            });
        },

        //------ Validation State
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null;
        },

        //------Show Notification If Variant is Duplicate
        showNotifDuplicate() {
            this.makeToast(
                "warning",
                this.$t("VariantDuplicate"),
                this.$t("Warning")
            );
        },

        //------ Change Type Barcode
        changeTypeBarcode(value) {
            this.product.code = "";
            if (value == "EAN8") {
                this.len = 7;
                this.generateNumber();
            } else if (value == "EAN13") {
                this.len = 12;
                this.generateNumber();
            } else if (value == "UPC") {
                this.len = 11;
                this.generateNumber();
            } else {
                this.len = 8;
                this.generateNumber();
            }
        },

        //------ Generate code
        generateNumber() {
            this.code_exist = "";
            this.product.code = Math.floor(
                Math.pow(10, this.len - 1) +
                Math.random() *
                (Math.pow(10, this.len) - Math.pow(10, this.len - 1) - 1)
            );
        },

        //------ Event upload Image Success
        uploadImageSuccess(formData, index, fileList, imageArray) {
            this.images = fileList;
        },

        //------ Event before Remove Image
        beforeRemove(index, done, fileList) {
            var remove = confirm("remove image");
            if (remove == true) {
                this.images = fileList;
                done();
            } else {
            }
        },

        //-------------- Product Get Elements
        GetElements() {
            axios
                .get("Products/create")
                .then(response => {
                    this.categories = response.data.categories;
                    this.brands = response.data.brands;
                    this.units = response.data.units;
                    this.taxes = response.data.taxes;
                    this.isLoading = false;
                })
                .catch(response => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 500);
                    this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
                });
        },

        //---------------------- Get Sub Units with Unit id ------------------------------\\
        Get_Units_SubBase(value) {
            axios
                .get("Get_Units_SubBase?id=" + value)
                .then(({ data }) => (this.units_sub = data));
        },

        //---------------------- Event Select Unit Product ------------------------------\\
        Selected_Unit(value) {
            this.units_sub = [];
            this.product.unit_sale_id = "";
            this.product.unit_purchase_id = "";
            this.Get_Units_SubBase(value);
        },

        //------------------------------ Create new Product ------------------------------\\
        Create_Product() {
            // Start the progress bar.
            NProgress.start();
            NProgress.set(0.1);
            var self = this;

            if (self.product.is_variant && self.variants.length <= 0) {
                self.product.is_variant = false;
            }
            // append objet product
            Object.entries(self.product).forEach(([key, value]) => {
                self.data.append(key, value);
            });

            // append array variants
            if (self.variants.length) {
                for (var i = 0; i < self.variants.length; i++) {
                    self.data.append("variants[" + i + "]", self.variants[i].text);
                }
            }
            //append array images
            if (self.images.length > 0) {
                for (var k = 0; k < self.images.length; k++) {
                    Object.entries(self.images[k]).forEach(([key, value]) => {
                        self.data.append("images[" + k + "][" + key + "]", value);
                    });
                }
            }

            let categories = self.categories_id;
            for (let l = 0; l < categories.length; l++) {
                self.data.append("category_id[" + l + "]", categories[l].id);
            }

            let taxes = self.taxes_id;
            for (let l = 0; l < taxes.length; l++) {
                self.data.append("tax_id[" + l + "]", taxes[l].id);
            }

            // Send Data with axios
            axios
                .post("Products", self.data)
                .then(response => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                    this.$router.push({ name: "index_products" });
                    this.makeToast(
                        "success",
                        this.$t("Successfully_Created"),
                        this.$t("Success")
                    );
                })
                .catch(error => {
                    // Complete the animation of the progress bar.
                    NProgress.done();
                    if (error.errors.code.length > 0) {
                        self.code_exist = error.errors.code[0];
                    }
                    this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
                });
        }
    }, //end Methods

    //-----------------------------Created function-------------------

    created: function () {
        this.GetElements();
    }
};
</script>
