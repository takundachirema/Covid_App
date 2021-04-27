<template>
    <div id="app">
        <div class="loader" v-if="loading">
            <div>
                <circle9></circle9>
            </div>
        </div>
        
        <div class="horizontal-no-margin">
            <div class="w100">
                <!-- <div class="horizontal w100">
                    <div class="w20">
                        <model-select 
                            id="selectDate"
                            :options="dates"
                            v-model="date"
                            placeholder="Select Date">
                        </model-select>
                        <b-tooltip 
                            target="selectDate" 
                            placement="left"
                            title="select date">
                        </b-tooltip>
                    </div>

                    <div class="w20">
                        <input type="button" value="Filter"  @click="filter()" class="btn btn-info w60"/>
                    </div>

                    <div class="w20">
                        <input type="button" value="Reset"  @click="plotMapData(true)" class="btn btn-info w60"/>
                    </div>
                </div> -->

                <div style="height:600px" class="w100">
                    <zingchart :height="'100%'" :id="mapChartId" :data="mapChartData"></zingchart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { ModelSelect } from 'vue-search-select'
    import {Circle9} from 'vue-loading-spinner'
    import 'zingchart/modules-es6/zingchart-maps-world-countries.min.js';
    var countries = require('../assets/countries.json');

    export default {
        props: {
            data: {
                type: Object
            }
        },
        methods: {
            getMapPlotData() {
                var plotData = 
                {shapes: [{
                    type: 'zingchart.maps',
                    options: {
                        name:'world.countries',
                        style:{ //style all countries
                            backgroundColor: '#cccccc',
                            label:{
                                visible: false
                            },
                            hoverState: {
                                alpha:.32,
                            },
                            items: this.items
                        }
                    }
                }]}

                return plotData
            },
            getMapDetailData(){

                var plotData = 
                {shapes:[{
                    type:'zingchart.maps',
                    options:{
                        name:'',
                    }
                },
                {
                    x:100,
                    y:20,
                    type:'rectangle',
                    height: 25,
                    width: 155,
                    backgroundColor:'#C4C4C4',
                    padding:5,
                    cursor:'hand',
                    id: 'back_button',
                    label: {
                    text: 'Back To World Countries'
                    },
                    hoverState: {
                    borderWidth: 1,
                    borderColor: '#000'
                    }
                }]}

                return plotData
            },
            plotMapData(reset) {
                this.mapChartData = this.getMapPlotData()
                
                //console.log("*****")
                //console.log(this.mapChartData["shapes"][0]["options"]["styles"]["items"])

                var self = this;
                zingchart.bind(null, 'shape_click', function(e) {
                    var newMapId = String(e.shapeid).toLowerCase();
                    //console.log("shape")
                    //console.log(e)
                    if (newMapId == 'back_button') {
                        self.drillDown = true;
                        self.mapChartData = self.getMapPlotData();
                        return;
                    }

                    if (!self.drillDown){
                        return;
                    }

                    import('zingchart/modules-es6/zingchart-maps-'+newMapId+'.min.js')
                    .then(() => {
                        var drilldownConfig = self.getMapDetailData();
                        drilldownConfig.shapes[0].options.name =  newMapId;

                        self.mapChartData = drilldownConfig;
                        self.drillDown = false;
                    })
                    .catch(() => {
                        alert('Region not found')
                    })
                });
            },
            prepareData(){
                var items = {}

                this.data.forEach(element => {
                    var country = countries
                        .find(country => 
                            country.name.toLowerCase() == element.country.name.toLowerCase()
                        );

                    if (typeof country !== "undefined"){
                        var countryCode = country["alpha-3"]

                        var figures = Object.values(element.dates);
                        var dates = Object.keys(element.dates);

                        var latestDate = dates[dates.length - 1]
                        var latestFigures = figures[figures.length - 1]

                        var item = {
                            backgroundColor:'#0D47A1',
                            cursor:'pointer',
                            label:{
                                visible: true,
                                fontColor: '#ffffff'
                            },
                            tooltip: {
                                text: 
                                    'Country: '+country.name+'\n'+
                                    'Date: '+latestDate+'\n'+
                                    'Total Cases: '+latestFigures.cumulative.cases+'\n'+
                                    'New Cases: '+latestFigures.new.cases+'\n'
                            }
                        }

                        items[countryCode] = item

                        //console.log(latestDate)
                        //console.log(latestFigures)
                    }
                });

                console.log(items)
                this.items = items
            }
        },
        mounted(){
            axios.get('https://coviddata.github.io/coviddata/v1/countries/stats.json')
            .then(response => {
                this.data = response.data
                this.prepareData()
                this.plotMapData(true)
                this.loading = false
            })
            .catch(e => {
                this.loading = false
                console.log(e)
            })
            
        },
        created () {
            // fetch("https://coviddata.github.io/coviddata/v1/countries/stats.json")
            //   .then(response => response.json())
            //   .then(data => {
            //     const country = data.find(country => country.country.name == "China");
            //     for (date in country.dates) {
            //       console.log(`${date} - ${country.dates[date].cumulative.cases} cases`);
            //     }
            //   })
        },
        data() {
            return {
                loading: true,
                drillDown: true,
                mapChartData: {},
                mapChartId: 'mapChart',
                date: '',
                gridData: {},
                results: {},
                dates: [],
                items: {}
            }
        },
        components: {
            ModelSelect,
            Circle9
        }
    }
</script>