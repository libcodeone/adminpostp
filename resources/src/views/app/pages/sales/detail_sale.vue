<template>
  <div class="main-content">
    <breadcumb :page="$t('SaleDetail')" :folder="$t('Sales')"/>
    <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>
    <b-card v-if="!isLoading">
      <b-row>
        <b-col md="12" class="mb-5">
          <router-link
            v-if="currentUserPermissions && currentUserPermissions.includes('Sales_edit')"
            title="Edit"
            class="btn btn-success btn-icon ripple btn-sm"
            :to="{ name:'edit_sale', params: { id: $route.params.id } }"
          >
            <i class="i-Edit"></i>
            <span>{{$t('EditSale')}}</span>
          </router-link>
          <button @click="Sale_Email()" class="btn btn-info btn-icon ripple btn-sm">
            <i class="i-Envelope-2"></i>
            {{$t('Email')}}
          </button>
           <button @click="Sale_SMS()" class="btn btn-secondary btn-icon ripple btn-sm">
            <i class="i-Speach-Bubble-3"></i>
            SMS
          </button>
          <button @click="Sale_PDF()" class="btn btn-primary btn-icon ripple btn-sm">
            <i class="i-File-TXT"></i>
            PDF
          </button>
          <button @click="print()" class="btn btn-warning btn-icon ripple btn-sm">
            <i class="i-Billing"></i>
            {{$t('print')}}
          </button>
          <button @click="Get_Details_Less_returns()" class="btn btn-info btn-icon ripple btn-sm">
            <i class="i-Envelope-2"></i>
            {{$t('LessReturns')}}
          </button>
          <button  v-if="is_return" @click="Check_in()" class="btn btn-success btn-icon ripple btn-sm"          >
            {{ $t("Checkin") }}
          </button>
          <button
            v-if="currentUserPermissions && currentUserPermissions.includes('Sales_delete')"
            @click="Delete_Sale()"
            class="btn btn-danger btn-icon ripple btn-sm"
          >
            <i class="i-Close-Window"></i>
            {{$t('Del')}}
          </button>
        </b-col>
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
              <div class="row" style="height:180px">
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
                      <span class="h5 text-uppercase">
                      {{ invoice_pos.sale.client_name }}.
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      <span class="h5 text-uppercase">
                      {{ invoice_pos.sale.client_adresse }}.
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      <span class="h5 text-uppercase">
                      {{ invoice_pos.sale.client_NIT }}.
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="row">
                    <div class="col-2"> </div>
                    <div class="col-6">
                       <span>
                      {{ invoice_pos.sale.date }}.
                      </span>
                    </div>
                    <div class="col-4">
                     <span >
                      {{ invoice_pos.sale.Reglement }}.
                      </span>
                      </div>
                  </div>
                  <div class="row">
                    <div class="col-2"> </div>
                    <div class="col-6">
                       <span>
                      </span>
                    </div>
                  </div>
                  <div class="row" style="margin-top:30px; margin-left:55px;">
                    <div class="col-2"> </div>
                    <div class="col-6">
                       <span>
                      {{ invoice_pos.sale.seller }}.
                      </span>
                    </div>
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
              <div style="height:360px">
                  <div class="row"  v-for="detail_invoice in invoice_pos.details">
                <div class="col-1">
                  <span class="h5 text-uppercase">
                  {{ formatNumber(detail_invoice.quantity, 2) }}
                      </span>
                </div>
               
                <div class="col-7">
                   <span class="h5 text-uppercase">
                  {{ detail_invoice.code }}
                      </span> - 
                  <span class="h5 text-uppercase">
                  {{ detail_invoice.name }}
                      </span>
                  </div>
                <div class="col-1">
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase">
                      {{ formatNumber(detail_invoice.Net_price, 2) }}
                      </span>
                      </div>
                  </div>
                  
                </div>
                <div class="col-1"></div>
                <div class="col-1"></div>
                <div class="col-1">
                  <span class="h5 text-uppercase">
                  {{ formatNumber(detail_invoice.total, 2) }}
                      </span>
                </div>
              </div>
              </div>
              
              <div class="row" >
                <div class="col-10">
                  <div class="row rounded">
                    <span class="h5 text-uppercase">
                    {{ GrandTotalText }}
                      </span>
                  </div>
                </div>
                <div class="col-2">
                  <div class="row align-items-start">
                    <div class="col-6"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase">
                      {{
                        formatNumber(
                          invoice_pos.sale.GrandTotal,
                          2
                        )
                      }}
                      </span>
                    </div>
                  </div>
                  <div class="row align-items-start">
                    <div class="col-6"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase">
                    
                      </span>
                    </div>
                  </div>
                  <div class="row align-items-start">
                    <div class="col-6"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase">
                     
                      </span>
                    </div>
                  </div>
                  <div class="row align-items-start">
                    <div class="col-6"></div>
                    <div class="col-6"></div>
                  </div>
                  <div class="row align-items-start">
                    <div class="col-6"></div>
                    <div class="col-6"></div>
                  </div>
                  <div class="row align-items-start">
                    <div class="col-6"></div>
                    <div class="col-6"></div>
                  </div> 
                  <div class="row align-items-end " style="height:120px">
                    <div class="col-6"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase">
                      {{ formatNumber(invoice_pos.sale.GrandTotal, 2) }}
                      </span>
                      
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
                      <span class="h5 text-uppercase">
                      {{ invoice_pos.sale.client_name }}.
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      <span class="h5 text-uppercase" style="margin-top:15px;margin-left:10px;">
                      {{ invoice_pos.sale.client_adresse }}.
                      </span>
                    </div>
                  </div>

                  <div class="row" style="margin-top:8px;margin-left:10px;">
                    <div class="col-6 padding-top padding-bottom">
                      <span class="h5 text-uppercase" >
                      {{ invoice_pos.sale.client_city }}.
                      </span>
                    </div>
                    <div class="col-6 padding-top padding-bottom">
                      <span class="h5 text-uppercase">
                      {{ invoice_pos.sale.client_country }}.
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      <span class="h5 text-uppercase" style="margin-top:10px;margin-left:10px;">
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 padding-top padding-bottom">
                      <span class="h5 text-uppercase" style="margin-top:10px;margin-left:10px;">
                      </span>
                    </div>
                  </div>
                  <div class="row" style="height:75px;">
                    <div class="col-12 padding-top padding-bottom">
                      <span class="h5 text-uppercase" style="margin-left:60px;margin-top:50px;">
                      {{ invoice_pos.sale.seller }}.
                      </span>
                    </div>
                  </div>
                  </div>
                <div class="col-4">
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-4"></div>
                    <div class="col-4"></div>
                  </div>
                  <div class="row" style="margin-top:-10px;">
                    <div class="col-4"></div>
                    <div class="col-4" >
                      <span >
                      {{ invoice_pos.sale.date }}.
                      </span>
                      </div>
                    <div class="col-4">
                      <span >
                      {{ invoice_pos.sale.Reglement }}.
                      </span>

                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase" style="margin-top:45px; height:40px;">
                      {{ invoice_pos.sale.client_NRC }}.
                      </span>

                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase" style="margin-top:45px;height:40px;">
                      {{ invoice_pos.sale.client_NIT }}.
                      </span>

                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase">
                      {{ sale.client_giro }}
                      </span>
                    </div>
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
              <div style="height:400px">
                  <div class="row"  v-for="detail_invoice in invoice_pos.details">
                <div class="col-1">
                  <span class="h5 text-uppercase">
                  {{ formatNumber(detail_invoice.quantity, 2) }}
                      </span>
                </div>
               
                <div class="col-7">
                   <span class="h5 text-uppercase">
                  {{ detail_invoice.code }}
                      </span> - 
                  <span class="h5 text-uppercase">
                  {{ detail_invoice.name }}
                      </span>
                  </div>
                <div class="col-1">
                  <div class="row">
                    <div class="col-4"></div>
                    <div class="col-6">
                      <span class="h5 text-uppercase" style="margin-let:-20px;">
                      {{ formatNumber(detail_invoice.Net_price, 2) }}
                      </span>
                      </div>
                  </div>
    
                </div>
                <div class="col-1"></div>
                <div class="col-1"></div>
                <div class="col-1">
                  <span class="h5 text-uppercase">
                  {{ formatNumber(detail_invoice.total- detail_invoice.TaxNet, 2) }}
                      </span>
                </div>
              </div>
              </div>
              <div class="row" style="margin-top:-107px;">
                <div class="col-9">
                  <div class="row rounded">
                    <span class="h5 text-uppercase">
                    {{ GrandTotalText }}
                      </span>
                  </div>
                </div>
                <div class="col-3">
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <span class="h5 text-uppercase">
                      {{
                        formatNumber(
                          invoice_pos.sale.GrandTotal + invoice_pos.sale.TaxWithheld - invoice_pos.sale.taxe,
                          2
                        )
                      }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <span class="h5 text-uppercase" style="margin-top:14px;">                      
                      {{ formatNumber(invoice_pos.sale.taxe, 2) }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <span class="h5 text-uppercase" style="margin-top:15px;">
                       {{ formatNumber(invoice_pos.sale.GrandTotal + invoice_pos.sale.TaxWithheld, 2) }} 
                      </span>
                    </div>

                  </div>
                  <div class="row" style="height:70px; margin-top:35px;">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <span class="h5 text-uppercase" v-if="sale.big_consumer == 1">
                      {{ formatNumber(invoice_pos.sale.TaxWithheld, 2) }}
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-8"></div>
                    <div class="col-4">
                    </div>
                  </div>
                  <div class="row align-items-end" style="height:50px; margin-top:-25px;">
                    <div class="col-8"></div>
                    <div class="col-4">
                      <span class="h5 text-uppercase">
                      {{ formatNumber(invoice_pos.sale.GrandTotal, 2) }}
                      </span>
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
                   <tr v-if="sale.big_consumer == 1">
                    <td>(-) {{ $t("IVAwithholding") }}</td>
                    <td>
                      <span>
                         {{ formatNumber(sale.TaxWithheld, 2) }}
                         {{ currentUser.currency }}
                         ( 1.00% )
                      </span>
                    </td>
                  </tr>
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
import Util from "../../../../utils";
import vueEasyPrint from "vue-easy-print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import VueBarcode from "vue-barcode";
import { loadStripe } from "@stripe/stripe-js";

export default {
  computed: mapGetters(["currentUserPermissions", "currentUser"]),
  metaInfo: {
    title: "Detail Sale"
  },
    components: {
    vueEasyPrint,
    barcode: VueBarcode
  },

  data() {
    return {
      isLoading: true,
      sale: {},
      is_return:false,
      sale_less_return:0,
      details: [],
      variants: [],
      company: {},
      invoice_pos: {
        symbol: "",
        sale: {
          Ref: "",
          client_name: "",
          client_adresse: "",
          client_country: "",
          client_city: "",
          final_consumer:"",
          big_consumer:"",
          discount: "",
          taxe: "",
          date: "",
          tax_rate: 13,
          TaxWithheld:"",
          shipping: "",
          GrandTotal: "",
          RefTransfer: "",
          RefCreditCard: "",
          type_invoice: "",
          refInvoice: "",
          Reglement: "",
        }
      },
      email: {
        to: "",
        subject: "",
        message: "",
        client_name: "",
        Sale_Ref: ""
      },
      GrandTotalText:"",
    };
  },

  methods: {
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
    //-------------------------------- Invoice POS ------------------------------\\
    Invoice_POS(id) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios
        .get("Sales/Print_Invoice/" + id)
        .then((response) => {
          console.log('respuesta');
          this.invoice_pos = response.data;
          console.log(this.invoice_pos);
          this.GrandTotalText = Util.numeroALetras(
            this.formatNumber(this.invoice_pos.sale.GrandTotal, 2)
          );
          console.log('respuesta2');

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
     print_pos() {
      if (this.invoice_pos.sale.type_invoice == "CF") {
        this.$refs.Show_invoiceF.print();
      } else {
        this.$refs.Show_invoiceCCF.print();
      }
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

    //--------------------------------- Send Sale in Email ------------------------------\\
    Sale_Email() {
      this.email.to = this.sale.client_email;
      this.email.Sale_Ref = this.sale.Ref;
      this.email.client_name = this.sale.client_name;
      this.Send_Email();
    },

    Send_Email() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      let id = this.$route.params.id;
      axios
        .post("sales/send/email", {
          id: id,
          to: this.email.to,
          client_name: this.email.client_name,
          Ref: this.email.Sale_Ref
        })
        .then(response => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
          this.makeToast(
            "success",
            this.$t("Send.TitleEmail"),
            this.$t("Success")
          );
        })
        .catch(error => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
          this.makeToast("danger", this.$t("SMTPIncorrect"), this.$t("Failed"));
        });
    },

    //---------SMS notification
     Sale_SMS() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      let id = this.$route.params.id;
      axios
        .post("sales/send/sms", {
          id: id,
        })
        .then(response => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
          this.makeToast(
            "success",
            this.$t("Send_SMS"),
            this.$t("Success")
          );
        })
        .catch(error => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
          this.makeToast("danger", this.$t("sms_config_invalid"), this.$t("Failed"));
        });
    },
    //----------------------------------- Get Details Sale ------------------------------\\
    Get_Details_Less_returns() {
      let id = this.$route.params.id;
      axios
        .get(`sales/less-returns/${id}`)
        .then(response => {
            this.sale = response.data.sale;
            this.details = response.data.details;
            this.company = response.data.company;
            this.is_return=true;
          this.isLoading = false;
        })
        .catch(response => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
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
        })
        .catch(response => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },
        //----------------------------------- Get Details Sale ------------------------------\\
      Get_Detailss(id) {
        axios
          .get(`sales/${id}`)
          .then(response => {
            this.sale = response.data.sale;
            this.details = response.data.details;
            this.company = response.data.company;
            this.isLoading = false;
          })
          .catch(response => {
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          });
      },
    //------------------------------------------save less return---------------------------\\
    Check_in(){
      let id = this.$route.params.id;
      axios
        .get(`sales/save/less_Return/${id}`)
        .then(response => {
            this.sale_less_return=response.data.newId;
            this.Invoice_POS(this.sale_less_return);
            this.Get_Detailss(this.sale_less_return);
          this.isLoading = false;
        })
        .catch(response => {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
    },
    //------------------------------------------ DELETE Sale ------------------------------\\
    Delete_Sale() {
      let id = this.$route.params.id;
      this.$swal({
        title: this.$t("Delete.Title"),
        text: this.$t("Delete.Text"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: this.$t("Delete.cancelButtonText"),
        confirmButtonText: this.$t("Delete.confirmButtonText")
      }).then(result => {
        if (result.value) {
          axios
            .delete("sales/" + id)
            .then(() => {
              this.$swal(
                this.$t("Delete.Deleted"),
                this.$t("Delete.SaleDeleted"),
                "success"
              );
              this.$router.push({ name: "index_sales" });
            })
            .catch(() => {
              this.$swal(
                this.$t("Delete.Failed"),
                this.$t("Delete.Therewassomethingwronge"),
                "warning"
              );
            });
        }
      });
    }
  }, //end Methods

  //----------------------------- Created function-------------------

  created: function() {
    this.Get_Details();
  }
};
</script>