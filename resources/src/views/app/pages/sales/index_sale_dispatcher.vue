<template>
  <div class="main-content">
    <breadcumb :page="$t('ListSales')" :folder="$t('Sales')"/>
    <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>
    <div v-else>
      <vue-good-table
        mode="remote"
        :columns="columns"
        :totalRows="totalRows"
        :rows="sales"
        @on-page-change="onPageChange"
        @on-per-page-change="onPerPageChange"
        @on-sort-change="onSortChange"
        @on-search="onSearch"
        :search-options="{
        placeholder: $t('Search_this_table'),
        enabled: true,
      }"
        :select-options="{ 
          enabled: true ,
          clearSelectionText: '',
        }"
        @on-selected-rows-change="selectionChanged"
        :pagination-options="{
        enabled: true,
        mode: 'records',
        nextLabel: 'next',
        prevLabel: 'prev',
      }"
        :styleClass="showDropdown?'tableOne table-hover vgt-table full-height':'tableOne table-hover vgt-table non-height'"
      >
        <div slot="table-actions" class="mt-2 mb-3">
          <b-button variant="outline-info ripple m-1" size="sm" v-b-toggle.sidebar-right>
            <i class="i-Filter-2"></i>
            {{ $t("Filter") }}
          </b-button>
          <b-button @click="Sales_PDF()" size="sm" variant="outline-success ripple m-1">
            <i class="i-File-Copy"></i> PDF
          </b-button>
          <b-button @click="Sales_Excel()" size="sm" variant="outline-danger ripple m-1">
            <i class="i-File-Excel"></i> EXCEL
          </b-button>
        </div>

        <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'dispatcher'">
            <div>
              <router-link
                class="btn-sm btn btn-primary ripple btn-icon m-1"
                v-if="currentUserPermissions && currentUserPermissions.includes('Dispatchers')"
                :to="{ name:'dispatcher_sale', params: { id: props.row.id } }"
              >
                <span class="ul-btn__icon">
                  <i class="i-Edit"></i>
                </span>
                <span class="ul-btn__text ml-1">{{$t('dispatcher')}}</span>
              </router-link>
            </div>
          </span>
          
          <div v-else-if="props.column.field == 'statut'">
            <span
              v-if="props.row.statut == 'completed'"
              class="badge badge-outline-success"
            >{{$t('complete')}}</span>
            <span
              v-else-if="props.row.statut == 'pending'"
              class="badge badge-outline-info"
            >{{$t('Pending')}}</span>
            <span v-else class="badge badge-outline-warning">{{$t('Ordered')}}</span>
          </div>

          <div v-else-if="props.column.field == 'payment_status'">
            <span
              v-if="props.row.payment_status == 'paid'"
              class="badge badge-outline-success"
            >{{$t('Paid')}}</span>
            <span
              v-else-if="props.row.payment_status == 'partial'"
              class="badge badge-outline-primary"
            >{{$t('partial')}}</span>
            <span v-else class="badge badge-outline-warning">{{$t('Unpaid')}}</span>
          </div>     


        </template>
      </vue-good-table>
    </div>

    <!-- Sidebar Filter -->
    <b-sidebar id="sidebar-right" :title="$t('Filter')" bg-variant="white" right shadow>
      <div class="px-3 py-2">
        <b-row>
          <!-- date  -->
          <b-col md="12">
            <b-form-group :label="$t('date')">
              <b-form-input type="date" v-model="Filter_date"></b-form-input>
            </b-form-group>
          </b-col>

          <!-- Reference -->
          <b-col md="12">
            <b-form-group :label="$t('Reference')">
              <b-form-input label="Reference" :placeholder="$t('Reference')" v-model="Filter_Ref"></b-form-input>
            </b-form-group>
          </b-col>

          <!-- Customer  -->
          <b-col md="12">
            <b-form-group :label="$t('Customer')">
              <v-select
                :reduce="label => label.value"
                :placeholder="$t('Choose_Customer')"
                v-model="Filter_Client"
                :options="customers.map(customers => ({label: customers.name, value: customers.id}))"
              />
            </b-form-group>
          </b-col>

          <!-- warehouse -->
          <b-col md="12">
            <b-form-group :label="$t('warehouse')">
              <v-select
                v-model="Filter_warehouse"
                :reduce="label => label.value"
                :placeholder="$t('Choose_Warehouse')"
                :options="warehouses.map(warehouses => ({label: warehouses.name, value: warehouses.id}))"
              />
            </b-form-group>
          </b-col>

          <b-col md="6" sm="12">
            <b-button
              @click="Get_Sales(serverParams.page)"
              variant="primary btn-block ripple m-1"
              size="sm"
            >
              <i class="i-Filter-2"></i>
              {{ $t("Filter") }}
            </b-button>
          </b-col>
          <b-col md="6" sm="12">
            <b-button @click="Reset_Filter()" variant="danger ripple btn-block m-1" size="sm">
              <i class="i-Power-2"></i>
              {{ $t("Reset") }}
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-sidebar>

    <!-- Modal Show Payments-->
    <b-modal hide-footer size="lg" id="Show_payment" :title="$t('ShowPayment')">
      <b-row>
        <b-col lg="12" md="12" sm="12" class="mt-3">
          <div class="table-responsive">
            <table class="table table-hover table-bordered table-md">
              <thead>
                <tr>
                  <th scope="col">{{$t('date')}}</th>
                  <th scope="col">{{$t('Reference')}}</th>
                  <th scope="col">{{$t('Amount')}}</th>
                  <th scope="col">{{$t('PayeBy')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="payments.length <= 0">
                  <td colspan="5">{{$t('NodataAvailable')}}</td>
                </tr>
                <tr v-for="payment in payments" :key="payment">
                  <td>{{payment.date}}</td>
                  <td>{{payment.Ref}}</td>
                  <td>{{formatNumber(payment.montant,2)}} {{currentUser.currency}}</td>
                  <td>{{payment.Reglement}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
    </b-modal>

   

    <!-- Modal Show Invoice POS-->
    <b-modal hide-footer size="md" scrollable id="Show_invoice" :title="$t('Invoice_POS')">
      <vue-easy-print table-show ref="Show_invoice">
        <div id="invoice-POS">
          <h6 class="text-right">{{$t('date')}} : {{invoice_pos.sale.date}}</h6>
          <center id="top">
            <div class="logo">
              <img :src="'/images/' + invoice_pos.setting.logo">
            </div>
            <div class="info">
              <h3>{{invoice_pos.setting.CompanyName}}</h3>
            </div>
          </center>

          <div class="info">
            <h6>{{$t('Adress')}} : {{invoice_pos.setting.CompanyAdress}}</h6>
            <h6>{{$t('Email')}} : {{invoice_pos.setting.email}}</h6>
            <h6>{{$t('Phone')}} : {{invoice_pos.setting.CompanyPhone}}</h6>
            <h6>{{$t('Customer')}} : {{invoice_pos.sale.client_name}}</h6>
          </div>

          <table class="mt-3 table-md">
            <thead>
              <tr>
                <th scope="col">{{$t('ProductName')}}</th>
                <th scope="col">{{$t('Qty')}}</th>
                <th scope="col">{{$t('Total')}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail_invoice in invoice_pos.details" :key="detail_invoice">
                <td>{{detail_invoice.name}}</td>
                <td>{{detail_invoice.quantity}} {{detail_invoice.unit_sale}}</td>
                <td>{{formatNumber(detail_invoice.total,2)}} {{invoice_pos.symbol}}</td>
              </tr>
              <tr>
                <th></th>
                <th>{{$t('Tax')}}</th>
                <td>{{formatNumber(invoice_pos.sale.taxe,2)}} {{invoice_pos.symbol}} ({{formatNumber(invoice_pos.sale.tax_rate,2)}} %)</td>
              </tr>
              <tr>
                <th></th>
                <th>{{$t('Discount')}}</th>
                <td>{{formatNumber(invoice_pos.sale.discount,2)}} {{invoice_pos.symbol}}</td>
              </tr>
              <tr>
                <th></th>
                <th>{{$t('Shipping')}}</th>
                <td>{{formatNumber(invoice_pos.sale.shipping,2)}} {{invoice_pos.symbol}}</td>
              </tr>
            </tbody>
          </table>
          <table id="total" class="mt-2">
            <tbody>
              <tr>
                <th class="p-1 w-75">{{$t('SubTotal')}}</th>
                <th
                  class="p-1 w-25"
                >{{formatNumber(invoice_pos.sale.GrandTotal ,2)}} {{invoice_pos.symbol}}</th>
              </tr>
            </tbody>
          </table>

          <div id="legalcopy">
            <p class="legal">
              <strong>{{$t('Thank_you_for_your_business')}}</strong>
            </p>
            <div id="bar">
              <barcode
                class="barcode"
                :format="barcodeFormat"
                :value="invoice_pos.sale.Ref"
                textmargin="0"
                fontoptions="bold"
                height="25"
              ></barcode>
            </div>
          </div>
        </div>
      </vue-easy-print>
      <button @click="print_it()" class="btn btn-outline-primary">
        <i class="i-Billing"></i>
        {{$t('print')}}
      </button>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NProgress from "nprogress";
import jsPDF from "jspdf";
import "jspdf-autotable";
import vueEasyPrint from "vue-easy-print";
import VueBarcode from "vue-barcode";
export default {
  components: {
    vueEasyPrint,
    barcode: VueBarcode
  },
  metaInfo: {
    title: "Sales"
  },
  data() {
    return {
      cardElement: {},
      paymentProcessing: false,
      isLoading: true,
      serverParams: {
        sort: {
          field: "id",
          type: "desc"
        },
        page: 1,
        perPage: 10
      },
      selectedIds: [],
      search: "",
      totalRows: "",
      barcodeFormat: "CODE128",
      showDropdown: false,
      EditPaiementMode: false,
      Filter_Client: "",
      Filter_Ref: "",
      Filter_date: "",
      Filter_status: "pending",
      Filter_Payment: "paid",
      Filter_warehouse: "",
      customers: [],
      warehouses: [],
      sales: [],
      invoice_pos: {
        sale: {
          Ref: "",
          client_name: "",
          discount: "",
          taxe: "",
          tax_rate: "",
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
      payments: [],
      payment: {},
      Sale_id: "",
      limit: "10",
      sale: {},
      email: {
        to: "",
        subject: "",
        message: "",
        client_name: "",
        Sale_Ref: ""
      },
      emailPayment: {
        id: "",
        to: "",
        subject: "",
        message: "",
        client_name: "",
        Ref: ""
      }
    };
  },
   mounted() {
    this.$root.$on("bv::dropdown::show", bvEvent => {
      this.showDropdown = true;
    });
    this.$root.$on("bv::dropdown::hide", bvEvent => {
      this.showDropdown = false;
    });
  },
  computed: {
    ...mapGetters(["currentUserPermissions", "currentUser"]),
    columns() {
      return [
        {
          label: this.$t("Reference"),
          field: "Ref",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Customer"),
          field: "client_name",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("warehouse"),
          field: "warehouse_name",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Status"),
          field: "statut",
          html: true,
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Total"),
          field: "GrandTotal",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Paid"),
          field: "paid_amount",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Due"),
          field: "due",
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("PaymentStatus"),
          field: "payment_status",
          html: true,
          tdClass: "text-left",
          thClass: "text-left"
        },
        {
          label: this.$t("Dispatcher"),
          field: "dispatcher",
          html: true,
          tdClass: "text-right",
          thClass: "text-right",
          sortable: false
        }
      ];
    }
  },
  methods: {
    //---- print Invoice
    print_it() {
      this.$refs.Show_invoice.print();
    },
    //---- update Params Table
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },
    //---- Event Page Change
    onPageChange({ currentPage }) {
      if (this.serverParams.page !== currentPage) {
        this.updateParams({ page: currentPage });
        this.Get_Sales(currentPage);
      }
    },
    //---- Event Per Page Change
    onPerPageChange({ currentPerPage }) {
      if (this.limit !== currentPerPage) {
        this.limit = currentPerPage;
        this.updateParams({ page: 1, perPage: currentPerPage });
        this.Get_Sales(1);
      }
    },
    //---- Event Select Rows
    selectionChanged({ selectedRows }) {
      this.selectedIds = [];
      selectedRows.forEach((row, index) => {
        this.selectedIds.push(row.id);
      });
    },
    //---- Event Sort change
    onSortChange(params) {
      let field = "";
      if (params[0].field == "client_name") {
        field = "client_id";
      } else if (params[0].field == "warehouse_name") {
        field = "warehouse_id";
      } else {
        field = params[0].field;
      }
      this.updateParams({
        sort: {
          type: params[0].type,
          field: field
        }
      });
      this.Get_Sales(this.serverParams.page);
    },
    onSearch(value) {
      this.search = value.searchTerm;
      this.Get_Sales(this.serverParams.page);
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
    //------ Reset Filter
    Reset_Filter() {
      this.search = "";
      this.Filter_Client = "";
      this.Filter_status = "pending";
      this.Filter_Payment = "paid";
      this.Filter_Ref = "";
      this.Filter_date = "";
      // (this.Filter_warehouse = this.currentUser.warehouse_id), 
      this.Get_Sales(this.serverParams.page);
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
    //----------------------------------- Sales PDF ------------------------------\\
    Sales_PDF() {
      var self = this;
      let pdf = new jsPDF("p", "pt");
      let columns = [
        { title: "Ref", dataKey: "Ref" },
        { title: "Client", dataKey: "client_name" },
        { title: "Status", dataKey: "statut" },
        { title: "Total", dataKey: "GrandTotal" },
        { title: "Paid", dataKey: "paid_amount" },
        { title: "Due", dataKey: "due" },
        { title: "Status Payment", dataKey: "payment_status" }
      ];
      pdf.autoTable(columns, self.sales);
      pdf.text("Sale List", 40, 25);
      pdf.save("Sale_List.pdf");
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
          setTimeout(() => {
            // Complete the animation of the  progress bar.
            NProgress.done();
            this.$bvModal.show("Show_invoice");
          }, 500);
          setTimeout(() => this.print_it(), 1000);
        })
        .catch(() => {
          // Complete the animation of the  progress bar.
          setTimeout(() => NProgress.done(), 500);
        });
    },
   
    //-----------------------------  Invoice PDF ------------------------------\\
    Invoice_PDF(sale, id) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios({
        url: "Sale_PDF/" + id,
        method: "GET",
        responseType: "blob" // important
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Sale-" + sale.Ref + ".pdf");
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
   
    //---------------------------------------- Set To Strings-------------------------\\
    setToStrings() {
      // Simply replaces null values with strings=''
      if (this.Filter_Client === null) {
        this.Filter_Client = "";
      } else if (this.Filter_warehouse === null) {
        this.Filter_warehouse = "";
      } else if (this.Filter_status === null) {
        this.Filter_status = "";
      } else if (this.Filter_Payment === null) {
        this.Filter_Payment = "";
      }
    },
    //----------------------------------------- Get all Sales ------------------------------\\
    Get_Sales(page) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      this.setToStrings();
      axios
        .get(
          "sales?page=" +
            page +
            "&Ref=" +
            this.Filter_Ref +
            "&date=" +
            this.Filter_date +
            "&client_id=" +
            this.Filter_Client +
            "&statut=" +
            this.Filter_status +
            "&warehouse_id=" +
            this.Filter_warehouse +
            "&payment_statut=" +
            this.Filter_Payment +
            "&SortField=" +
            this.serverParams.sort.field +
            "&SortType=" +
            this.serverParams.sort.type +
            "&search=" +
            this.search +
            "&limit=" +
            this.limit
        )
        .then(response => {
          this.sales = response.data.sales;
          this.customers = response.data.customers;
          this.warehouses = response.data.warehouses;
          this.totalRows = response.data.totalRows;
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

    Number_Order_Payment() {
      axios
        .get("payment/sale/Number/Order")
        .then(({ data }) => (this.payment.Ref = data));
    },
    //----------------------------------- New Payment Sale ------------------------------\\
    
    //-------------------------------Show All Payment with Sale ---------------------\\
    Show_Payments(id, sale) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      this.reset_form_payment();
      this.Sale_id = id;
      this.sale = sale;
      this.Get_Payments(id);
    },
    
  },
  //----------------------------- Created function-------------------\\
  created() {
    this.Filter_warehouse = this.currentUser.warehouse_id;

    this.Get_Sales(1);
    Fire.$on("Create_Facture_sale", () => {
      setTimeout(() => {
        this.Get_Sales(this.serverParams.page);
        // Complete the animation of the  progress bar.
        NProgress.done();
        this.$bvModal.hide("Add_Payment");
      }, 500);
    });
    // Fire.$on("Update_Facture_sale", () => {
    //   setTimeout(() => {
    //     this.Get_Payments(this.Sale_id);
    //     this.Get_Sales(this.serverParams.page);
    //     // Complete the animation of the  progress bar.
    //     NProgress.done();
    //     this.$bvModal.hide("Add_Payment");
    //   }, 500);
    // });
    // Fire.$on("Delete_Facture_sale", () => {
    //   setTimeout(() => {
    //     this.Get_Payments(this.Sale_id);
    //     this.Get_Sales(this.serverParams.page);
    //     // Complete the animation of the  progress bar.
    //     NProgress.done();
    //   }, 500);
    // });
    // Fire.$on("Delete_sale", () => {
    //   setTimeout(() => {
    //     this.Get_Sales(this.serverParams.page);
    //     // Complete the animation of the  progress bar.
    //     NProgress.done();
    //   }, 500);
    // });
  }
};
</script>