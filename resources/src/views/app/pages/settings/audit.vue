<template>
  <div class="main-content">
    <breadcumb :page="$t('Audits')" :folder="$t('Settings')"/>
    <div v-if="isLoading" class="loading_page spinner spinner-primary mr-3"></div>
    <div v-else>
      <vue-good-table
        mode="remote"
        :columns="columns"
        :totalRows="totalRows"
        :rows="audits"
        @on-page-change="onPageChange"
        @on-per-page-change="onPerPageChange"
        @on-sort-change="onSortChange"
        @on-search="onSearch"
        :search-options="{
        placeholder: $t('Search_this_table'),
        enabled: true,
      }"
        :pagination-options="{
        enabled: true,
        mode: 'records',
        nextLabel: 'next',
        prevLabel: 'prev',
      }"
        styleClass="tableOne table-hover vgt-table tableAudit"
      >
      <div slot="table-actions" class="mt-2 mb-3">
         
          <b-button @click="Audits_PDF()" size="sm" variant="outline-success m-1">
            <i class="i-File-Copy"></i> PDF
          </b-button>
          <b-button @click="Audits_Excel()" size="sm" variant="outline-danger m-1">
            <i class="i-File-Excel"></i> EXCEL
          </b-button>
          
        </div>
      </vue-good-table>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from "vuex";
import NProgress from "nprogress";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  metaInfo: {
    title: "audits"
  },
  data() {
    return {
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
      isLoading: true,
      spinner: false,
      limit: "10",
      audits: [],
      audits: {}
    };
  },

  computed: {
    columns() {
      return [
       
        {
          label: "Evento",
          field: "event",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit"
        },
        {
          label: "Usuario",
          field: "user_id",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit"
        },
        {
          label: "Módulo",
          field: "auditable_type",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit"
        },
        {
          label: "Auditable id",
          field: "auditable_id",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit"
        },
        {
          label: "Valor anterior",
          field: "old_values",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit"
        },
        {
          label: "Valor nuevo",
          field: "new_values",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit" 
        },
        {
          label: "URL",
          field: "url",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit"
        },
        {
          label: "Fecha y hora",
          field: "created_at",
          tdClass: "text-left, tdAudit",
          thClass: "text-left, tdAudit"
        }
      ];
    }
  },

  methods: {
    //---- update Params Table
    updateParams(newProps) {
      this.serverParams = Object.assign({}, this.serverParams, newProps);
    },

    //---- Event Page Change
    onPageChange({ currentPage }) {
      if (this.serverParams.page !== currentPage) {
        this.updateParams({ page: currentPage });
       this.Get_Audit(currentPage);
      }
    },

    //---- Event Per Page Change
    onPerPageChange({ currentPerPage }) {
      if (this.limit !== currentPerPage) {
        this.limit = currentPerPage;
        this.updateParams({ page: 1, perPage: currentPerPage });
        this.Get_Audit(1);
      }
    },


    //--------------------------- Users PDF ---------------------------\\
    Audits_PDF() {
      var self = this;

      let pdf = new jsPDF("p", "pt");
      let columns = [
        { title: "Event", dataKey: "event" },
        { title: "User", dataKey: "user_id" },
        { title: "Auditable id", dataKey: "auditable_id" , style:"with"},
        { title: "Auditable tipo", dataKey: "auditable_type" },
        { title: "Valor anterior", dataKey: "old_values" },
        { title: "Valor nuevo", dataKey: "new_values" },
        { title: "Url", dataKey: "url" },
        { title: "Fecha", dataKey: "created_at" }
      ];
      pdf.autoTable(columns, self.audits);
      pdf.text("Audits List", 40, 25);
      pdf.save("Audits_List.pdf");
    },

    //------------------------ Users Excel ---------------------------\\
    Audits_Excel() {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios
        .get("audits/export/Excel", {
          responseType: "blob", // important
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "List_Audits.xlsx");
          document.body.appendChild(link);
          link.click();
          // Complete the animation of the progress bar.
          setTimeout(() => NProgress.done(), 500);
        })
        .catch(() => {
          // Complete the animation of the progress bar.
          setTimeout(() => NProgress.done(), 500);
        });
    },

    //---- Event on Sort Change

    onSortChange(params) {
      this.updateParams({
        sort: {
          type: params[0].type,
          field: params[0].field
        }
      });
      this.Get_Audit(this.serverParams.page);
    },

    //---- Event on Search

    onSearch(value) {
      this.search = value.searchTerm;
      this.Get_Audit(this.serverParams.page);
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

    //--------------------------- Get Customer Report -------------\\

    Get_Audit(page) {
      // Start the progress bar.
      NProgress.start();
      NProgress.set(0.1);
      axios
        .get(
          "audits?page=" +
            page +
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
          this.audits = response.data.audits;
          this.totalRows = response.data.totalRows;
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
  }, //end Methods

  //----------------------------- Created function------------------- \\

  created: function() {
   this.Get_Audit(1);
  }
};

</script>
