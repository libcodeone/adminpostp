<template>
    <div>
        <b-breadcrumb :items="breads"></b-breadcrumb>
        <div class="caja py-4 px-2" style="font-weight: bold;">
            <h3 class="d-inline" style="color: black;">
                <strong>Ofertas de productos</strong>
            </h3>
        </div>
        <div>
            <b-button
                v-if="
                    currentUserPermissions.includes('products_discounts_create')
                "
                size="sm"
                variant="btn btn-success btn-icon m-1"
                style="margin: 1rem 0 0 auto; font-weight: bold; color: white;"
                @click="create()"
            >
                Nueva oferta
            </b-button>
        </div>
        <b-row class="mt-3 align-items-center">
            <b-col cols="4">
                <label style="font-weight: 600; color: #0b1b63" for="busqueda"
                    >Ingresa para buscar aquí</label
                >
                <b-form-input
                    id="searchInput"
                    name="busqueda"
                    placeholder="Buscar aquí..."
                    type="text"
                    v-model="busqueda"
                ></b-form-input>
            </b-col>
            <b-col class="mt-3" cols="4">
                <b-form-group :label="$t('Choose_Warehouse')">
                    <v-select
                        :reduce="label => label.value"
                        ref="warehouses_filter"
                        :placeholder="$t('Warehouses')"
                        v-model="warehouse.id"
                        :options="
                            warehouses.map(warehouse => ({
                                label: warehouse.name,
                                value: warehouse.id
                            }))
                        "
                        name="warehouses_filter"
                    ></v-select>
                </b-form-group>
            </b-col>
            <b-col class="mt-3" cols="4">
                <b-form-group :label="$t('Choose_Category')">
                    <v-select
                        :reduce="label => label.value"
                        ref="category_product_filter"
                        :placeholder="$t('Categorie')"
                        v-model="category_product.id"
                        :options="
                            categories_product.map(categories_product => ({
                                label: categories_product.name,
                                value: categories_product.id
                            }))
                        "
                        name="categories_products_filter"
                    ></v-select>
                </b-form-group>
            </b-col>
            <b-col cols="4">
                <b-button
                    variant="warning"
                    class="mt-4 mr-3"
                    v-on:click="limpiarFiltros"
                >
                    <b-icon-trash></b-icon-trash> Limpiar filtros
                </b-button>
            </b-col>
        </b-row>

        <template>
            <div>
                <div
                    class="px-2 py-1 d-flex justify-content-between align-items-center mt-4"
                    style="background: #F59E0B;"
                >
                    <div
                        class="d-flex"
                        style="align-items: center; justify-content: center;"
                    >
                        <label
                            style="margin: auto 1.25rem; font-weight: bold; color: black;"
                            class="mr-3 ml-3"
                            for="rowsAmountSelect"
                        >
                            Filas:
                        </label>
                        <b-form-select

                            id="rowsPerPage"
                            name="rowsAmountSelect"
                            v-model="per_page"
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </b-form-select>
                    </div>
                    <div>
                        <span style="font-weight: bold; color: black;">
                            Total filas: {{ rows }}
                        </span>
                    </div>
                </div>

                <div v-if="!isLoading" class="table-responsive">
                    <b-table :items="tableData" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" @sort-changed="onSortChanged(sortBy, (sortDesc ? !sortDesc : sortDesc), currentPage)">
                        <template v-slot:cell(nombre)="data">
                            {{ data.item.nombre }}
                        </template>
                        <template v-slot:cell(porcentaje_descuento)="data">
                            {{ data.item.porcentajeDescuentoProducto }}
                        </template>
                        <template v-slot:cell(precio_producto)="data">
                            {{ data.item.precioProducto }}
                        </template>
                        <template v-slot:cell(fecha_inicio)="data">
                            {{ data.item.fecha_inicio }}
                        </template>
                        <template v-slot:cell(fecha_fin)="data">
                            {{ data.item.fecha_fin }}
                        </template>
                        <template v-slot:cell(actions)="data">
                            <button class="btn btn-primary btn-sm" style="color: white; font-weight: bold;" @click="edit(data.item.id)">Editar</button>
                            <button class="btn btn-danger btn-sm" style="color: white; font-weight: bold;" @click="deleteview(data.item.id)">Eliminar</button>
                        </template>
                    </b-table>
                </div>

                <div v-else class="d-flex justify-content-center" style="width: 100%; margin-top: 300px; margin-bottom: 300px">
                    <div class="spinner sm spinner-primary mt-3"></div>
                </div>

                <div style="display: flex; justify-content: center">
                    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="per_page" @input="onChangePage">
                    </b-pagination>
                </div>
            </div>
        </template>

        <b-modal
            id="modal-1"
            ref="modal"
            title="Nueva Oferta"
            size="lg"
            hide-footer
            centered
        >
            <validation-observer ref="observer" v-slot="{ invalid }">
                <b-form @submit.prevent="onSubmit">
                    <b-container>
                        <b-row>
                            <b-col>
                                <validation-provider
                                    name="nombre"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        class="mt-3"
                                        id="input-group-2"
                                        label="nombre"
                                        label-for="nombre"
                                    >
                                        <b-form-input
                                            id="nombre-input"
                                            name="nombre"
                                            v-model="offer.nombre"
                                            autocomplete="off"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="nombre-feedback"
                                        ></b-form-input>
                                        <b-form-invalid-feedback
                                            id="name-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                                <validation-provider
                                    name="descripcion"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-2"
                                        label="Descripción"
                                        label-for="descripcion"
                                    >
                                        <b-form-textarea
                                            id="descripcion-input"
                                            name="descripcion"
                                            v-model="offer.descripcion"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="descripcion-feedback"
                                        ></b-form-textarea>
                                        <b-form-invalid-feedback
                                            id="name-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                        </b-row>
                        <b-button variant="dark" @click="changeModalidadOffer()"
                            >Cambiar modalidad de oferta</b-button
                        >
                        <b-row class="mt-3">
                            <b-col v-if="typeDescOffer == 'descuento'">
                                <validation-provider
                                    name="porcentajeDescuentoProducto"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-2"
                                        label="Porcentaje de descuento de producto"
                                        label-for="porcentajeDescuentoProducto"
                                    >
                                        <b-form-input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            id="porcentajeDescuentoProducto-input"
                                            name="porcentajeDescuentoProducto"
                                            v-model="
                                                offer.porcentajeDescuentoProducto
                                            "
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="porcentajeDescuentoProducto-feedback"
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
                            <b-col v-else>
                                <validation-provider
                                    name="precioProducto"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-2"
                                        label="Precio de producto"
                                        label-for="precioProducto"
                                    >
                                        <b-form-input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            id="precioProducto-input"
                                            name="precioProducto"
                                            v-model="offer.precioProducto"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="precioProducto-feedback"
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
                        </b-row>
                        <b-row>
                            <b-col>
                                <validation-provider
                                    name="Hora de inicio"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-4"
                                        label="Hora de inicio"
                                        label-for="hora_inicio"
                                    >
                                        <!-- <p style="font-size: 12px">
                                            *Campo opcional
                                        </p> -->
                                        <b-form-timepicker
                                            id="hora_inicio"
                                            name="hora_inicio"
                                            v-model="offer.hora_inicio"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="hora_inicio-feedback"
                                        ></b-form-timepicker>
                                        <b-form-invalid-feedback
                                            id="hora_inicio-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                            <b-col>
                                <validation-provider
                                    name="Hora de vencimiento"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-5"
                                        label="Hora de vencimiento"
                                        label-for="hora_fin"
                                    >
                                        <!-- <p style="font-size: 12px">
                                            *Campo opcional
                                        </p> -->
                                        <b-form-timepicker
                                            id="hora-fin-input"
                                            name="hora_fin"
                                            v-model="offer.hora_fin"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="hora_fin-feedback"
                                        ></b-form-timepicker>
                                        <b-form-invalid-feedback
                                            id="hora-fin-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <validation-provider
                                    name="Fecha de inicio"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-4"
                                        label="fecha de inicio"
                                        label-for="fecha_inicio"
                                    >
                                        <b-form-datepicker
                                            id="fecha_inicio"
                                            name="fecha_inicio"
                                            v-model="offer.fecha_inicio"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="fecha_inicio-feedback"
                                        ></b-form-datepicker>
                                        <b-form-invalid-feedback
                                            id="fecha_inicio-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                            <b-col>
                                <validation-provider
                                    name="Fecha de vencimiento"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-5"
                                        label="fecha de vencimiento"
                                        label-for="fecha_fin"
                                    >
                                        <b-form-datepicker
                                            id="fecha-fin-input"
                                            name="fecha_fin"
                                            v-model="offer.fecha_fin"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="fecha_fin-feedback"
                                        ></b-form-datepicker>
                                        <b-form-invalid-feedback
                                            id="fecha-fin-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12">
                                <label for="">Dias</label>
                                <!-- <small
                                    >(No seleccionar para que se active todos
                                    los dias)</small
                                > -->
                            </b-col>
                            <b-col v-for="dia in dias" :key="dia">
                                <b-form-checkbox
                                    :id="'checkbox-' + dia"
                                    v-model="diasSelected"
                                    name="dias[]"
                                    :value="dia"
                                >
                                    {{ dia }}
                                </b-form-checkbox>
                            </b-col>
                            <hr />
                            <b-col class="mt-3" cols="12">
                                <b-form-group
                                    :label="
                                        $t('Choose_Warehouse') +
                                            ' (' +
                                            $t('Field_optional') +
                                            ')'
                                    "
                                >
                                    <v-select
                                        :reduce="label => label.value"
                                        ref="warehouses_filter"
                                        :placeholder="$t('Warehouses')"
                                        v-model="warehouse_add.id"
                                        :options="
                                            warehouses.map(warehouse => ({
                                                label: warehouse.name,
                                                value: warehouse.id
                                            }))
                                        "
                                        name="warehouse_filter"
                                    ></v-select>
                                </b-form-group>
                            </b-col>
                            <b-col class="mt-3" cols="12">
                                <b-form-group
                                    :label="
                                        $t('Choose_Category') +
                                            ' (' +
                                            $t('Field_optional') +
                                            ')'
                                    "
                                >
                                    <v-select
                                        :reduce="label => label.value"
                                        ref="category_product_filter"
                                        :placeholder="$t('Categorie')"
                                        v-model="category_product_add.id"
                                        :options="
                                            categories_product.map(
                                                categories_product => ({
                                                    label:
                                                        categories_product.name,
                                                    value: categories_product.id
                                                })
                                            )
                                        "
                                        name="category_product_filter_form"
                                    ></v-select>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-col class="mt-3">
                            <label for="checkbox"
                                >Aplicar oferta en todos los productos</label
                            >
                            <input
                                type="checkbox"
                                id="checkbox"
                                v-model="is_all_products"
                                name="is_all_products"
                            />
                        </b-col>

                        <b-row>
                            <b-col class="mt-4">
                                <label for="status">Estado de oferta</label>
                                <b-form-select
                                    class="form-select"
                                    name="status"
                                    v-model="offer.activo"
                                    :options="statusOption"
                                ></b-form-select>
                            </b-col>
                        </b-row>
                    </b-container>
                    <div class="mt-4 text-right">
                        <b-button
                            variant="outline-danger"
                            @click="$bvModal.hide('modal-1')"
                            >Cancelar</b-button
                        >
                        <b-button
                            variant="success"
                            @click="store()"
                            type="submit"
                            :disabled="invalid"
                            >Guardar</b-button
                        >
                    </div>
                </b-form>
            </validation-observer>
        </b-modal>
        <b-modal
            id="modal-2"
            ref="modal"
            title="Modificar Oferta"
            size="lg"
            hide-footer
            centered
        >
            <validation-observer ref="observer" v-slot="{ invalid }">
                <b-form @submit.prevent="onSubmit">
                    <b-container>
                        <b-row>
                            <b-col>
                                <validation-provider
                                    name="nombre"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-2"
                                        label="nombre"
                                        label-for="nombre"
                                    >
                                        <b-form-input
                                            id="nombre-input"
                                            name="nombre"
                                            v-model="offer.nombre"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="nombre-feedback"
                                        ></b-form-input>
                                        <b-form-invalid-feedback
                                            id="name-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                                <validation-provider
                                    name="descripcion"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-2"
                                        label="Descripción"
                                        label-for="descripcion"
                                    >
                                        <b-form-textarea
                                            id="descripcion-input"
                                            name="descripcion"
                                            v-model="offer.descripcion"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="descripcion-feedback"
                                        ></b-form-textarea>
                                        <b-form-invalid-feedback
                                            id="name-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                        </b-row>
                        <b-button variant="dark" @click="changeModalidadOffer()"
                            >Cambiar modalidad de oferta</b-button
                        >
                        <b-row class="mt-3">
                            <b-col v-if="typeDescOffer == 'descuento'">
                                <validation-provider
                                    name="porcentajeDescuentoProducto"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-2"
                                        label="Porcentaje de descuento en producto"
                                        label-for="porcentajeDescuentoProducto"
                                    >
                                        <b-form-input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            id="porcentajeDescuentoProducto-input"
                                            name="porcentajeDescuentoProducto"
                                            v-model="
                                                offer.porcentajeDescuentoProducto
                                            "
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="porcentajeDescuentoProducto-feedback"
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
                            <b-col v-else>
                                <validation-provider
                                    name="precioProducto"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-2"
                                        label="Precio de producto"
                                        label-for="precioProducto"
                                    >
                                        <b-form-input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            id="precioProducto-input"
                                            name="precioProducto"
                                            v-model="offer.precioProducto"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="precioProducto-feedback"
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
                        </b-row>
                        <b-row>
                            <b-col>
                                <validation-provider
                                    name="Hora de inicio"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-4"
                                        label="Hora de inicio"
                                        label-for="hora_inicio"
                                    >
                                        <!-- <p style="font-size: 12px">
                                            *Campo opcional
                                        </p> -->
                                        <b-form-timepicker
                                            id="hora_inicio"
                                            name="hora_inicio"
                                            v-model="offer.hora_inicio"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="hora_inicio-feedback"
                                        ></b-form-timepicker>
                                        <b-form-invalid-feedback
                                            id="hora_inicio-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                            <b-col>
                                <validation-provider
                                    name="Hora de vencimiento"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-5"
                                        label="Hora de vencimiento"
                                        label-for="hora_fin"
                                    >
                                        <!-- <p style="font-size: 12px">
                                            *Campo opcional
                                        </p> -->
                                        <b-form-timepicker
                                            id="hora-fin-input"
                                            name="hora_fin"
                                            v-model="offer.hora_fin"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="hora_fin-feedback"
                                        ></b-form-timepicker>
                                        <b-form-invalid-feedback
                                            id="hora-fin-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <validation-provider
                                    name="Fecha de inicio"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-4"
                                        label="fecha de inicio"
                                        label-for="fecha_inicio"
                                    >
                                        <b-form-datepicker
                                            id="fecha_inicio"
                                            name="fecha_inicio"
                                            v-model="offer.fecha_inicio"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="fecha_inicio-feedback"
                                        ></b-form-datepicker>
                                        <b-form-invalid-feedback
                                            id="fecha_inicio-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                            <b-col>
                                <validation-provider
                                    name="Fecha de vencimiento"
                                    rules="required"
                                    v-slot="validationContext"
                                >
                                    <b-form-group
                                        id="input-group-5"
                                        label="fecha de vencimiento"
                                        label-for="fecha_fin"
                                    >
                                        <b-form-datepicker
                                            id="fecha-fin-input"
                                            name="fecha_fin"
                                            v-model="offer.fecha_fin"
                                            locale="en"
                                            :state="
                                                getValidationState(
                                                    validationContext
                                                )
                                            "
                                            aria-describedby="fecha_fin-feedback"
                                        ></b-form-datepicker>
                                        <b-form-invalid-feedback
                                            id="fecha-fin-feedback"
                                            >{{
                                                validationContext.errors[0]
                                            }}</b-form-invalid-feedback
                                        >
                                    </b-form-group>
                                </validation-provider>
                            </b-col>
                        </b-row>
                        <hr />
                        <b-row>
                            <b-col cols="12">
                                <label for="">Dias</label>
                                <!-- <small
                                    >(No seleccionar para que se active todos
                                    los dias)</small
                                > -->
                            </b-col>
                            <b-col v-for="dia in dias" :key="dia">
                                <b-form-checkbox
                                    :id="'checkbox-' + dia"
                                    v-model="diasSelected"
                                    name="dias[]"
                                    :value="dia"
                                >
                                    {{ dia }}
                                </b-form-checkbox>
                            </b-col>
                            <hr />
                        </b-row>
                        <hr />
                        <b-row>
                            <b-col class="mt-3" cols="12">
                                <b-form-group
                                    :label="
                                        $t('Choose_Warehouse') +
                                            ' (' +
                                            $t('Field_optional') +
                                            ')'
                                    "
                                >
                                    <v-select
                                        :reduce="label => label.value"
                                        ref="warehouses_filter"
                                        :placeholder="$t('Warehouses')"
                                        v-model="warehouse_edit.id"
                                        :options="
                                            warehouses.map(warehouse => ({
                                                label: warehouse.name,
                                                value: warehouse.id
                                            }))
                                        "
                                        name="warehouse_filter"
                                    ></v-select>
                                </b-form-group>
                            </b-col>
                            <b-col class="mt-3" cols="12">
                                <b-form-group
                                    :label="
                                        $t('Choose_Category') +
                                            ' (' +
                                            $t('Field_optional') +
                                            ')'
                                    "
                                >
                                    <v-select
                                        :reduce="label => label.value"
                                        ref="category_product_filter"
                                        :placeholder="$t('Categorie')"
                                        v-model="category_product_edit.id"
                                        :options="
                                            categories_product.map(
                                                categories_product => ({
                                                    label:
                                                        categories_product.name,
                                                    value: categories_product.id
                                                })
                                            )
                                        "
                                        name="category_product_filter_form"
                                    ></v-select>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-col class="mt-3">
                            <label for="checkbox"
                                >Aplicar oferta en todos los productos</label
                            >
                            <input
                                type="checkbox"
                                id="checkbox"
                                v-model="is_all_products"
                                name="is_all_products"
                            />
                        </b-col>
                        <b-row>
                            <b-col class="mt-4">
                                <label for="status">Estado de oferta</label>
                                <b-form-select
                                    class="form-select"
                                    name="status"
                                    v-model="offer.activo"
                                    :options="statusOption"
                                ></b-form-select>
                            </b-col>
                        </b-row>
                    </b-container>
                    <div class="mt-4 text-right">
                        <b-button
                            variant="outline-danger"
                            @click="$bvModal.hide('modal-2')"
                            >Cancelar</b-button
                        >
                        <b-button
                            variant="success"
                            @click="update(offer.id)"
                            type="submit"
                            :disabled="invalid"
                            >Actualizar</b-button
                        >
                    </div>
                </b-form>
            </validation-observer>
        </b-modal>
        <b-modal
            id="modal-3"
            ref="modal"
            title="Eliminar Oferta"
            size="lg"
            hide-footer
            centered
        >
            <form ref="form">
                <h6 class="text-center">
                    <strong
                        >¿Esta seguro que desea eliminar esta oferta?</strong
                    >
                </h6>
                <div class="mt-4 text-right">
                    <b-button
                        variant="outline-danger"
                        @click="$bvModal.hide('modal-3')"
                        >Cancelar</b-button
                    >
                    <b-button
                        variant="success"
                        @click="destroy(offer.id)"
                        :disabled="invalid"
                        >Eliminar</b-button
                    >
                </div>
            </form>
        </b-modal>
    </div>
