<template>
  <div class="main-content">
    <breadcumb :page="$t('SaleDetail')" :folder="$t('Sales')" />

    <div
      v-if="isLoading"
      class="loading_page spinner spinner-primary mr-3"
    ></div>
    <b-row v-if="!isLoading">
      <b-row>
        <b-col md="12" class="mb-5">
          <button
            @click="back()"
            class="btn btn-success btn-icon ripple btn-sm"
          >
            {{ $t("go_list") }}
          </button>
          <button
            @click="Sale_PDF()"
            class="btn btn-primary btn-icon ripple btn-sm"
          >
            <i class="i-File-TXT"></i>
            PDF
          </button>
          <!-- <button
            @click="Invoice_POS()"
            class="btn btn-warning btn-icon ripple btn-sm"
          >
            <i class="i-Billing"></i>
            {{ $t("print") }}
          </button> -->
          <button
            @click="Check_in()"
            class="btn btn-success btn-icon ripple btn-sm"
          >
            {{ $t("Checkin") }}
          </button>
        </b-col>
      </b-row>

      <div class="invoice" id="print_Invoice">
        <div class="invoice-print">
          <b-row class="justify-content-md-center">
            <h4 class="font-weight-bold">
              {{ $t("SaleDetail") }} : {{ sale.Ref }}
            </h4>
          </b-row>
          <hr />
          <b-row class="mt-5">
            <b-col lg="4" md="4" sm="12" class="mb-4">
              <h5 class="font-weight-bold">{{ $t("Customer_Info") }}</h5>
              <div>{{ sale.client_name }}</div>
              <div>{{ sale.client_email }}</div>
              <div>{{ sale.client_phone }}</div>
              <div>{{ sale.client_adr }}</div>
              <div>{{ sale.client_NIT }}</div>
              <div>{{ sale.client_NRC }}</div>
              <div>{{ sale.client_giro }}</div>
            </b-col>
            <b-col lg="4" md="4" sm="12" class="mb-4">
              <h5 class="font-weight-bold">{{ $t("Company_Info") }}</h5>
              <div>{{ company.CompanyName }}</div>
              <div>{{ company.email }}</div>
              <div>{{ company.CompanyPhone }}</div>
              <div>{{ company.CompanyAdress }}</div>
            </b-col>
            <b-col lg="4" md="4" sm="12" class="mb-4">
              <h5 class="font-weight-bold">{{ $t("Invoice_Info") }}</h5>
              <div>{{ $t("Reference") }} : {{ sale.Ref }}</div>
              <div>
                {{ $t("PaymentStatus") }} :
                <span
                  v-if="sale.payment_status == 'paid'"
                  class="badge badge-outline-success"
                  >{{ $t("Paid") }}</span
                >
                <span
                  v-else-if="sale.payment_status == 'partial'"
                  class="badge badge-outline-primary"
                  >{{ $t("partial") }}</span
                >
                <span v-else class="badge badge-outline-warning">{{
                  $t("Unpaid")
                }}</span>
              </div>
              <div>{{ $t("warehouse") }} : {{ sale.warehouse }}</div>
              <div>
                {{ $t("Status") }} :
                <span
                  v-if="sale.statut == 'completed'"
                  class="badge badge-outline-success"
                  >{{ $t("complete") }}</span
                >
                <span
                  v-else-if="sale.statut == 'pending'"
                  class="badge badge-outline-info"
                  >{{ $t("Pending") }}</span
                >
                <span v-else class="badge badge-outline-warning">{{
                  $t("Ordered")
                }}</span>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-3">
            <b-col md="12">
              <h5 class="font-weight-bold">{{ $t("Order_Summary") }}</h5>
              <div class="table-responsive">
                <table class="table table-hover table-md">
                  <thead class="bg-gray-300">
                    <tr>
                      <th scope="col">{{ $t("ProductName") }}</th>
                      <th scope="col">{{ $t("Net_Unit_Price") }}</th>
                      <th scope="col">{{ $t("Quantity") }}</th>
                      <th scope="col">{{ $t("UnitPrice") }}</th>
                      <th scope="col">{{ $t("Discount") }}</th>
                      <th scope="col">{{ $t("Tax") }}</th>
                      <th scope="col">{{ $t("SubTotal") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detail in details">
                      <td>{{ detail.code }} ({{ detail.name }})</td>
                      <td>
                        {{ formatNumber(detail.Net_price, 2) }}
                        {{ currentUser.currency }}
                      </td>
                      <td>
                        {{ formatNumber(detail.quantity, 2) }}
                        {{ detail.unit_sale }}
                      </td>
                      <td>
                        {{ formatNumber(detail.price, 2) }}
                        {{ currentUser.currency }}
                      </td>
                      <td>
                        {{ formatNumber(detail.DiscountNet, 2) }}
                        {{ currentUser.currency }}
                      </td>
                      <td>
                        {{ formatNumber(detail.taxe, 2) }}
                        {{ currentUser.currency }}
                      </td>
                      <td>
                        {{ formatNumber(detail.total, 2) }}
                        {{ currentUser.currency }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-col>
            <div class="offset-md-9 col-md-3 mt-4">
              <table class="table table-striped table-sm">
                <tbody>
                  <tr>
                    <td>{{ $t("OrderTax") }}</td>
                    <td>
                      <span
                        >{{ formatNumber(sale.TaxNet, 2) }}
                        {{ currentUser.currency }} ({{
                          formatNumber(sale.tax_rate, 2)
                        }}
                        %)</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("Discount") }}</td>
                    <td>
                      {{ formatNumber(sale.discount, 2) }}
                      {{ currentUser.currency }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t("Shipping") }}</td>
                    <td>
                      {{ formatNumber(sale.shipping, 2) }}
                      {{ currentUser.currency }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-weight-bold">{{ $t("Total") }}</span>
                    </td>
                    <td>
                      <span class="font-weight-bold"
                        >{{ formatNumber(sale.GrandTotal, 2) }}
                        {{ currentUser.currency }}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-weight-bold">{{ $t("Paid") }}</span>
                    </td>
                    <td>
                      <span class="font-weight-bold"
                        >{{ formatNumber(sale.paid_amount, 2) }}
                        {{ currentUser.currency }}</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-weight-bold">{{ $t("Due") }}</span>
                    </td>
                    <td>
                      <span class="font-weight-bold"
                        >{{ formatNumber(sale.due, 2) }}
                        {{ currentUser.currency }}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-row>
        </div>
      </div>

<!-- 
  421
  210
  105
  53


  140


  421 - 100
  321 - 105
  216 - 40
  176 - 160
  16


421+50+40+160
 -->
      <!-- Modal Show Invoice-->
      <b-modal
        hide-footer
        size="lg"
        scrollable
        id="Show_invoiceF"
        :title="$t('Invoice')"
      >
        <vue-easy-print table-show ref="Show_invoiceF">
          <div id="invoice-POSF">
            <div class="container" style="height:671px">
              <div class="row" style="height:200px">
                <div class="col-9">
                  <div class="row">
                    <div class="info">
                      <h3></h3>
                    </div>
                  </div>
                  <div class="row"></div>
                  <div class="row">
                    <div class="col-3">
                    </div>
                    <div class="col-3">
                    </div>
                    <div class="col-3">
                    </div>
                    <div class="col-3">
                    </div>
                  </div>
                </div>
                <div class="col-3 rounded">
                  <span></span>
                </div>
              </div>
              <div class="row" style="height:105px">
                <div class="col-8">
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      {{ invoice_pos.sale.client_name }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      {{ invoice_pos.sale.client_adresse }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      {{ invoice_pos.sale.client_NIT }}
                    </div>
                  </div>
                  <!-- <div class="row">
                    <div class="col-4"></div>
                    <div class="col-8">
                      {{ sale.client_giro }}
                    </div>
                  </div> -->
                </div>
                <div class="col-4">
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4"></div>
                    <div class="col-4"></div>
                  </div>
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4"></div>
                    <div class="col-4">Efectivo</div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">{{ invoice_pos.sale.date }}</div>
                  </div>
                </div>
              </div>
              <div class="row" style="height:40px">
                <div class="col-1"></div>
                <div class="col-2"></div>
                <div class="col-5"></div>
                <div class="col-1"></div>
                <div class="col-1"></div>
                <div class="col-1"></div>
                <div class="col-1"></div>
              </div>
              <div class="row" style="height:400px" v-for="detail_invoice in invoice_pos.details">
                <div class="col-1">
                  {{ formatNumber(detail_invoice.quantity, 2) }}
                  {{ detail_invoice.unit_sale }}
                </div>
                <div class="col-2">{{ detail_invoice.code }}</div>
                <div class="col-6">{{ detail_invoice.name }}</div>
                <div class="col-1">
                  {{ formatNumber(detail_invoice.total, 2) }}
                </div>
                <div class="col-1"></div>
                <div class="col-1">
                  {{ formatNumber(detail_invoice.total, 2) }}
                </div>
              </div>
              <div class="row">
                <div class="col-10">
                  <div class="row rounded">
                    {{ GrandTotalText }}
                  </div>
                </div>
                <div class="col-2">
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">
                      {{
                        formatNumber(
                          invoice_pos.sale.GrandTotal - invoice_pos.sale.taxe,
                          2
                        )
                      }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">
                      {{ formatNumber(invoice_pos.sale.taxe, 2) }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">
                      {{ formatNumber(invoice_pos.sale.GrandTotal, 2) }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6"></div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6"></div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6"></div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">
                      {{ formatNumber(invoice_pos.sale.GrandTotal, 2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </vue-easy-print>
        <button @click="print_pos()" class="btn btn-outline-primary">
          <i class="i-Billing"></i>
          {{ $t("print") }}
        </button>
      </b-modal>
      <!-- Modal Show Invoice-->
      <b-modal
        hide-footer
        size="lg"
        scrollable
        id="Show_invoiceCCF"
        :title="$t('Invoice')"
      >
        <vue-easy-print table-show ref="Show_invoiceCCF">
          <div id="invoice-POSCCF">
            <div class="container" style="height:671px">
              <div class="row" style="height:150px">
                <div class="col-9">
                  <div class="row">
                    <div class="info">
                      <h3></h3>
                    </div>
                  </div>
                  <div class="row"></div>
                  <div class="row">
                    <div class="col-3">
                    </div>
                    <div class="col-3">
                    </div>
                    <div class="col-3">
                    </div>
                    <div class="col-3">
                    </div>
                  </div>
                </div>
                <div class="col-3 rounded">
                  <span></span>
                </div>
              </div>
              <div class="row" style="height:105px">
                <div class="col-8">
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      {{ invoice_pos.sale.client_name }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      {{ invoice_pos.sale.client_adresse }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6 padding-top padding-bottom">
                      {{ invoice_pos.sale.client_country }}
                    </div>
                    <div class="col-6 padding-top padding-bottom">
                      {{ invoice_pos.sale.client_city }}
                    </div>
                  </div>
                  </div>
                <div class="col-4">
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4"></div>
                    <div class="col-4"></div>
                  </div>
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4">{{ invoice_pos.sale.date }}</div>
                    <div class="col-4">Efectivo</div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">{{ invoice_pos.sale.client_NRC }}</div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">{{ invoice_pos.sale.client_NIT }}</div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">{{ sale.client_giro }}</div>
                  </div>
                </div>
              </div>
              <div class="row" style="height:80px">
                <div class="col-1"></div>
                <div class="col-2"></div>
                <div class="col-5"></div>
                <div class="col-1"></div>
                <div class="col-1"></div>
                <div class="col-1"></div>
                <div class="col-1"></div>
              </div>
              <div class="row" style="height:320px" v-for="detail_invoice in invoice_pos.details">
                <div class="col-1">
                  {{ formatNumber(detail_invoice.quantity, 2) }}
                  {{ detail_invoice.unit_sale }}
                </div>
                <div class="col-2">{{ detail_invoice.code }}</div>
                <div class="col-6">{{ detail_invoice.name }}</div>
                <div class="col-1">
                  {{ formatNumber(detail_invoice.total, 2) }}
                </div>
               <div class="col-1"></div>
                <div class="col-1">
                  {{ formatNumber(detail_invoice.total, 2) }}
                </div>
              </div>
              <div class="row">
                <div class="col-9">
                  <div class="row rounded">
                    {{ GrandTotalText }}
                  </div>
                </div>
                <div class="col-3">
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                      {{
                        formatNumber(
                          invoice_pos.sale.GrandTotal - invoice_pos.sale.taxe,
                          2
                        )
                      }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                      {{ formatNumber(invoice_pos.sale.taxe, 2) }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                      {{ formatNumber(invoice_pos.sale.GrandTotal, 2) }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4"></div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4"></div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4"></div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                      {{ formatNumber(invoice_pos.sale.GrandTotal, 2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </vue-easy-print>
        <button @click="print_pos()" class="btn btn-outline-primary">
          <i class="i-Billing"></i>
          {{ $t("print") }}
        </button>
      </b-modal>

      <!-- Modal Add Payment-->
      <validation-observer ref="Add_payment">
        <b-modal
          hide-footer
          size="lg"
          id="Add_Payment"
          :title="$t('AddPayment')"
        >
          <b-form @submit.prevent="Submit_Payment">
            <b-row>
              <b-col md="6">
                <b-row>
                  <!-- Amount  -->
                  <b-col lg="12" md="12" sm="12">
                    <validation-provider
                      name="Amount"
                      :rules="{ required: true, regex: /^\d*\.?\d*$/ }"
                      v-slot="validationContext"
                    >
                      <b-form-group :label="$t('Amount')">
                        <b-form-input
                          label="Amount"
                          :placeholder="$t('Amount')"
                          v-model="payment.amount"
                          :state="getValidationState(validationContext)"
                          aria-describedby="Amount-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="Amount-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>

                  <!-- Payment choice -->
                  <b-col lg="12" md="12" sm="12">
                    <validation-provider
                      name="Payment choice"
                      :rules="{ required: true }"
                    >
                      <b-form-group
                        slot-scope="{ valid, errors }"
                        :label="$t('Paymentchoice')"
                      >
                        <v-select
                          :class="{ 'is-invalid': !!errors.length }"
                          :state="errors[0] ? false : valid ? true : null"
                          v-model="payment.Reglement"
                          @input="Selected_PaymentMethod"
                          :reduce="(label) => label.value"
                          :placeholder="$t('PleaseSelect')"
                          :options="[
                            { label: 'Efectivo', value: 'Cash' },
                            {
                              label: 'Tarjeta de credito',
                              value: 'credit card',
                            },
                            {
                              label: 'Transferencia Bancaria',
                              value: 'bank transfer',
                            },
                          ]"
                        ></v-select>
                        <b-form-invalid-feedback>{{
                          errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>

                  <b-col md="12" v-if="payment.Reglement == 'credit card'">
                    <validation-provider
                      name="RefCreditCard"
                      :rules="{ required: true, regex: /^\d*\.?\d*$/ }"
                      v-slot="validationContext"
                    >
                      <b-form-group :label="$t('RefCreditCa')">
                        <b-form-input
                          :state="getValidationState(validationContext)"
                          label="RefCreditCar"
                          :placeholder="$t('RefCreditCar')"
                          v-model="sale.RefCreditCard"
                          aria-describedby="RefCreditCard-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="RefCreditCard-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <b-col md="12" v-if="payment.Reglement == 'bank transfer'">
                    <validation-provider
                      name="RefTransfer"
                      :rules="{ required: true, regex: /^\d*\.?\d*$/ }"
                      v-slot="validationContext"
                    >
                      <b-form-group :label="$t('RefTransfer')">
                        <b-form-input
                          :state="getValidationState(validationContext)"
                          label="RefTransfer"
                          :placeholder="$t('RefTransfer')"
                          v-model="sale.RefTransfer"
                          aria-describedby="RefTransfer-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="RefTransfer-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>
                  <!-- cash  -->
                  <b-col lg="12" md="12" sm="12">
                    <validation-provider
                      name="Cash"
                      :rules="{ required: true, regex: /^\d*\.?\d*$/ }"
                      v-slot="validationContext"
                    >
                      <b-form-group :label="$t('Cash')">
                        <b-form-input
                          :state="getValidationState(validationContext)"
                          label="Cash"
                          :placeholder="$t('Cash')"
                          v-model="payment.cash"
                          @keyup="keyup_Change()"
                          aria-describedby="Cash-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="Cash-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>

                  <!-- Amount_Change  -->
                  <b-col lg="12" md="12" sm="12">
                    <validation-provider
                      name="Change"
                      :rules="{ required: true, regex: /^\d*\.?\d*$/ }"
                      v-slot="validationContext"
                    >
                      <b-form-group :label="$t('Change')">
                        <b-form-input
                          label="Change"
                          :placeholder="$t('Change')"
                          v-model="payment.change"
                          :state="getValidationState(validationContext)"
                          aria-describedby="Change-feedback"
                        ></b-form-input>
                        <b-form-invalid-feedback id="Change-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </b-col>

                  <!-- Note -->
                  <b-col lg="12" md="12" sm="12" class="mt-2">
                    <b-form-group :label="$t('Note')">
                      <b-form-textarea
                        id="textarea"
                        v-model="payment.notes"
                        rows="3"
                        max-rows="6"
                      ></b-form-textarea>
                    </b-form-group>
                  </b-col>

                  <b-col lg="12" md="12" sm="12" class="mt-2">
                    <b-form-group
                      :label="$t('BillingMethod')"
                      v-slot="{ ariaDescribedby }"
                    >
                      <b-form-radio
                        v-model="BillingMethod"
                        :aria-describedby="ariaDescribedby"
                        name="factura"
                        value="0"
                        >Factura</b-form-radio
                      >
                      <b-form-radio
                        v-model="BillingMethod"
                        :aria-describedby="ariaDescribedby"
                        name="ticket"
                        value="1"
                        >CCF</b-form-radio
                      >
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>

              <b-col md="6">
                <b-card>
                  <b-list-group>
                    <b-list-group-item
                      class="d-flex justify-content-between align-items-center"
                    >
                      {{ $t("TotalProducts") }}
                      <b-badge variant="primary" pill>{{
                        details.length
                      }}</b-badge>
                    </b-list-group-item>

                    <b-list-group-item
                      class="d-flex justify-content-between align-items-center"
                    >
                      {{ $t("OrderTax") }}
                      <span class="font-weight-bold"
                        >{{ formatNumber(sale.TaxNet, 2) }}
                        {{ currentUser.currency }} ({{ sale.tax_rate }} %)</span
                      >
                    </b-list-group-item>
                    <b-list-group-item
                      class="d-flex justify-content-between align-items-center"
                    >
                      {{ $t("Discount") }}
                      <span class="font-weight-bold"
                        >{{ formatNumber(sale.discount, 2) }}
                        {{ currentUser.currency }}</span
                      >
                    </b-list-group-item>

                    <b-list-group-item
                      class="d-flex justify-content-between align-items-center"
                    >
                      {{ $t("Shipping") }}
                      <span class="font-weight-bold"
                        >{{ formatNumber(sale.shipping, 2) }}
                        {{ currentUser.currency }}</span
                      >
                    </b-list-group-item>

                    <b-list-group-item
                      class="d-flex justify-content-between align-items-center"
                    >
                      {{ $t("Total") }}
                      <span class="font-weight-bold"
                        >{{ formatNumber(GrandTotal, 2) }}
                        {{ currentUser.currency }}</span
                      >
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-col>

              <b-col md="12" class="mt-3">
                <b-button
                  variant="primary"
                  type="submit"
                  :disabled="paymentProcessing"
                  >{{ $t("submit") }}</b-button
                >
                <div v-once class="typo__p" v-if="paymentProcessing">
                  <div class="spinner sm spinner-primary mt-3"></div>
                </div>
              </b-col>
            </b-row>
          </b-form>
        </b-modal>
      </validation-observer>
    </b-row>
  </div>
</template>

<script>
import NProgress from "nprogress";
import { mapActions, mapGetters } from "vuex";
import vueEasyPrint from "vue-easy-print";
import VueBarcode from "vue-barcode";
import FlagIcon from "vue-flag-icon";
import Util from "../../../../utils";

export default {
  components: {
    vueEasyPrint,
    barcode: VueBarcode,
    FlagIcon,
  },
  metaInfo: {
    title: "CHECKIN",
  },
  data() {
    return {
      paymentProcessing: false,
      payment: {
        amount: "",
        Reglement: "",
        notes: "",
        cash: 0,
        change: 0,
      },
      variants: [],
      company: {},
      email: {
        to: "",
        subject: "",
        message: "",
        client_name: "",
        Sale_Ref: "",
      },
      isLoading: true,
      BillingMethod: 0,
      GrandTotal: 0,
      GrandTotalText: "",
      total: 0,
      Ref: "",
      clients: [],
      warehouses: [],
      products: [],
      details: [],
      detail: {},
      product_currentPage: 1,
      paginated_Products: "",
      product_perPage: 8,
      product_totalRows: "",
      barcodeFormat: "CODE128",
      invoice_pos: {
        symbol: "",
        sale: {
          Ref: "",
          client_name: "",
          client_adresse: "",
          client_country: "",
          client_city: "",
          discount: "",
          taxe: "",
          date: "",
          tax_rate: 13,
          shipping: "",
          GrandTotal: "",
          RefTransfer: "",
          RefCreditCard: "",
          type_invoice: "",
          refInvoice: "",
        },
        details: [],
        setting: {
          logo: "",
          CompanyName: "",
          CompanyAdress: "",
          email: "",
          CompanyPhone: "",
        },
      },

      sale: {
        warehouse_id: "",
        client_id: "",
        tax_rate: 13,
        shipping: 0,
        discount: 0,
        TaxNet: 0,
        type_invoice: "",
        RefTransfer: "",
        RefCreditCard: "",
        refInvoice: "",
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
        giro: "",
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
      },
    };
  },

  computed: {
    ...mapGetters(["currentUser"]),
  },
  methods: {
    ...mapActions(["changeThemeMode", "logout"]),
    ...mapGetters(["currentUser"]),
    logoutUser() {
      this.$store.dispatch("logout");
    },
    //----------------------------------- Get Details Sale ------------------------------\\
    Get_Details() {
      let id = this.$route.params.id;
      axios
        .get(`sales/${id}`)
        .then((response) => {
          this.sale = response.data.sale;
          this.details = response.data.details;
          this.company = response.data.company;
          this.isLoading = false;
          this.GrandTotal = this.formatNumber(this.sale.GrandTotal, 2);
          this.payment.amount = this.formatNumber(this.sale.GrandTotal, 2);
          this.payment.Reglement = "Cash";
        })
        .catch((response) => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },
    Check_in() {
      NProgress.start();
      NProgress.set(0.1);
      this.payment.amount = this.formatNumber(this.GrandTotal, 2);
      this.payment.cash = this.formatNumber(this.GrandTotal, 2);
      Fire.$emit("pay_now");
    },

    //---------------------- Event Select Payment Method ------------------------------\\

    Selected_PaymentMethod(value) {
      if (value == "credit card") {
        setTimeout(() => {
          this.loadStripe_payment();
        }, 500);
      }
    },

    logoutUser() {
      this.logout();
    },

    back() {
      this.$router.push({ name: "index_sales_pay" });
    },
    //------ Validate Form Submit_Payment
    Submit_Payment() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      this.$refs.Add_payment.validate().then((success) => {
        if (!success) {
          // Complete the animation of theprogress bar.
          NProgress.done();
          this.makeToast(
            "danger",
            this.$t("Please_fill_the_form_correctly"),
            this.$t("Failed")
          );
        } else {
          this.CreatePOS();
        }
      });
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
        solid: true,
      });
    },
    //-------------------- print invoice Pos
    print_pos() {
      if (this.invoice_pos.sale.type_invoice == "CF") {
        this.$refs.Show_invoiceF.print();
      } else {
        this.$refs.Show_invoiceCCF.print();
      }
    },

    //-------------------------------- Invoice POS ------------------------------\\
    Invoice_POS() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      let id = this.$route.params.id;
      axios
        .get("Sales/Print_Invoice/" + id)
        .then((response) => {
          this.invoice_pos = response.data;
          this.GrandTotalText = Util.numeroALetras(
            this.formatNumber(this.invoice_pos.sale.GrandTotal, 2)
          );
          setTimeout(() => {
            // Complete the animation of the  progress bar.
            NProgress.done();
            this.$bvModal.show("Show_invoiceF");

            if (this.invoice_pos.sale.type_invoice == "CF") {
              this.$bvModal.show("Show_invoiceF");
            } else {
              this.$bvModal.show("Show_invoiceCCF");
            }
          }, 500);
          setTimeout(() => this.print_pos(), 1000);
        })
        .catch(() => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
        });
    },

    //----------------------------------Create POS ------------------------------\\
    CreatePOS() {
      NProgress.start();
      NProgress.set(0.1);
      this.payment.amount = this.formatNumber(this.sale.GrandTotal, 2);
      if (this.payment.Reglement == "") {
        this.payment.Reglement = "Cash";
      }
      let id = this.$route.params.id;
      axios
        .put(`sales/update_to_payment/${id}`, {
          notes: this.payment.notes,
          tax_rate: this.sale.tax_rate,
          TaxNet: this.sale.taxe,
          discount: this.sale.discount,
          change: this.payment.change,
          Reglement: this.payment.Reglement,
          cash: this.payment.cash,
          shipping: this.sale.shipping,
          GrandTotal: this.payment.amount,
          RefTransfer: this.sale.RefTransfer,
          RefCreditCard: this.sale.RefCreditCard,
          type_invoice: this.BillingMethod == 0 ? "CF" : "CCF",
          GrandTotal: this.payment.amount,
          statut: "pending",
        })
        .then((response) => {
          if (response.data.success === true) {
            // Complete the animation of theprogress bar.
            NProgress.done();
            this.makeToast(
              "success",
              this.$t("Update.TitleSale"),
              this.$t("Success")
            );
            this.Invoice_POS();
            this.Get_Details();
            this.$bvModal.hide("Add_Payment");
          }
        })
        .catch((error) => {
          // Complete the animation of theprogress bar.
          NProgress.done();
          this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
        });
    },
    //  CreatePOS() {
    //   // Start the progress bar.
    //   this.payment.amount = this.formatNumber(this.sale.GrandTotal, 2);
    //   if (this.payment.Reglement == "") {
    //     this.payment.Reglement = "Cash";
    //   }
    //   NProgress.start();
    //   NProgress.set(0.1);
    //   let id = this.$route.params.id;
    //   axios
    //     .put(`sales/update_to_payment/${id}`, {
    //       notes: this.payment.notes,
    //       tax_rate: this.sale.tax_rate,
    //       TaxNet: this.sale.taxe,
    //       discount: this.sale.discount,
    //       change: this.payment.change,
    //       Reglement: this.payment.Reglement,
    //       cash: this.payment.cash,
    //       shipping: this.sale.shipping,
    //       GrandTotal: this.payment.amount,
    //       statut: "pending",
    //     })
    //     .then((response) => {
    //        if (response.data.success === true) {
    //           // Complete the animation of theprogress bar.
    //             NProgress.done();
    //           this.makeToast(
    //         "success",
    //         this.$t("Update.TitleSale"),
    //         this.$t("Success")
    //       );
    //           this.Invoice_POS(id);
    //           this.$bvModal.hide("Add_Payment");
    //           this.$router.push({ name: "index_sales_pay" });

    //         }
    //     })
    //     .catch((error) => {
    //       NProgress.done();
    //       this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
    //     });
    // },

    //------------------------------Formetted Numbers -------------------------\\
    formatNumber(number, dec) {
      const value = (
        typeof number === "string" ? number : number.toString()
      ).split(".");
      if (dec <= 0) return value[0];
      let formated = value[1] || "";
      if (formated.length > dec)
        return `${value[0]}.${formated.substr(0, dec)}`;
      while (formated.length < dec) formated += "0";
      return `${value[0]}.${formated}`;
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
    keyup_Change() {
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
  },

  //-------------------- Created Function -----\\

  created() {
    this.Get_Details();
    Fire.$on("pay_now", () => {
      setTimeout(() => {
        this.payment.amount = this.formatNumber(this.GrandTotal, 2);
        this.payment.cash = this.formatNumber(this.GrandTotal, 2);
        this.payment.Reglement = "Cash";
        this.$bvModal.show("Add_Payment");
        // Complete the animation of theprogress bar.
        NProgress.done();
      }, 500);
    });
  },
};
</script>
