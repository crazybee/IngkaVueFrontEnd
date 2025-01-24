<template>
    <div>
      <h1>Static Reports</h1>
       <!-- Date Range Filter -->
  
      <table>
        <thead>
          <tr>
            <th @click="sortBy('_id')">ID 
              <span :class="getSortIndicator('_id')">▲▼</span>
            </th>
            <th @click="sortBy('DPuG_ID')">DPuGID 
              <span :class="getSortIndicator('DPuG_ID')">▲▼</span>
            </th>
            <th @click="sortBy('ReportName')">Name
              <span :class="getSortIndicator('ReportName')">▲▼</span>
            </th>
            <th @click="sortBy('DateRetention')">Date
              <span :class="getSortIndicator('DateRetention')">▲▼</span>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in sortedReports" :key="report.id">
            <td>{{ report._id }}</td>
            <td>{{ report.DPuG_ID }}</td>
            <td>{{ report.ReportName }}</td>
            <td>{{ report.DateRetention }}</td>
            <td>
              <button @click="viewDetails(report.DPuG_ID)">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
 import axios from '@/axiosClient';
  
  export default {
    data() {
      return {        
        reports: [],
       
        sortKey: '',
        sortOrder: 1, // 1 for ascending, -1 for descending
      };
    },
    created() {
      this.fetchReports();
    },
    computed: {
      
      sortedReports() {
      if (!this.sortKey) return this.reports;

      return [...this.reports].sort((a, b) => {
        const valueA = a[this.sortKey];
        const valueB = b[this.sortKey];

        if (valueA < valueB) return -1 * this.sortOrder;
        if (valueA > valueB) return 1 * this.sortOrder;
        return 0;
      });
    },
    },
    methods: {
      fetchReports() {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://reports.semopx.com/api/v1/documents/static-reports',
          headers: {},
        };
  
        axios.request(config)
          .then((response) => {
           
            this.reports = response.data.items;
          })
          .catch((error) => {
            console.error(error);
          });
      },
      viewDetails(id) {
        this.$router.push(`/details/${id}`);
      },
      sortBy(key) {
        console.warn(key);
      if (this.sortKey === key) {
        this.sortOrder *= -1; // Toggle sort order
      } else {
        this.sortKey = key;
        this.sortOrder = 1; // Default to ascending
      }
    },
    getSortIndicator(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 1 ? 'ascending' : 'descending';
      }
      return 'sortable';
    },
  
    },
  };
  </script>

<style src="../css/tablestyle.css"></style>