</template>

<style scoped>
.circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
</style>
<script>
import { mapGetters } from "vuex";

export default {
    metaInfo: {
        title: "Discounts"
    },
    computed: {
        tableData()
        {
            if (this.busqueda || (this.$refs.warehouses_filter && this.$refs.warehouses_filter.value) || (this.$refs.category_product_filter && this.$refs.category_product_filter.value))
                return this.filteredItems();
            else
                return this.offers;
        },
        ...mapGetters(["currentUserPermissions", "currentUser"]),
        columns() {
            return [
                {
                    label: this.$t("Name"),
                    field: "nombre",
                    dataType: "string",
                    tdClass: "text-left",
                    thClass: "text-left",
                    sortable: true
                },
                {
                    label: "Porcentaje de descuento",
                    field: "porcentaje_descuento",
                    dataType: "string",
                    tdClass: "text-left",
                    thClass: "text-left",
                    sortable: true
                },
                {
                    label: "Precio del producto",
                    field: "precio_producto",
                    dataType: "string",
                    tdClass: "text-left",
                    thClass: "text-left",
                    sortable: true
                },
                {
                    label: "Fecha de inicio",
                    field: "fecha_inicio",
                    dataType: "string",
                    tdClass: "text-left",
                    thClass: "text-left",
                    sortable: true
                },
                {
                    label: "Fecha de vencimiento",
                    field: "fecha_fin",
                    dataType: "string",
                    tdClass: "text-left",
                    thClass: "text-left",
                    sortable: true
                },
                {
                    label: this.$t("Action"),
                    field: "actions",
                    tdClass: "text-right",
                    thClass: "text-right",
                    sortable: false
                }
            ];
        }
    },
    data() {
        return {
            errors: [],
            validate: {
                state: false,
                message: ""
            },
            statusOption: [
                {
                    text: "activo",
                    value: 1
                },
                {
                    text: "inactivo",
                    value: 0
                }
            ],
            typeOffers: [
                {
                    text: "Todos los productos",
                    value: "todo"
                },
                {
                    text: "Sucursal",
                    value: "sucursal"
                },
                {
                    text: "Categoría de producto",
                    value: "productCat"
                }
            ],
            optionsTypeOfferSelected: {
                type: "todo",
                text: "Todos los productos",
                entidad: []
            },
            breads: [
                {
                    text: "PosLaravel",
                    href: "/app"
                },
                {
                    text: "Ofertas",
                    href: "#"
                }
            ],
            sortBy: [
                "nombre",
                "porcentaje_descuento",
                "precio_producto",
                "fecha_inicio",
                "fecha_fin"
            ],
            sortDesc: false,
            fields: [
                { key: 'nombre', sortable: true },
                { key: 'porcentaje_descuento', label: 'Porcentaje de descuento', sortable: true },
                { key: 'precio_producto', label: 'Precio del producto', sortable: true },
                { key: 'fecha_inicio', label: 'Fecha de inicio', sortable: true },
                { key: 'fecha_fin', label: 'Fecha de vencimiento', sortable: true },
                { key: 'actions', label: 'Acción' }
            ],
            dias: [
                "lunes",
                "martes",
                "miercoles",
                "jueves",
                "viernes",
                "sabado",
                "domingo"
            ],
            diasSelected: [],
            orderBy: "desc",
            dataTypeOrderBy: "string",
            orderByName: "nombre",
            typeDescOffer: "descuento",
            regexInKey: /\[([^\]]+)\]/,
            products_selected: [],
            offers: [],
            products: [],
            warehouses: [],
            categories_product: [],
            product: {
                id: null,
                code: "",
                Type_barcode: "",
                name: "",
                cost: 0.00,
                price: 0.00,
                category_id: null,
                brand_id: null,
                unit_id: null,
                unit_sale_id: null,
                unit_purchase_id: null,
                warehouse_id: null,
                TaxNet: 0.00,
                tax_method: '1',
                image: "",
                note: "",
                stock_alert: 0.00,
                is_variant: 0,
                is_active: 1
            },
            warehouse: {
                id: null,
                name: "",
                mobile: "",
                zip: "",
                email: "",
                country: ""
            },
            category_product: {
                id: null,
                code: "",
                name: "",
                image: ""
            },
            product_add: {
                id: null,
                code: "",
                Type_barcode: "",
                name: "",
                cost: 0.00,
                price: 0.00,
                category_id: null,
                brand_id: null,
                unit_id: null,
                unit_sale_id: null,
                unit_purchase_id: null,
                warehouse_id: null,
                TaxNet: 0.00,
                tax_method: '1',
                image: "",
                note: "",
                stock_alert: 0.00,
                is_variant: 0,
                is_active: 1
            },
            warehouse_add: {
                id: null,
                name: "",
                mobile: "",
                zip: "",
                email: "",
                country: ""
            },
            category_product_add: {
                id: null,
                code: "",
                name: "",
                image: ""
            },
            product_edit: {
                id: null,
                code: "",
                Type_barcode: "",
                name: "",
                cost: 0.00,
                price: 0.00,
                category_id: null,
                brand_id: null,
                unit_id: null,
                unit_sale_id: null,
                unit_purchase_id: null,
                warehouse_id: null,
                TaxNet: 0.00,
                tax_method: '1',
                image: "",
                note: "",
                stock_alert: 0.00,
                is_variant: 0,
                is_active: 1
            },
            warehouse_edit: {
                id: null,
                name: "",
                mobile: "",
                zip: "",
                email: "",
                country: ""
            },
            category_product_edit: {
                id: null,
                code: "",
                name: "",
                image: ""
            },
            warehouse_filter: null,
            category_product_filter: null,
            is_all_products: false,
            isLoading: true,
            rows: 1,
            per_page: 10,
            currentPage: 1,
            busqueda: ""
        };
    },
    methods: {
        filteredItems() {
            let filtered = this.offers;

            if (this.busqueda)
            {
                filtered = filtered.filter(offer =>
                    offer["nombre"].toString().toLowerCase().includes(this.busqueda.toLowerCase()) || offer["descripcion"].toString().toLowerCase().includes(this.busqueda.toLowerCase())
                );
            }

            if (this.$refs.warehouses_filter && this.$refs.warehouses_filter.value)
                filtered = filtered.filter(item => item.warehouse_id === this.$refs.warehouses_filter.value);

            if (this.$refs.category_product_filter && this.$refs.category_product_filter.value)
                filtered = filtered.filter(item => item.category_product_id === this.$refs.category_product_filter.value);

            return filtered;
        },
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null;
        },
        index() {
            this.isLoading = true;
            axios
                .get(
                    "discounts?page=" +
                        this.currentPage +
                        "&dataTypeOrderBy=" +
                        this.dataTypeOrderBy +
                        "&orderBy=" +
                        this.orderBy +
                        "&orderByName=" +
                        this.orderByName +
                        "&perPage=" +
                        this.per_page +
                        "&currentPage=" +
                        this.currentPage +
                        "&warehouse=" +
                        (this.warehouse_filter != null
                            ? this.warehouse_filter
                            : "null") +
                        "&category_product=" +
                        (this.category_product_filter != null
                            ? this.category_product_filter
                            : "null") +
                        "&search=" +
                        this.busqueda
                )
                .then(response => {
                    this.products = response.data.products;
                    this.categories_product = response.data.categories_product;
                    this.warehouses = response.data.warehouses;
                    this.offers = response.data.offers.data;
                    this.rows = response.data.rows;
                    this.isLoading = false;
                });
        },
        create() {
            this.offer = {};
            this.errors = [];
            this.diasSelected = [];
            this.offer.activo = 1;
            this.is_all_products = false;
            this.$bvModal.show("modal-1");
        },
        store() {
            this.offer.dias = JSON.stringify(this.diasSelected);
            this.offer.warehouse_id =
                this.warehouse_add == null ? null : this.warehouse_add.id;
            this.offer.category_product_id =
                this.category_product_add == null ? null : this.category_product_add.id;
            this.offer.is_all_products = this.is_all_products ? "si" : "no";

            axios
                .post("discount", this.offer)
                .then(response => {
                    if (response.status == 200) {
                        this.offer = {};
                        this.$bvModal.hide("modal-1");
                        this.$swal(
                            "¡Éxito!",
                            "¡Datos almacenados con éxito!",
                            "success"
                        );
                        this.index();
                    }
                })
                .catch(error => {
                    if (error.response.status == 422)
                        this.errors = error.response.data.errors;
                    else this.$swal("Oops!", "Ha ocurrido un error", "error");
                });
        },
        edit(id) {
            this.errors = [];
            axios
                .get("discounts/edit/" + id)
                .then(response => {
                    if (response.status == 200) {
                        this.offer = response.data.offer;
                        this.warehouse_edit =
                            (response.data.warehouse) ? response.data.warehouse : {
                            id: null,
                            name: "",
                            mobile: "",
                            zip: "",
                            email: "",
                            country: ""
                        };
                        this.category_product_edit =
                            (response.data.category_product) ? response.data.category_product : {
                            id: null,
                            code: "",
                            name: "",
                            image: ""
                        };
                        this.is_all_products =
                            (this.offer.is_all_products == "si") ? true : false;
                        this.diasSelected =
                            (this.offer.dias == null || this.offer.dias == "" || this.offer.dias == "[]") ? [] : JSON.parse(this.offer.dias);
                        this.typeDescOffer =
                            (this.offer.porcentajeDescuentoProducto != null) ? "descuento" : "";
                        this.$bvModal.show("modal-2");
                    }
                })
                .catch(error => {
                    this.$swal("Oops!", "Ha ocurrido un error", "error");
                });
        },
        update(id) {
            this.offer.dias = JSON.stringify(this.diasSelected);
            this.offer.warehouse_id =
                (this.warehouse_edit == null) ? null : this.warehouse_edit.id;
            this.offer.category_product_id =
                (this.category_product_edit == null) ? null : this.category_product_edit.id;
            this.offer.is_all_products =
                (this.is_all_products) ? "si" : "no";

            axios
                .patch("discounts/update/" + id, this.offer)
                .then(response => {
                    if (response.status == 200) {
                        this.offer = {};
                        this.$bvModal.hide("modal-2");
                        this.$swal(
                            "¡Éxito!",
                            "¡Datos actualizados con éxito!",
                            "success"
                        );
                        this.index();
                    }
                })
                .catch(error => {
                    if (error.response.status == 422)
                        this.errors = error.response.data.errors;
                    else this.$swal("Oops!", "Ha ocurrido un error", "error");
                });
        },
        deleteview(id) {
            axios
                .get("discounts/delete_view/" + id)
                .then(response =>
                    {
                        if (response.status == 200)
                        {
                            this.offer = response.data.offer;
                            this.$bvModal.show("modal-3");
                        }
                    }
                )
                .catch(error => {
                    this.$swal("Oops!", "Ha ocurrido un error", "error");
                });
        },
        destroy(id) {
            axios
                .delete("discounts/destroy/" + id)
                .then(response => {
                    if (response.status == 200) {
                        this.offer = {};
                        this.$bvModal.hide("modal-3");
                        this.$swal(
                            "¡Éxito!",
                            "¡Registro eliminado con éxito!",
                            "success"
                        );
                        this.index();
                    }
                })
                .catch(error => {
                    this.$swal("Oops!", "Ha ocurrido un error", "error");
                });
        },
        changeModalidadOffer() {
            this.typeDescOffer == "descuento"
                ? (this.typeDescOffer = "precio")
                : (this.typeDescOffer = "descuento");
            if (this.typeDescOffer == "descuento") {
                this.offer.precioProducto = null;
            } else {
                this.offer.porcentajeDescuentoProducto = null;
            }
        },

        /*
        changeTypeOffer() {
            switch (this.optionsTypeOfferSelected.type) {
                case "todo":
                    this.optionsTypeOfferSelected.text = "";
                    this.optionsTypeOfferSelected.entidad = {};
                    this.entidadOptions = [];
                    break;
                case "sucursal":
                    this.optionsTypeOfferSelected.text = "la sucursal";
                    this.entidadOptions = this.warehouses;
                    this.optionsTypeOfferSelected.entidad = this.warehouses;
                    break;
                case "productCat":
                    this.optionsTypeOfferSelected.text =
                        "la categoría de producto";
                    this.entidadOptions = this.categories_product;
                    this.optionsTypeOfferSelected.entidad = this.categories_product;
                    break;
                case "default":
                    this.optionsTypeOfferSelected.text = "la sucursal";
                    this.entidadOptions = this.warehouses;
                    this.optionsTypeOfferSelected.entidad = this.warehouses;
                    break;
            }
        },
        redirectTypeOffers(id) {
            window.location.href = "type-offers-product?offer_id=" + id;
        },
        */

        // openAddProductModal(id) {
        //     axios.get("discounts/save_product/" + id)
        //         .then((response) => {
        //             if (response.status == 200) {
        //                 /* this.warehouses = this.warehouses; */
        //                 this.offer = response.data.offer;
        //                 this.products_selected = this.offer.offersProducts;
        //                 this.$bvModal.show("modal-4");
        //             }
        //         })
        //         .catch((error) => {
        //             this.$swal("Oops!", "Ha ocurrido un error", "error");
        //         });
        // },
        // addProduct(id) {
        //     if (this.products_selected.includes(id)) {
        //         const index = this.products_selected.indexOf(id);
        //         this.products_selected.splice(index, 1);
        //     } else {
        //         this.products_selected.push(id);
        //     }
        // },
        /* /get-products/{id} */
        /*
        getProducts() {
            axios.get("products")
                .then((response) => {
                    if (response.status == 200) {
                        this.products = response.data.products;
                    }
                })
                .catch((error) => {
                    this.$swal("Oops!", "Ha ocurrido un error", "error");
                });
        },
        */

        /*
        saveProducts(id) {
            let data = {
                offer: id,
                products: this.products_selected,
            };
            axios.post("discounts/saveProducts/", data)
                .then((response) => {
                    if (response.status == 200) {
                        this.$bvModal.hide("modal-4");
                        this.$swal(
                            "Éxito!",
                            "Datos actualizados con éxito!",
                            "success"
                        );
                    }
                })
                .catch((error) => {
                    if (error.response.status == 422)
                        this.errors = error.response.data.errors;
                    else this.$swal("Oops!", "Ha ocurrido un error", "error");
                });
        },
        */

        handleImageError(event) {
            event.target.src = "/images/shadai_logo.png";
        },

        /*
        nameSelectVue({ name }) {
            return `${name}`;
        },
        */

        onChangePage(page) {
            this.currentPage = parseInt(page, 10);
            this.index();
        },

        onSortChanged(name, type, currentPage)
        {
            this.sortBy = name;
            this.sortDesc = type;
            this.currentPage = currentPage;
        },

        /*
        onChangeOrderBy(name, type, dataTypeOrderBy) {
            this.orderByName = name;
            this.orderBy = type;
            this.dataTypeOrderBy = dataTypeOrderBy;
            this.currentPage = 1;
            this.onchangeSearch();
        },
        */

        onSubmit(submitEvent)
        {
            submitEvent.preventDefault();

            let formData = {
                nombre: '',
                descripcion: '',
                porcentaje_descuento: null,
                precio_producto: null,
                fecha_inicio: '',
                fecha_inicio: '',
                // warehouse_id: '',
                // category_id: '',
                discount_status: false
            };

            formData.nombre = submitEvent.target.elements.nombre.value;
            formData.descripcion = submitEvent.target.elements.descripcion.value;
            formData.porcentaje_descuento = (submitEvent.target.elements.porcentajeDescuentoProducto) ? parseFloat(submitEvent.target.elements.porcentajeDescuentoProducto.value) : null;
            formData.precio_producto = (submitEvent.target.elements.precioProducto) ? parseFloat(submitEvent.target.elements.precioProducto.value) : null;
            formData.fecha_inicio = submitEvent.target.elements.fecha_inicio.value;
            formData.fecha_fin = submitEvent.target.elements.fecha_fin.value;
            // formData.warehouse_id = submitEvent.target.elements.warehouse_filter.value;
            // formData.category_id = submitEvent.target.elements.category_product_filter_form.value;
            formData.discount_status = submitEvent.target.elements.status.checked;

            if (!formData.nombre)
                this.errors.push('El campo "Nombre" es obligatorio.');

            if (!formData.descripcion)
                this.errors.push('El campo "Descripción" es obligatorio.');

            if (!formData.porcentaje_descuento || !formData.precio_producto)
            {
                if (!formData.porcentaje_descuento)
                    this.errors.push('El campo "Porcentaje de Descuento" es obligatorio.');
                else
                    this.errors.push('El campo "Precio de Producto" es obligatorio.');
            }

            if (!formData.fecha_inicio)
                this.errors.push('El campo "Fecha de Inicio" es obligatorio.');

            if (!formData.fecha_fin)
                this.errors.push('El campo "Fecha de Fin" es obligatorio.');

            // if (!formData.warehouse_id)
            //     this.errors.push('El campo "Almacén" es obligatorio.');

            // if (!formData.category_id)
            //     this.errors.push('El campo "Categoría" es obligatorio.');

            if (!formData.discount_status)
                this.errors.push('El campo "Estado de Oferta" es obligatorio.');

            // if (this.errors.length === 0)
            //     console.log('Datos del formulario:\n\n', formData);
            // else
            //     console.log('Errores:\n\n', this.errors);
        },

        limpiarFiltros() {
            this.busqueda = "";
            this.warehouse.id = null;
            this.category_product.id = null;

            this.index();
        }
    },
    created: function() {
        this.currentUserPermissions = Object.freeze(
            this.currentUserPermissions
        );
        this.index();
    }
};
</script>
