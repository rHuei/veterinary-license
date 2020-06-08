<template>
  <div id="app">
    <Navigation msg="全國獸醫診所查詢"></Navigation>

    <!-- Main jumbotron for a primary marketing message or call to action -->
    <div class="jumbotron mt-4 pb-3">
      <div class="container">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">縣市</span>
          </div>
          <select class="form-control" v-model="city">
           <option value=''>請選擇縣市</option>
           <option :value="c.CityName" v-for="c in cityName" :key="c.CityName">
             {{ c.CityName }}
           </option>
          </select>
        </div>
        <div class="form-group row">
          <div class="col-sm-6">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">診所名稱</span>
              </div>
              <input type="text" class="form-control" v-model="store" placeholder="請輸入診所名稱">
            </div>
          </div>
          <div class="col-sm-6">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">獸醫師姓名</span>
              </div>
              <input type="text" class="form-control" v-model="doctor" placeholder="請輸入獸醫師姓名">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 text-center">
            <button type="button" class="btn btn-primary" @click="search">
              <div class="spinner-border spinner-border-sm" role="status" v-if="loading">
                <span class="sr-only">Loading...</span>
              </div>
              查詢
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-sm-6">
          <p v-if="searchStore.length > 0">共有{{ searchStore.length }}份資料符合條件</p>
        </div>
        <div class="col-sm-6 text-right">
          <a href="#" @click="sort()">依發照日期排序</a>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
          
          <div class="card border-primary mb-3" v-for="s in searchStore" :key="s.機構名稱">
            <div class="card-header">{{ s.機構名稱 }}</div>
            <div class="card-body text-primary">
              <p class="card-text">執業執照字號: {{ s.字號  }}</p>
              <p class="card-text">獸醫師姓名: {{ s.負責獸醫  }}</p>
              <p class="card-text">發照日期: {{ s.發照日期 }}</p>
              <p class="card-text" v-if="s.機構電話 !== ' '">連絡電話: {{ s.機構電話  }}</p>
              <p class="card-text">執業機構地址: <a :href="`http://maps.google.com/?q=${s.機構名稱}${s.機構地址}`" target="_blank">{{ s.機構地址  }}</a></p>
            </div>
          </div>
        </div>
        <div class="col-sm-8">
            <iframe src="https://www.google.com/maps/d/u/0/embed?mid=16WcKD2S6xLdVyt-bWR8cQfP_OPYZvbxB" width="640" height="480"></iframe>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <span class="text-muted">資料來源: <a href="https://data.coa.gov.tw/Query/ServiceDetail.aspx?id=078">https://data.coa.gov.tw/Query/ServiceDetail.aspx?id=078</a></span>
      </div>
    </footer>
  </div>
</template>

<script>
// import $ from 'jquery';
import cityName from './assets/cityName.json';
import Navigation from './components/Navigation';

export default {
  name: 'App',
  data: () => ({
    cityName,
    city: '',
    store: '',
    doctor: '',
    searchStore: [],
    loading: false,
  }),
  components: {
    'Navigation': Navigation
  },
  methods: {
    search(){
      if (!this.city && !this.store && !this.doctor) {
        alert('請選擇其中一個搜尋項目');
        return;
      }
      let api = 'https://cors-anywhere.herokuapp.com/https://data.coa.gov.tw/Service/OpenData/DataFileService.aspx?UnitId=078&$filter=';
      let filter = '';
      this.loading = true;
      if (this.city) {
        if (filter) filter += '+and+';
        filter += `縣市+like+${encodeURIComponent(this.city)}`;
      } 
      if (this.store) {
        if (filter) filter += '+and+';
        filter += `機構名稱+like+${encodeURIComponent(this.store)}`;
      } 
      if (this.doctor) {
        if (filter) filter += '+and+';
        filter += `負責獸醫+like+${encodeURIComponent(this.doctor)}`;
      }
      api += filter;
      this.axios
        .get(api, {
          headers: {
           'Access-Control-Allow-Origin': '*',
          }
        })
        .then(response => {
          this.searchStore = response.data;
          this.loading = false;
        });
    },
    sort() {
      this.searchStore.sort((a, b) => {
        return a.Brand > b.Brand ? 1 : -1;
      });
    }
  }
}
</script>

<style lang="scss">
.footer {
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  line-height: 60px; /* Vertically center the text there */
  background-color: #f5f5f5;
}
</style>
