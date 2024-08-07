<template>
  <div>
    <el-header>
      <h3>危险因素关联关系挖掘</h3>
      <span style="margin-top: 10px">注释：此模块挖掘危险因素之间的关联关系，并以关系图形式展示</span>
      <el-divider></el-divider>
    </el-header>
    <el-row>
      <el-col :span="10">
        <el-card style="margin-right: 10px; height: 480px;margin-top: 20px" v-loading="loading">
          <div style="margin-top: 10px">
            <el-form :inline="true">
              <el-form-item label="选择症状">
                <el-cascader
                  style="width: 300px"
                  placeholder="试试搜索：肢体水肿"
                  :options="factorShow"
                  :props="{ multiple: true }"
                  v-model="facShow"
                  clearable
                  collapse-tags
                  filterable
                ></el-cascader>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="checkFactor"
                  style="width: 50px"
                  size="mini"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
            <span>注释：表中每行显示与所选危险因素相关联的危险因素和其对应的权重，在右侧进行图谱展示</span>
            <el-table :data="tableData" style="width: auto" max-height="310">
              <el-table-column
                fixed
                prop="factorName"
                label="症状"
              ></el-table-column>
              <af-table-column
                prop="associationFactor"
                label="相关联症状（症状，权重）"
              >
              </af-table-column>
              <el-table-column fixed="right" label="操作" width="70">
                <template slot-scope="{ row }">
                  <el-button size="mini" @click="showTableGraph(row.factorName)"
                    >展示</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card style="height: 480px; margin-right: 10px;margin-top: 20px" v-loading="loading">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>所选危险因素关联图谱展示</span>
            <br>
            <span>展示所选危险因素之间的关联</span>
          </div>
          <div id="chart1" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card style="height: 480px;margin-top: 20px" v-loading="loading">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>单危险因素关联图谱展示</span>
            <br>
            <span>对应于左侧危险因素关联表格</span>
          </div>
          <div id="chart2" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <!-- <el-col :span="12">
        <el-card style="height: 450px">
          <el-row>
            <el-col :span="1" style="margin-right: 40px">
              <h4>所选症状关联图谱展示</h4>
            </el-col>
            <el-col :span="21">
              <div id="chart1" style="width: 600px; height: 450px"></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col> -->
    </el-row>
    <div style="margin-top: 30px" id="min1">
      <el-row>
        <el-col :span="24">
          <el-card
            shadow="hover"
            id="card4"
            class="chart-center"
            style="width: 100%"
            v-loading="loading"
          >
            <div style="width: 1100px">
              <h3>危险因素关联图</h3>
              <el-button type="success" style="margin-left: 1200px" @click="getPdf1()" round>导出结果</el-button>
              <div style="width: 100%;margin-top: 10px">
                <span class="lineStyle">▍</span><span>图谱统计信息：</span>
                <span>症状数量：{{ factorNum }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>关联边数量：{{ associationNum }}</span>
              </div>
              <span class="lineStyle">▍</span
              ><span>需要显示的关联边数量：</span>

              <el-button type="text" @click="reDraw(0.1)">前10%</el-button>
              <el-button type="text" @click="reDraw(0.25)">前25%</el-button>
              <el-button type="text" @click="reDraw(0.5)">前50%</el-button>
              <el-button type="text" @click="reDraw(0.75)">前75%</el-button>
              <el-button type="text" @click="reDraw(1)">全部</el-button>
              <br>
              <span>注释：根据关联边权重选择需要展示的关联数量,同时可点击下方危险因素分类对图谱进行过滤</span>
            </div>

            <div
              id="chart4"
              style="width: 100%; height: 1000px; margin-top: 30px"
            ></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div id="center" class="buttonGroup" v-if="this.flag1==='0'">
      <el-button type="primary" @click="prev" round>上一步</el-button>
    </div>
    <div id="center" class="buttonGroup" v-if="this.flag1==='1'">
      <el-button type="primary" @click="prev1" round>返回</el-button>
    </div>
  </div>
</template>
  <script>
import { postRequest } from "@/utils/api";
export default {
  data() {
    return {
      flag1:100,
      factorNum: null,
      associationNum: null,
      associationNum2: null,
      categoryNum: null,
      factorName: '',
      associationFactor: '',
      form: {
        id: null,
        name: null,
        type: null,
        description: null,
        disease: null,
        factor: null,
        tableName: null,
        algorithmName: null,
      },
      tableData: [],
      myChart4: {},
      myChart1: {},
      myChart2: {},
      graph: { nodes: [], links: [], categories: [] },
      graph1: { nodes: [], links: [], categories: [] },
      graph2: { nodes: [], links: [], categories: [] },
      graphAll: {},
      options: [{
        value: 0.1,
        label: '前10%'
      }, {
        value: 0.25,
        label: '前25%'
      }, {
        value: 0.5,
        label: '前50%'
      }, {
        value: 0.75,
        label: '前75%'
      }, {
        value: 1,
        label: '前100%'
      }
      ],
      value: null,
      facShow: [],
      factorShow: [{
        value: 'head',
        label: '头颈',
        children: []
      }, {
        value: 'thoracodorsal',
        label: '胸背',
        children: []
      }, {
        value: 'belly',
        label: '腹部',
        children: []
      }, {
        value: 'limb',
        label: '四肢',
        children: []
      }, {
        value: 'others',
        label: '其他',
        children: []
      }],
      categories: [
        { name: "部位：头颈" }, { name: "部位：胸背" }, { name: "部位：腹部" }, { name: "部位：四肢" }, { name: "部位：其他" }
      ],
      loading: true
    };
  },
  created() {
    console.log("测试")
    console.log(this.$route.query)
    this.diseaseShow1 = this.$route.query.diseaseShow
    this.diseasesShow1 = this.$route.query.diseasesShow
    this.factorShow1 = this.$route.query.factorShow
    this.factorsShow1 = this.$route.query.factorsShow
    this.flag1 = this.$route.query.flag
    this.form = this.$route.query.form
    this.getGraph().then(() => {
      this.drawChart();
      this.getCheckFactor();
      this.defaultShow();
    }).catch((error) => {
      console.log(error)
    });
  },
  methods: {
    prev() {
      this.$router.push({ path: '/sideBar/mining', query: { form: this.form, diseasesShow:this.diseasesShow1, factorsShow:this.factorsShow1, diseaseShow:this.diseaseShow1, factorShow:this.factorShow1, flag:this.flag2} })
      console.log("打印")
      console.log(this.$route.query)
    },
    prev1(){
      this.$router.push('/sideBar/task/list')
    },
    async getGraph() {
      this.loading = true
      await postRequest("mining/runing", this.form).then(
        response => {
          console.log(response)
          this.graphAll = response
          var nodes = []
          // 删除孤立点
          for (var n in this.graphAll.nodes) {
            for (var l in this.graphAll.links) {
              if (this.graphAll.links[l].source == n || this.graphAll.links[l].target == n) {
                nodes.push(this.graphAll.nodes[n])
                break;
              }
            }
          }
          // 对每个节点根据关联数赋权值
          var lenD = 0
          for (var e in nodes) {
            lenD++
            e
          }
          var a = 0
          if (lenD < 40) {
            a = 2
          } else if (lenD < 80) {
            a = 4
          } else {
            a = 5
          }
          var symbolSize = a
          for (n in this.graphAll.nodes) {
            for (l in this.graphAll.links) {
              if (this.graphAll.links[l].source == n || this.graphAll.links[l].target == n) {
                symbolSize += a
              }
            }
            this.graphAll.nodes[n].symbolSize = symbolSize
            symbolSize = a
          }
          for (var i = 0; i < 5; i++)
            for (n in nodes) {
              if (nodes[n].category == i) {
                this.graph.nodes.push(nodes[n])
              }
            }
          this.graph.nodes = nodes
          this.graph.links = this.graphAll.links
          this.graph.categories = this.graphAll.categories
        })
      var lenF = 0
      for (var e in this.graph.nodes) {
        lenF++
        e
      }
      this.factorNum = lenF
      var lenA = 0
      for (var a in this.graph.links) {
        lenA++
        a
      }
      this.associationNum = lenA
      this.associationNum2 = lenA
      var lenC = 0
      for (var c in this.graph.categories) {
        lenC++
        c
      }
      this.categoryNum = lenC
      this.loading = false
    },
    getCheckFactor() {
      for (var n in this.graph.nodes) {
        var check = { value: null, label: null }
        if (this.graph.nodes[n].category == 0) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[0].children.push(check)
        } else if (this.graph.nodes[n].category == 1) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[1].children.push(check)
        } else if (this.graph.nodes[n].category == 2) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[2].children.push(check)
        } else if (this.graph.nodes[n].category == 3) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[3].children.push(check)
        } else if (this.graph.nodes[n].category == 4) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[4].children.push(check)
        }
      }
    },
    defaultShow() {
      var check = []
      for (var i in this.factorShow[0].children) {
        check[0] = 'head'
        check[1] = this.factorShow[0].children[i].value
        this.facShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.factorShow[1].children) {
        check[0] = 'thoracodorsal'
        check[1] = this.factorShow[1].children[i].value
        this.facShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.factorShow[2].children) {
        check[0] = 'belly'
        check[1] = this.factorShow[2].children[i].value
        this.facShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.factorShow[3].children) {
        check[0] = 'limb'
        check[1] = this.factorShow[3].children[i].value
        this.facShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      this.checkFactor();
      this.showTableGraph(this.facShow[0][1]);

    },
    checkFactor() {
      // let dis = this.form.disease.split(",")
      this.associationFactor = ''
      this.graph1 = { nodes: [], links: [], categories: [] }
      var links = []
      var assFac = []
      var tableItem = { factorName: null, associationFactor: null }
      for (var i = 0; i < this.facShow.length; i++) {
        for (var j in this.graph.nodes) {
          if (this.graph.nodes[j].name == this.facShow[i][1]) {
            this.graph1.nodes.push(this.graph.nodes[j])
            break;
          }
        }
        // assDis.push(this.disShow[i][1])
        for (var p in this.graph.links) {
          if (this.graph.links[p].source == this.graph1.nodes[i].id) {
            assFac.push("(" + this.graphAll.nodes[this.graph.links[p].target].name + "," + this.graph.links[p].value + ")")
            links.push(this.graph.links[p])
          } else if (this.graph.links[p].target == this.graph1.nodes[i].id) {
            assFac.push("(" + this.graphAll.nodes[this.graph.links[p].source].name + "," + this.graph.links[p].value + ")")
            links.push(this.graph.links[p])
          }
        }
        tableItem.factorName = this.facShow[i][1]
        tableItem.associationFactor = assFac
        this.tableData.push(tableItem)
        tableItem = []
        // this.associationFactor = this.associationFactor.concat((i + 1) + "." + this.facShow[i][1] + ":" + assFac.toString() + "\n")
        assFac = []
      }
      this.graph1.links = links
      console.log(this.graph1)
      this.drawChart1();
    },
    showTableGraph(factorName) {
      this.graph2 = { nodes: [], links: [], categories: [] }
      var id
      var node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var i in this.graph.nodes) {
        if (this.graph.nodes[i].name == factorName) {
          id = this.graph.nodes[i].id.toString()
          node.id = this.graph.nodes[i].id
          node.name = this.graph.nodes[i].name
          node.symbolSize = 15
          node.category = this.graph.nodes[i].category
          this.graph2.nodes.push(node)
          break
        }
      }
      node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var j in this.graph.links) {
        if (this.graph.links[j].source == id) {
          this.graph2.links.push(this.graph.links[j])
          node.id = this.graphAll.nodes[this.graph.links[j].target].id
          node.name = this.graphAll.nodes[this.graph.links[j].target].name
          node.symbolSize = 6
          node.category = this.graphAll.nodes[this.graph.links[j].target].category
          this.graph2.nodes.push(node)
        } else if (this.graph.links[j].target == id) {
          this.graph2.links.push(this.graph.links[j])
          // node = this.graphAll.nodes[this.graph.links[j].source]
          node.id = this.graphAll.nodes[this.graph.links[j].source].id
          node.name = this.graphAll.nodes[this.graph.links[j].source].name
          node.symbolSize = 4
          node.category = this.graphAll.nodes[this.graph.links[j].source].category
          this.graph2.nodes.push(node)
        }
        node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      }
      // this.graph2.categories = this.graph.categories
      console.log(this.graph2)
      this.drawChart2();
    },
    reDraw(value) {
      this.associationNum = Math.ceil(value * this.associationNum2)
      var w
      if (this.value == 1) {
        w = 2
      } else if (value == 0.75) {
        w = 6
      } else if (value == 0.5) {
        w = 8
      } else if (value == 0.25) {
        w = 12
      } else if (value == 0.1) {
        w = 18
      }
      this.graph = { nodes: [], links: [], categories: [] }
      // this.graph.nodes = this.graphAll.nodes
      this.graph.categories = this.graphAll.categories
      for (var i = 0; i < this.associationNum; i++) {
        this.graph.links.push(this.graphAll.links[i])
      }
      var symbolSize = w
      var nodes = []
      var lenD = 0
      // 对每个节点根据关联数赋权值
      for (var n in this.graphAll.nodes) {
        for (var l in this.graph.links) {
          if (this.graph.links[l].source == n || this.graph.links[l].target == n) {
            symbolSize += w
          }
        }
        this.graphAll.nodes[n].symbolSize = symbolSize
        symbolSize = w
      }
      // 删除孤立点
      for (n in this.graphAll.nodes) {
        for (l in this.graph.links) {
          if (this.graph.links[l].source == n || this.graph.links[l].target == n) {
            nodes.push(this.graphAll.nodes[n])
            lenD++
            break;
          }
        }
      }
      this.factorNum = lenD
      this.graph.nodes = nodes
      this.drawChart();
      var factorShow = [{
        value: 'head',
        label: '头颈',
        children: []
      }, {
        value: 'thoracodorsal',
        label: '胸背',
        children: []
      }, {
        value: 'belly',
        label: '腹部',
        children: []
      }, {
        value: 'limb',
        label: '四肢',
        children: []
      }, {
        value: 'others',
        label: '其他',
        children: []
      }]
      this.factorShow = factorShow
      this.getCheckFactor();
    },
    drawChart() {
      this.myChart4 = this.$echarts.init(document.getElementById("chart4"));

      this.graph.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 20
        };
      });

      let option = {
        // title: {
        //   text: '危险因素关联图',
        //   subtext: 'Circular layout',
        //   top: 'bottom',
        //   left: 'right'
        // },
        tooltip: {},
        legend: [
          {
            data: this.categories.map(function (a) {
              return a.name;
            })
          }
        ],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: 'Les Miserables',
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            data: this.graph.nodes,
            links: this.graph.links,
            categories: this.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      this.myChart4.setOption(option);
    },
    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById("chart1"));

      this.graph1.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 2
        };
      });

      let option = {
        // title: {
        // text: '所选疾病关联情况',
        // subtext: 'Circular layout',
        //   top: 'bottom',
        //   left: 'right'
        // },
        tooltip: {},
        legend: [
          {
            data: this.graph1.categories.map(function (a) {
              return a.name;
            })
          }
        ],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            // name: 'Les Miserables',
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            data: this.graph1.nodes,
            links: this.graph1.links,
            categories: this.graph.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      this.myChart1.setOption(option);
    },
    drawChart2() {
      this.myChart2 = this.$echarts.init(document.getElementById("chart2"));

      this.graph2.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 2
        };
      });

      let option = {
        tooltip: {},
        legend: [
          {
            data: this.graph2.categories.map(function (a) {
              return a.name;
            })
          }
        ],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            // name: 'Les Miserables',
            type: 'graph',
            layout: 'circular',
            circular: {
              rotateLabel: true
            },
            data: this.graph2.nodes,
            links: this.graph2.links,
            categories: this.graph.categories,
            roam: true,
            label: {
              position: 'right',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            }
          }
        ]
      };
      this.myChart2.setOption(option);
    },
  },
  mounted() {

    // this.drawChart();
    //   this.$nextTick(() => {
    //     let WindowBrowerHeight = window.innerHeight;
    //     if (this.WindowScreenHeight == WindowBrowerHeight) {
    //       this.fullscreen = true;
    //     } else {
    //       this.fullscreen = false;
    //     }
    //   });

    //   const initChart = () => {
    //     this.myChart4.resize({ width: 600, height: 400 });
    //   };
    //   const checkFull = () => {
    //     let isFull =
    //       document.fullscreenElement ||
    //       document.mozFullScreenElement ||
    //       document.webkitFullscreenElement;
    //     if (isFull === undefined) isFull = false;
    //     return isFull;
    //   };
    //   const flag = this;
    //   window.onresize = function () {
    //     const fullDom = checkFull();
    //     if (!fullDom) {
    //       initChart();
    //       flag.$set(flag.isFull, "ok", false);
    //     }
    //   };
  },
};
  </script>
  <style lang="scss">
#center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.buttonGroup {
  margin-left: 40%;
  bottom: 30px;
  position: fixed;
  //margin-right: auto;
}
</style>