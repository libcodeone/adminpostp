<template>
  <div class="main-content">
    <breadcumb :page="$t('Dispatcher')" :folder="$t('Sales')"/>
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
         <button @click="Update_Sale()" class="btn btn-success btn-icon ripple btn-sm">
            {{$t('Delivered')}}
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
      isLoading: true,
      sale: {},
      details: [],
      variants: [],
      company: {},
      email: {
        to: "",
        subject: "",
        message: "",
        client_name: "",
        Sale_Ref: ""
      }
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

     //--------------------------------- Update Sale -------------------------\\
    Update_Sale() {
        // Start the progress bar.
        NProgress.start();
        NProgress.set(0.1);
        let id = this.$route.params.id;
        axios
          .put(`sales/change_status/${id}`, {
            statut: 'completed',
          }).then(response => {
            this.makeToast(
              "success",
              this.$t("Update.TitleSale"),
              this.$t("Success")
            );
            NProgress.done();
            this.$router.push({ name: "index_sale_dispatcher" });
          })
          .catch(error => {
            NProgress.done();
            this.makeToast("danger", this.$t("InvalidData"), this.$t("Failed"));
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

    
  }, //end Methods

  //----------------------------- Created function-------------------

  created: function() {
    this.Get_Details();
  }
};
</script>