<template>
  <div class="main-content">
    <breadcumb :page="$t('SaleDetail')" :folder="$t('Sales')"/>
    <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>

    <b-card v-if="!isLoading">
      <b-row>
        <b-col md="12" class="mb-5">
          <button @click="Sale_PDF()" class="btn btn-primary btn-icon ripple btn-sm">
            <i class="i-File-TXT"></i>
            PDF
          </button>
          <button @click="print()" class="btn btn-warning btn-icon ripple btn-sm">
            <i class="i-Billing"></i>
            {{$t('print')}}
          </button>
          <button @click="Check_in()" class="btn btn-success btn-icon ripple btn-sm">
            {{$t('Checkin')}}
          </button>
        </b-col>
          <!-- Modal Add Payment-->
        <validation-observer ref="Add_payment">
          <b-modal hide-footer size="lg" id="Add_Payment" :title="$t('AddPayment')">
            <b-form @submit.prevent="Submit_Payment">
              <b-row>
                <b-col md="6">
                  <b-row>
                    <!-- Amount  -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider
                        name="Amount"
                        :rules="{ required: true , regex: /^\d*\.?\d*$/}"
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
                          <b-form-invalid-feedback
                            id="Amount-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    

                    <!-- Payment choice -->
                    <b-col lg="12" md="12" sm="12">
                      <validation-provider name="Payment choice" :rules="{ required: true}">
                        <b-form-group slot-scope="{ valid, errors }" :label="$t('Paymentchoice')">
                          <v-select
                            :class="{'is-invalid': !!errors.length}"
                            :state="errors[0] ? false : (valid ? true : null)"
                            v-model="payment.Reglement"
                            @input="Selected_PaymentMethod"
                            :reduce="label => label.value"
                            :placeholder="$t('PleaseSelect')"
                            :options="
                              [
                              {label: 'Cash', value: 'Cash'},
                              {label: 'credit card', value: 'credit card'},
                              {label: 'bank transfer', value: 'bank transfer'},
                              ]"
                          ></v-select>
                          <b-form-invalid-feedback>{{ errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>

                     <b-col
                      md="12"
                      v-if="payment.Reglement == 'credit card'"
                    >
                      <form id="payment-form">
                        <label
                          for="card-element"
                          class="leading-7 text-sm text-gray-600"
                        >{{$t('Credit_Card_Info')}}</label>
                        <div id="card-element">
                          <!-- Elements will create input elements here -->
                        </div>
                        <!-- We'll put the error messages in this element -->
                        <div id="card-errors" class="is-invalid" role="alert"></div>
                      </form>
                    </b-col>
                     <!-- cash  -->
                     <b-col lg="12" md="12" sm="12">
                      <validation-provider
                        name="Cash"
                        :rules="{ required: true , regex: /^\d*\.?\d*$/}"
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
                          <b-form-invalid-feedback
                            id="Cash-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </b-col>
                    
                     <!-- Amount_Change  -->
                     <b-col lg="12" md="12" sm="12">
                      <validation-provider
                        name="Change"
                        :rules="{ required: true , regex: /^\d*\.?\d*$/}"
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
                          <b-form-invalid-feedback
                            id="Change-feedback"
                          >{{ validationContext.errors[0] }}</b-form-invalid-feedback>
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
                      <b-form-group :label="$t('BillingMethod')" v-slot="{ ariaDescribedby }">
                      <b-form-radio v-model="BillingMethod" :aria-describedby="ariaDescribedby" name="factura" value="0">Factura</b-form-radio>
                      <b-form-radio v-model="BillingMethod" :aria-describedby="ariaDescribedby" name="ccf" value="1">CCF</b-form-radio>
                      <b-form-radio v-model="BillingMethod" :aria-describedby="ariaDescribedby" name="ticket" value="2">Ticket</b-form-radio>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>


                <b-col md="6">
                  <b-card>
                    <b-list-group>
                      <b-list-group-item class="d-flex justify-content-between align-items-center">
                        {{$t('TotalProducts')}}
                        <b-badge variant="primary" pill>{{details.length}}</b-badge>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex justify-content-between align-items-center">
                        {{$t('OrderTax')}}
                        <span
                          class="font-weight-bold"
                        >{{formatNumber(sale.TaxNet , 2)}} {{currentUser.currency}} ({{sale.tax_rate}} %)</span>
                      </b-list-group-item>
                      <b-list-group-item class="d-flex justify-content-between align-items-center">
                        {{$t('Discount')}}
                        <span
                          class="font-weight-bold"
                        >{{formatNumber(sale.discount, 2)}} {{currentUser.currency}}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex justify-content-between align-items-center">
                        {{$t('Shipping')}}
                        <span
                          class="font-weight-bold"
                        >{{formatNumber(sale.shipping ,2)}} {{currentUser.currency}}</span>
                      </b-list-group-item>

                      <b-list-group-item class="d-flex justify-content-between align-items-center">
                        {{$t('Total')}}
                        <span
                          class="font-weight-bold"
                        >{{formatNumber(GrandTotal ,2)}} {{currentUser.currency}}</span>
                      </b-list-group-item>
                    </b-list-group>
                  </b-card>
                </b-col>

                <b-col md="12" class="mt-3">
                  <b-button variant="primary" type="submit"  :disabled="paymentProcessing">{{$t('submit')}}</b-button>
                    <div v-once class="typo__p" v-if="paymentProcessing">
                      <div class="spinner sm spinner-primary mt-3"></div>
                    </div>
                </b-col>
              </b-row>
            </b-form>
          </b-modal>
        </validation-observer>
        <!-- Modal Show Invoice-->
        <b-modal hide-footer size="lg" scrollable id="Show_invoiceF" :title="$t('Invoice')">
          <vue-easy-print table-show ref="Show_invoiceF">
            <div id="invoice-POSF">

              <div class="container">
                <div class="row">
                  <div class="col-9">
                    <div class="row">
                      <div class="info">
                        <h3>{{invoice_pos.setting.CompanyName}}</h3>
                      </div>
                    </div>
                    <div class="row">
                    </div>
                    <div class="row">
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-3 border border-danger rounded">
                    <span class="text-danger">Factura comercial</span>
                    <span class="text-danger">we323988</span>
                    <h2 class="text-danger">N° 0047755</h2><span>8785</span>
                    <span class="text-danger">NIT: we323988</span>
                    <span class="text-danger">N.R.C: we323988</span>
                  </div>
                </div>
                <div class="row ">
                  <div class="col-8  border border-primary"> 
                    <div class="row">
                      <div class="col-12 border border-primary padding-top padding-bottom"> 
                        {{invoice_pos.sale.client_name}}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 border border-primary"> 
                      </div>
                      <div class="col-8 border border-primary"> 
                        {{sale.client_giro}}
                      </div>
                    </div>
                  </div>
                  <div class="col-4 border border-primary">
                    <div class="row">
                      <div class="col-4 border border-primary">Vendedor</div>
                      <div class="col-4 border border-primary">{{$t('date')}}</div>
                      <div class="col-4 border border-primary">Forma de pago</div>
                    </div>
                    <div class="row">
                      <div class="col-4 border border-primary">{{currentUser.username}}</div>
                      <div class="col-4 border border-primary">{{invoice_pos.sale.date}}</div>
                      <div class="col-4 border border-primary">Efectivo</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary">{{sale.client_NIT}}</div>
                      <div class="col-6 border border-primary">{{sale.client_NRC}}</div>
                    </div>
                  </div>
                </div>
                <div class="row rounded">
                  <div class="col-1 border border-primary"></div>
                  <div class="col-2 border border-primary"></div>
                  <div class="col-5 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                </div>
                <div class="row"  v-for="detail_invoice in invoice_pos.details">
                  <div class="col-1 border border-primary">{{formatNumber(detail_invoice.quantity,2)}} {{detail_invoice.unit_sale}}</div>
                  <div class="col-2 border border-primary">{{detail_invoice.code}}</div>
                  <div class="col-5 border border-primary">{{detail_invoice.name}}</div>
                  <div class="col-1 border border-primary">{{formatNumber(detail_invoice.total,2)}}</div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary">{{formatNumber(detail_invoice.total,2)}}</div>
                </div>
                <div class="row">
                  <div class="col-9 border border-primary">
                    <div class="row rounded">
                       {{GrandTotalText}}
                    </div>
                  </div>
                  <div class="col-3 border border-primary">
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.GrandTotal - invoice_pos.sale.taxe,2)}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.taxe,2)}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.GrandTotal,2)}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary"></div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary"></div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary"></div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.GrandTotal,2)}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-easy-print>
          <button @click="print_pos()" class="btn btn-outline-primary">
            <i class="i-Billing"></i>
            {{$t('print')}}
          </button>
        </b-modal>
        <!-- Modal Show Invoice CCF-->
        <b-modal hide-footer size="lg" scrollable id="Show_invoiceCCF" :title="$t('Invoice')">
          <vue-easy-print table-show ref="Show_invoiceCCF">
            <div id="invoice-POSF">
              

              <div class="container">
                <div class="row">
                  <div class="col-9">
                    <div class="row">
                      <div class="info">
                        <h3>{{invoice_pos.setting.CompanyName}}</h3>
                      </div>
                    </div>
                    <div class="row">
                      
                    </div>
                    <div class="row">
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div class="col-3">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                  <div class="col-3 border border-danger rounded">
                    <span class="text-danger">Comprobante de credito fiscal</span>
                    <span class="text-danger">we323988</span>
                    <h2 class="text-danger">N° 0047755</h2><span>8785</span>
                    <span class="text-danger">NIT: we323988</span>
                    <span class="text-danger">N.R.C: we323988</span>
                  </div>
                </div>
                <div class="row ">
                  <div class="col-8  border border-primary"> 
                    <div class="row">
                      <div class="col-12 border border-primary padding-top padding-bottom"> 
                        {{invoice_pos.sale.client_name}}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 border border-primary"> 
               
                      </div>
                      <div class="col-8 border border-primary"> 
                        {{sale.client_giro}}
                      </div>
                    </div>
                  </div>
                  <div class="col-4 border border-primary">
                    <div class="row">
                      <div class="col-4 border border-primary"></div>
                      <div class="col-4 border border-primary">{{$t('date')}}</div>
                      <div class="col-4 border border-primary"></div>
                    </div>
                    <div class="row">
                      <div class="col-4 border border-primary">{{currentUser.username}}</div>
                      <div class="col-4 border border-primary">{{invoice_pos.sale.date}}</div>
                      <div class="col-4 border border-primary">Efectivo</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary">{{sale.client_NIT}}</div>
                      <div class="col-6 border border-primary">{{sale.client_NRC}}</div>
                    </div>
                  </div>
                </div>
                <div class="row rounded">
                  <div class="col-1 border border-primary"></div>
                  <div class="col-2 border border-primary"></div>
                  <div class="col-5 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                </div>
                <div class="row"  v-for="detail_invoice in invoice_pos.details">
                  <div class="col-1 border border-primary">{{formatNumber(detail_invoice.quantity,2)}} {{detail_invoice.unit_sale}}</div>
                  <div class="col-2 border border-primary">{{detail_invoice.code}}</div>
                  <div class="col-5 border border-primary">{{detail_invoice.name}}</div>
                  <div class="col-1 border border-primary">{{formatNumber(detail_invoice.total,2)}}</div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary"></div>
                  <div class="col-1 border border-primary">{{formatNumber(detail_invoice.total,2)}}</div>
                </div>
                <div class="row">
                  <div class="col-9 border border-primary">
                    <div class="row rounded">
                         {{GrandTotalText}}
                    </div>
                  </div>
                  <div class="col-3 border border-primary">
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.GrandTotal - invoice_pos.sale.taxe,2)}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.taxe,2)}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.GrandTotal,2)}}</div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary"></div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary"></div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary"></div>
                    </div>
                    <div class="row">
                      <div class="col-6 border border-primary"></div>
                      <div class="col-6 border border-primary">{{formatNumber(invoice_pos.sale.GrandTotal,2)}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-easy-print>
          <button @click="print_pos()" class="btn btn-outline-primary">
            <i class="i-Billing"></i>
            {{$t('print')}}
          </button>
        </b-modal>
      </b-row>
      <div class="invoice" id="print_Invoice">
        <div class="invoice-print">
          <b-row class="justify-content-md-center">
            <h4 class="font-weight-bold">{{$t('SaleDetail')}} : {{sale.Ref}}</h4>
          </b-row>
          <hr>
          <b-row class="mt-5">
            <b-col lg="4" md="4" sm="12" class="mb-4">
              <h5 class="font-weight-bold">{{$t('Customer_Info')}}</h5>
              <div>{{sale.client_name}}</div>
              <div>{{sale.client_email}}</div>
              <div>{{sale.client_phone}}</div>
              <div>{{sale.client_adr}}</div>
              <div>{{sale.client_NIT}}</div>
              <div>{{sale.client_NRC}}</div>
              <div>{{sale.client_giro}}</div>
              
            </b-col>
            <b-col lg="4" md="4" sm="12" class="mb-4">
              <h5 class="font-weight-bold">{{$t('Company_Info')}}</h5>
              <div>{{company.CompanyName}}</div>
              <div>{{company.email}}</div>
              <div>{{company.CompanyPhone}}</div>
              <div>{{company.CompanyAdress}}</div>
            </b-col>
            <b-col lg="4" md="4" sm="12" class="mb-4">
              <h5 class="font-weight-bold">{{$t('Invoice_Info')}}</h5>
              <div>{{$t('Reference')}} : {{sale.Ref}}</div>
              <div>
                {{$t('PaymentStatus')}} :
                <span
                  v-if="sale.payment_status == 'paid'"
                  class="badge badge-outline-success"
                >{{$t('Paid')}}</span>
                <span
                  v-else-if="sale.payment_status == 'partial'"
                  class="badge badge-outline-primary"
                >{{$t('partial')}}</span>
                <span v-else class="badge badge-outline-warning">{{$t('Unpaid')}}</span>
              </div>
              <div>{{$t('warehouse')}} : {{sale.warehouse}}</div>
              <div>
                {{$t('Status')}} :
                <span
                  v-if="sale.statut == 'completed'"
                  class="badge badge-outline-success"
                >{{$t('complete')}}</span>
                <span
                  v-else-if="sale.statut == 'pending'"
                  class="badge badge-outline-info"
                >{{$t('Pending')}}</span>
                <span v-else class="badge badge-outline-warning">{{$t('Ordered')}}</span>
              </div>
            </b-col>
          </b-row>
          <b-row class="mt-3">
            <b-col md="12">
              <h5 class="font-weight-bold">{{$t('Order_Summary')}}</h5>
              <div class="table-responsive">
                <table class="table table-hover table-md">
                  <thead class="bg-gray-300">
                    <tr>
                      <th scope="col">{{$t('ProductName')}}</th>
                      <th scope="col">{{$t('Net_Unit_Price')}}</th>
                      <th scope="col">{{$t('Quantity')}}</th>
                      <th scope="col">{{$t('UnitPrice')}}</th>
                      <th scope="col">{{$t('Discount')}}</th>
                      <th scope="col">{{$t('Tax')}}</th>
                      <th scope="col">{{$t('SubTotal')}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detail in details">
                      <td>{{detail.code}} ({{detail.name}})</td>
                      <td>{{formatNumber(detail.Net_price,2)}} {{currentUser.currency}}</td>
                      <td>{{formatNumber(detail.quantity,2)}} {{detail.unit_sale}}</td>
                      <td>{{formatNumber(detail.price,2)}} {{currentUser.currency}}</td>
                      <td>{{formatNumber(detail.DiscountNet,2)}} {{currentUser.currency}}</td>
                      <td>{{formatNumber(detail.taxe,2)}} {{currentUser.currency}}</td>
                      <td>{{formatNumber(detail.total ,2)}} {{currentUser.currency}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </b-col>
            <div class="offset-md-9 col-md-3 mt-4">
              <table class="table table-striped table-sm">
                <tbody>
                  <tr>
                    <td>{{$t('OrderTax')}}</td>
                    <td>
                      <span>{{formatNumber(sale.TaxNet,2)}} {{currentUser.currency}} ({{formatNumber(sale.tax_rate,2)}} %)</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{{$t('Discount')}}</td>
                    <td>{{formatNumber(sale.discount,2)}} {{currentUser.currency}}</td>
                  </tr>
                  <tr>
                    <td>{{$t('Shipping')}}</td>
                    <td>{{formatNumber(sale.shipping,2)}} {{currentUser.currency}}</td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-weight-bold">{{$t('Total')}}</span>
                    </td>
                    <td>
                      <span
                        class="font-weight-bold"
                      >{{formatNumber(sale.GrandTotal,2)}} {{currentUser.currency}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-weight-bold">{{$t('Paid')}}</span>
                    </td>
                    <td>
                      <span
                        class="font-weight-bold"
                      >{{formatNumber(sale.paid_amount,2)}} {{currentUser.currency}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="font-weight-bold">{{$t('Due')}}</span>
                    </td>
                    <td>
                      <span
                        class="font-weight-bold"
                      >{{formatNumber(sale.due ,2)}} {{currentUser.currency}}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-row>
        </div>
      </div>
        
  
    </b-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NProgress from "nprogress";

export default {
  computed: mapGetters(["currentUserPermissions", "currentUser"]),
  metaInfo: {
    title: "Detail Sale"
  },

  data() {
    return {
      paymentProcessing: false,

      isLoading: true,
      GrandTotal:0,
      BillingMethod:0,
      sale: {},
      details: [],
      variants: [],
      company: {},
      payment: {
        amount: "",
        Reglement: "",
        notes: "",
        cash: 0,
        change: 0
      },
      sale: {
        warehouse_id: "",
        client_id: "",
        tax_rate: 13,
        shipping: 0,
        discount: 0,
        TaxNet: 0
      },
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
    };
  },

  methods: {
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
    //---Validate State Fields
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    //------------------------------ Print -------------------------\\
    print() {
      var divContents = document.getElementById("print_Invoice").innerHTML;
      var a = window.open("", "", "height=500, width=500");
      a.document.write(
        '<link rel="stylesheet" href="/setup/css/bootstrap.css"><html>'
      );
      a.document.write("<body >");
      a.document.write(divContents);
      a.document.write("</body></html>");
      a.document.close();
      a.print();
    },
    //----------------------------------- Invoice Sale PDF  -------------------------\\
    Sale_PDF() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      let id = this.$route.params.id;
      axios({
        url: `Sale_PDF/${id}`,
        method: "GET",
        responseType: "blob" // important
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Sale_" + this.sale.Ref + ".pdf");
          document.body.appendChild(link);
          link.click();
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
        })
        .catch(() => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
        });
    },
     //------ Toast
    makeToast(variant, msg, title) {
      this.$root.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true
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
    //----------------------------------- Get Details Sale ------------------------------\\
    Get_Details() {
      let id = this.$route.params.id;
      axios
        .get(`sales/${id}`)
        .then(response => {
          this.sale = response.data.sale;
          this.details = response.data.details;
          this.company = response.data.company;
          this.isLoading = false;
          this.GrandTotal = this.formatNumber(this.sale.GrandTotal , 2);
          this.payment.amount = this.formatNumber(this.sale.GrandTotal , 2);
          this.payment.Reglement = "Cash";
        })
        .catch(response => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },
    Check_in(){
      this.payment.amount = this.formatNumber(this.GrandTotal , 2);
        this.payment.cash = this.formatNumber(this.GrandTotal , 2);
        this.payment.Reglement = "Cash";
        this.$bvModal.show("Add_Payment");
        // Complete the animation of theprogress bar.
        // NProgress.done();
    },
    //---------------------- Event Select Payment Method ------------------------------\\
    Selected_PaymentMethod(value) {
      if (value == "credit card") {
        setTimeout(() => {
          // this.loadStripe_payment();
        }, 500);
      }
    },
     //------ Validate Form Submit_Payment
    Submit_Payment() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      this.$refs.Add_payment.validate().then(success => {
        if (!success) {
          // Complete the animation of theprogress bar.
          NProgress.done();
          this.makeToast(
            "danger",
            this.$t("Please_fill_the_form_correctly"),
            this.$t("Failed")
          );
        } else {
          this.Update_Sale();
        }
      });
    },
    print_pos() {
      this.$refs.Show_invoiceF.print();
    },
    //-------------------------------- Invoice POS ------------------------------\\
    Invoice_POS(id) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios
        .get("Sales/Print_Invoice/" + id)
        .then(response => {
          this.invoice_pos = response.data;
          this.GrandTotalText= Util.numeroALetras(this.formatNumber(this.invoice_pos.sale.GrandTotal , 2));
          setTimeout(() => {
            // Complete the animation of the  progress bar.
            NProgress.done();
            if(this.BillingMethod  == 0){
              this.$bvModal.show("Show_invoiceF");
            }else if(this.BillingMethod  == 1){
              this.$bvModal.show("Show_invoiceF");
            }{
              this.$bvModal.show("Show_invoice");

            }
          }, 500);
          setTimeout(() => this.print_pos(), 1000);
        })
        .catch(() => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
        });
    },
    Update_Sale() {
        // Start the progress bar.
        this.payment.amount = this.formatNumber(this.sale.GrandTotal , 2);
        this.payment.Reglement = "Cash";
        NProgress.start();
        NProgress.set(0.1);
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
            statut: 'pending',
          }).then(response => {
            this.makeToast(
              "success",
              this.$t("Update.TitleSale"),
              this.$t("Success")
            );
            NProgress.done();
            this.Invoice_POS(this.$route.params.id);
            this.$bvModal.hide("Add_Payment");
            this.$router.push({ name: "index_sales_pay" });
          })
          .catch(error => {
            NProgress.done();
            this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
          });
    },
    //----------------------------------Process Payment ------------------------------\\
    async processPayment() {
      this.paymentProcessing = true;

      const { token, error } = await this.stripe.createToken(
        this.cardElement
      );

          if (error) {
              this.paymentProcessing = false;
               NProgress.done();
              this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
          } else {
   
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
          token : token.id,
        })
        .then(response => {
          this.paymentProcessing = false;
          if (response.data.success === true) {
            // Complete the animation of theprogress bar.
            NProgress.done();
            this.Invoice_POS(response.data.id);
            this.$bvModal.hide("Add_Payment");
            this.Reset_Pos();
          }
        })
        .catch(error => {
          this.paymentProcessing = false;
          // Complete the animation of theprogress bar.
          NProgress.done();
          this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
        });
    }
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
  }, //end Methods
  //----------------------------- Created function-------------------
  created: function() {
    this.Get_Details();
  }
};
</script>