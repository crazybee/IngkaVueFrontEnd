<template>
  <div>
    <canvas id="detailsChart"></canvas>
    <h1>Report Details</h1>
    <div v-if="details && details">
      <div class="filters">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" v-model="filters.startDate">

        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" v-model="filters.endDate">

        <button @click="applyFilters">Filter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Publish Time</th>
            <th>DPuG ID</th>
            <th>Report Name</th>
            <th>Group</th>
            <th>Dynamic</th>
            <th>Resource Name</th>
            <th>Date Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredReports" :key="item._id">
            <td>{{ item._id }}</td>
            <td>{{ item.PublishTime }}</td>
            <td>{{ item.DPuG_ID }}</td>
            <td>{{ item.ReportName }}</td>
            <td>{{ item.Group.join(', ') }}</td>
            <td>{{ item.Dynamic }}</td>
            <td>{{ item.ResourceName }}</td>
            <td>{{ item.DateRetention }}</td>
          </tr>
        </tbody>
      </table>

      <p v-if="details.pagination">Total Items: {{ details.pagination.totalItems }}</p>
    </div>
  </div>
</template>

<script>
import axios from '@/axiosClient';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      filters: {
        startDate: '',
        endDate: '',
      },
      details: null,
      chart: null,
      timeSeries: null,
    };
  },
  created() {
    this.fetchDetails();
    this.fetchDataWithRange();
  },
  computed: {
    filteredReports() {
      return this.details.filter((report) => {
        const reportDate = new Date(report.date);
        const startDate = this.filters.startDate ? new Date(this.filters.startDate) : null;
        const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;

        if (startDate && reportDate < startDate) return false;
        if (endDate && reportDate > endDate) return false;
        return true;
      });
    },
  },
  methods: {
    fetchDetails() {
      const id = this.$route.params.id;
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://reports.semopx.com/api/v1/documents/static-reports?DPuG_ID=${id}&page_size=50`,
        headers: {},
      };

      axios.request(config)
        .then((response) => {

          this.details = response.data.items;


        })
        .catch((error) => {
          console.error(error);
        });

    },
    renderChart() {
      if (!this.timeSeries) return;

      const labels = this.timeSeries.map((item) => item.date.split("T")[0]);
      const data = this.timeSeries.map((item) => item.price);

      if (this.chart) this.chart.destroy();

      const ctx = document.getElementById("detailsChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "bar", 
        data: {
          labels: labels,
          datasets: [
            {
              label: "Price",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Price",
              },
            },
          },
        },
      });
    },

    fetchDataWithRange(url = `${process.env.VUE_APP_API_HOST}/api/price/all`) {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {'x-api-key': process.env.VUE_APP_API_KEY, },
      };
      axios.request(config)
        .then((response) => {

          this.timeSeries = response.data;
          this.renderChart();

        })
        .catch((error) => {
          console.error(error);
        });
    },
    applyFilters() {
      const { startDate, endDate } = this.filters;
      if (startDate && endDate) {
        const url = `${process.env.VUE_APP_API_HOST}/api/price/filter?startDate=${startDate}&endDate=${endDate}`;
        this.fetchDataWithRange(url);
      } else {
        this.fetchDataWithRange();
      }
    },
  },
};
</script>