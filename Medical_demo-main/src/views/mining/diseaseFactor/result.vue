<template>
  <div>
    <el-header>
      <h3>疾病-危险因素关联关系挖掘</h3>
      <span style="margin-top: 10px">注释：此模块挖掘疾病和危险因素潜在的关联关系，并以关系图形式展示，其中彩色节点代表疾病，深色节点代表危险因素</span>
      <el-divider></el-divider>
    </el-header>
    <div style="margin-top: 10px">
      <el-tabs type="border-card">
        <el-tab-pane label="多病种关联查询">
          <el-row>
            <el-col :span="10">
              <el-card style="margin-right: 10px; height: 500px" v-loading="loading">
                <div style="margin-top: 10px">
                  <el-form :inline="true">
                    <el-form-item label="选择疾病">
                      <el-cascader
                        style="width: 300px"
                        placeholder="试试搜索：心脑血管"
                        :options="diseaseShow"
                        :props="{ multiple: true }"
                        v-model="disShow"
                        clearable
                        collapse-tags
                        filterable
                      ></el-cascader>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="checkDisease"
                        style="width: 46px"
                        size="mini"
                        >查询</el-button
                      >
                    </el-form-item>
                  </el-form>
                  <span>注释：a:A,B,C代表疾病A、B、C都含有危险因素a，在右侧进行图谱展示</span>
                  <el-form :inline="true">
                    <el-form-item label="疾病共有危险因素">
                      <el-input
                        style="width: 300px"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        placeholder="共有危险因素"
                        v-model="shareDisease"
                        :disabled="true"
                      >
                      </el-input>
                    </el-form-item>
                  </el-form>

                  <span>注释：是否新增关联代表该关联是在原有数据表中还是通过算法挖掘出的，在右侧进行图谱展示</span>
                  <el-table
                    :data="tableData1"
                    border
                    style="width: 100%"
                    max-height="220"
                  >
                    <el-table-column
                      fixed
                      prop="diseaseName"
                      label="疾病"
                    ></el-table-column>
                    <af-table-column
                      prop="associationFactor"
                      label="相关联危险因素（危险因素，权重，是否新增关联）"
                    >
                    </af-table-column>
                    <el-table-column fixed="right" label="操作" width="70">
                      <template slot-scope="{ row }">
                        <el-button
                          size="mini"
                          @click="showTableGraph1(row.diseaseName)"
                          >展示</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <el-form :inline="true">
                    <el-form-item label="单疾病关联">
                      <el-input
                        style="width: 575px"
                        type="textarea"
                        :autosize="{ minRows: 10, maxRows: 10 }"
                        placeholder="单疾病关联"
                        v-model="associationDisease"
                      >
                      </el-input>
                    </el-form-item>
                  </el-form> -->
                </div>
              </el-card>
            </el-col>
            <el-col :span="7">
              <el-card style="height: 500px; margin-right: 10px" v-loading="loading">
                <div slot="header" class="clearfix">
                  <span class="lineStyle">▍</span
                  ><span>所选疾病共有症状关联图谱展示</span>
                  <br>
                  <span>注释：对应于左边疾病共有危险因素文本框</span>
                </div>
                <div id="chart1" style="width: 100%; height: 360px"></div>
              </el-card>
            </el-col>
            <el-col :span="7">
              <el-card style="height: 500px" v-loading="loading">
                <div slot="header" class="clearfix">
                  <span class="lineStyle">▍</span
                  ><span>单病种关联图谱展示</span>
                  <br>
                  <span>注释：对应于左边疾病关联危险因素表格</span>
                </div>
                <div id="chart3" style="width: 100%; height: 360px"></div>
              </el-card>
            </el-col>
            <!-- <el-col :span="7">
              <el-card style="height: 460px">
                <el-row>
                  <el-col :span="1" style="margin-right: 45px">
                    <h4>所选疾病共有症状图谱展示</h4>
                  </el-col>
                  <el-col :span="21">
                    <div id="chart1" style="width: 600px; height: 450px"></div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col> -->
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="多危险因素关联查询">
          <el-row>
            <el-col :span="10">
              <el-card style="margin-right: 10px; height: 500px" v-loading="loading">
                <div style="margin-top: 10px">
                  <el-form :inline="true">
                    <el-form-item label="选择危险因素">
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
                        style="width: 46px"
                        size="mini"
                        >查询</el-button
                      >
                    </el-form-item>
                  </el-form>
                  <el-form :inline="true">
                    <span>注释：A:a,b,c代表危险因素a、b、c都属于疾病A，在右侧进行图谱展示</span>
                    <el-form-item label="危险因素共属疾病">
                      <el-input
                        style="width: 300px"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 4 }"
                        placeholder="共属疾病"
                        v-model="shareFactor"
                        :disabled="true"
                      >
                      </el-input>
                    </el-form-item>
                  </el-form>
                  <span>注释：是否新增关联代表该关联是在原有数据表中还是通过算法挖掘出的，在右侧进行图谱展示</span>
                  <el-table
                    :data="tableData2"
                    border
                    style="width: 100%"
                    max-height="220"
                  >
                    <el-table-column
                      fixed
                      prop="factorName"
                      label="症状"
                    ></el-table-column>
                    <af-table-column
                      prop="associationDisease"
                      label="相关联疾病（疾病，权重，是否新增）"
                    >
                    </af-table-column>
                    <el-table-column fixed="right" label="操作" width="70">
                      <template slot-scope="{ row }">
                        <el-button
                          size="mini"
                          @click="showTableGraph2(row.factorName)"
                          >展示</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <el-form :inline="true">
                    <el-form-item label="单症状关联">
                      <el-input
                        style="width: 575px"
                        type="textarea"
                        :autosize="{ minRows: 10, maxRows: 10 }"
                        placeholder="单症状关联"
                        v-model="associationFactor"
                      >
                      </el-input>
                    </el-form-item>
                  </el-form> -->
                </div>
              </el-card>
            </el-col>
            <el-col :span="7">
              <el-card style="height: 500px; margin-right: 10px" v-loading="loading">
                <div slot="header" class="clearfix">
                  <span class="lineStyle">▍</span
                  ><span>所选症状共属疾病关联图谱展示</span>
                  <br>
                  <span>注释：对应于左边危险因素共属疾病文本框</span>
                </div>
                <div id="chart2" style="width: 300px; height: 360px"></div>
              </el-card>
            </el-col>
            <el-col :span="7">
              <el-card style="height: 500px" v-loading="loading">
                <div slot="header" class="clearfix">
                  <span class="lineStyle">▍</span
                  ><span>单症状关联图谱展示</span>
                  <br>
                  <span>注释：对应于左边危险因素关联疾病表格</span>
                </div>
                <div id="chart4" style="width: 300px; height: 360px"></div>
              </el-card>
            </el-col>
            <!-- <el-col :span="12">
              <el-card style="height: 460px">
                <el-row>
                  <el-col :span="1" style="margin-right: 45px">
                    <h4>所选症状共属疾病图谱展示</h4>
                  </el-col>
                  <el-col :span="21">
                    <div id="chart2" style="width: 600px; height: 450px"></div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col> -->
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin-top: 30px" id="min2">
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
              <h3>疾病-危险因素关联图</h3>
              <el-button type="success" style="margin-left: 1200px" @click="getPdf2()" round>导出结果</el-button>
              <div style="width: 100%;margin-top: 10px">
                <span class="lineStyle">▍</span><span>图谱统计信息：</span>
                <span>病种数量：{{ diseaseNum }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>症状数量：{{ factorNum }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>关联边数量：{{ associationNum }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>原有关联：{{ oldNum }}</span>
                <el-divider direction="vertical"></el-divider>
                <span>新增关联：{{ newNum }}</span>
              </div>
              <span class="lineStyle">▍</span
              ><span>需要显示的关联边数量：</span>

                <el-button type="text" @click="reDraw(0.1)">前10%</el-button>
                <el-button type="text" @click="reDraw(0.25)">前25%</el-button>
                <el-button type="text" @click="reDraw(0.5)">前50%</el-button>
                <el-button type="text" @click="reDraw(0.75)">前75%</el-button>
                <el-button type="text" @click="reDraw(1)">全部</el-button>
                <br>
                <span>注释：根据关联边权重选择需要展示的关联数量,同时可点击下方疾病与危险分类对图谱进行过滤</span>
            </div>
            <div
              id="chart5"
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
      diseaseNum: null,
      diseaseAllNum: null,
      factorNum: null,
      factorAllNum: null,
      associationNum: null,
      associationNum2: null,
      newNum: null,
      newNum2: null,
      oldNum: null,
      oldNum2: null,
      tableData1: [],
      tableData2: [],
      diseaseName: '',
      disease: [],
      disShow: [],
      diseaseShow: [{
        value: 'cardiovascular_cerebrovascular',
        label: '心脑血管',
        children: []
      }, {
        value: 'metabolic_system',
        label: '代谢系统',
        children: []
      }, {
        value: 'cancer',
        label: '恶性肿瘤',
        children: []
      }, {
        value: 'mental_disorder',
        label: '精神疾病',
        children: []
      }, {
        value: 'respiratory_system',
        label: '呼吸系统',
        children: []
      }, {
        value: 'others',
        label: '其他',
        children: []
      }],
      factorName: '',
      factor: [],
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
      associationDisease: '',
      shareDisease: '',
      associationFactor: '',
      shareFactor: '',
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
      myChart5: {},
      myChart1: {},
      myChart2: {},
      myChart3: {},
      myChart4: {},
      graph: {},
      graph1: { nodes: [], links: [], categories: [] },
      graph2: { nodes: [], links: [], categories: [] },
      graph3: { nodes: [], links: [], categories: [] },
      graph4: { nodes: [], links: [], categories: [] },
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
      categories: [
        { name: "心脑血管疾病" }, { name: "代谢系统疾病" }, { name: "恶性肿瘤疾病" }, { name: "精神疾病" }, { name: "呼吸系统疾病" }, { name: "其他疾病" },
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
      this.getCheckDiseaseAndFactor();
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
          lenD = 0
          for (e in nodes) {
            lenD++
            e
          }
          var a = 1
          if (lenD < 40) {
            a = 12
          } else if (lenD < 80) {
            a = 4
          } else if (lenD < 110) {
            a = 3
          } else {
            a = 1.5
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
          this.graph.nodes = nodes
          this.graph.links = this.graphAll.links
          this.graph.categories = this.graphAll.categories
        })
      var lenD = 0
      var lenF = 0
      for (var e in this.graph.nodes) {
        if (this.graph.nodes[e].category < 6) {
          this.disease.push(this.graph.nodes[e])
          lenD++;
        } else {
          this.factor.push(this.graph.nodes[e])
          lenF++;
        }
        e
      }
      this.diseaseNum = lenD
      this.factorNum = lenF
      var lenA = 0
      var lenOld = 0
      var lenNew = 0
      for (var a in this.graph.links) {
        lenA++
        if (this.graph.links[a].isNew == true) {
          lenOld++
        }
        else {
          lenNew++
        }
        a
      }
      var len1 = 0
      var len2 = 0
      for (e in this.graphAll.nodes) {
        if (this.graphAll.nodes[e].category > 5) {
          len1++
        } else { len2++ }

      }
      this.factorAllNum = len1
      this.diseaseAllNum = len2
      this.associationNum = lenA
      this.associationNum2 = lenA
      this.oldNum = lenOld
      this.newNum = lenNew
      this.loading = false
    },
    getCheckDiseaseAndFactor() {
      for (var n in this.graph.nodes) {
        var check = { value: null, label: null }
        if (this.graph.nodes[n].category == 0) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[0].children.push(check)
        } else if (this.graph.nodes[n].category == 1) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[1].children.push(check)
        } else if (this.graph.nodes[n].category == 2) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[2].children.push(check)
        } else if (this.graph.nodes[n].category == 3) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[3].children.push(check)
        } else if (this.graph.nodes[n].category == 4) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[4].children.push(check)
        } else if (this.graph.nodes[n].category == 5) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.diseaseShow[5].children.push(check)
        } else if (this.graph.nodes[n].category == 6) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[0].children.push(check)
        } else if (this.graph.nodes[n].category == 7) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[1].children.push(check)
        } else if (this.graph.nodes[n].category == 8) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[2].children.push(check)
        } else if (this.graph.nodes[n].category == 9) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[3].children.push(check)
        } else if (this.graph.nodes[n].category == 10) {
          check.value = this.graph.nodes[n].name
          check.label = this.graph.nodes[n].name
          this.factorShow[4].children.push(check)
        }
      }
    },
    defaultShow() {
      var check = []
      for (var i in this.diseaseShow[0].children) {
        check[0] = 'cardiovascular_cerebrovascular'
        check[1] = this.diseaseShow[0].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.diseaseShow[1].children) {
        check[0] = 'metabolic_system'
        check[1] = this.diseaseShow[1].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.diseaseShow[2].children) {
        check[0] = 'cancer'
        check[1] = this.diseaseShow[2].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      for (i in this.diseaseShow[3].children) {
        check[0] = 'mental_disorder'
        check[1] = this.diseaseShow[3].children[i].value
        this.disShow.push(check)
        check = []
        if (i >= 1) {
          break
        }
      }
      this.checkDisease();
      this.showTableGraph1(this.disShow[0][1]);

      check = []
      for (i in this.factorShow[0].children) {
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
      this.showTableGraph2(this.facShow[0][1]);
    },
    checkDisease() {
      this.associationDisease = ''
      this.shareDisease = ''
      this.tableData1 = []
      var tableItem = { diseaseName: null, associationFactor: null }
      this.graph1 = { nodes: [], links: [], categories: [] }
      var links = []
      var facId = []
      var assFac = []
      var assDis = []
      var num = new Array(this.factorAllNum).fill(0)
      for (var i = 0; i < this.disShow.length; i++) {
        for (var j in this.graph.nodes) {
          if (this.graph.nodes[j].name == this.disShow[i][1]) {
            this.graph1.nodes.push(this.graph.nodes[j])
            break;
          }
        }
        for (var p in this.graph.links) {
          if (this.graph.links[p].source == this.graph1.nodes[i].id) {
            links.push(this.graph.links[p])
            var t
            if (this.graph.links[p].isNew == true) {
              t = "新增"
            } else {
              t = "原有"
            }
            num[this.graph.links[p].target - this.diseaseAllNum]++
            assFac.push("(" + this.graphAll.nodes[this.graph.links[p].target].name + "," + this.graph.links[p].value + "," + t + ")")
          }
        }
        tableItem.diseaseName = this.disShow[i][1]
        tableItem.associationFactor = assFac
        this.tableData1.push(tableItem)
        tableItem = []
        // this.associationDisease = this.associationDisease.concat((i + 1) + "." + this.disShow[i][1] + ":" + assFac.toString() + "\n")
        assFac = []
      }
      for (i in num) {
        if (num[i] > 1) {
          var id = Number(i) + this.diseaseAllNum
          facId.push(id)
        }
      }
      for (i in facId) {
        this.graph1.nodes.push(this.graphAll.nodes[facId[i]])
        for (p in links) {
          if (links[p].target == facId[i]) {
            this.graph1.links.push(links[p])
            assDis.push(this.graphAll.nodes[links[p].source].name)
          }
        }
        this.shareDisease = this.shareDisease.concat((Number(i) + 1) + "." + this.graphAll.nodes[facId[i]].name + ":" + assDis.toString() + "\n")
        assDis = []
      }
      console.log(this.graph1)
      this.drawChart1();
    },
    checkFactor() {
      this.associationFactor = ''
      this.shareFactor = ''
      this.tableData2 = []
      var tableItem = { factorName: null, associationDisease: null }
      this.graph2 = { nodes: [], links: [], categories: [] }
      var links = []
      var disId = []
      var assFac = []
      var assDis = []
      var num = new Array(this.diseaseAllNum).fill(0)
      for (var i = 0; i < this.facShow.length; i++) {
        for (var j in this.graph.nodes) {
          if (this.graph.nodes[j].name == this.facShow[i][1]) {
            this.graph2.nodes.push(this.graph.nodes[j])
            break;
          }
        }
        for (var p in this.graph.links) {
          if (this.graph.links[p].target == this.graph2.nodes[i].id) {
            links.push(this.graph.links[p])
            var t
            if (this.graph.links[p].isNew == true) {
              t = "新增"
            } else {
              t = "原有"
            }
            num[this.graph.links[p].source]++
            assDis.push("(" + this.graphAll.nodes[this.graph.links[p].source].name + "," + this.graph.links[p].value + "," + t + ")")
          }
        }
        tableItem.factorName = this.facShow[i][1]
        tableItem.associationDisease = assDis
        this.tableData2.push(tableItem)
        tableItem = []
        // this.associationFactor = this.associationFactor.concat((i + 1) + "." + this.facShow[i][1] + ":" + assDis.toString() + "\n")
        assDis = []
      }
      for (i in num) {
        if (num[i] > 1) {
          var id = Number(i)
          disId.push(id)
        }
      }
      for (i in disId) {
        this.graph2.nodes.push(this.graphAll.nodes[disId[i]])
        for (p in links) {
          if (links[p].source == disId[i]) {
            this.graph2.links.push(links[p])
            assFac.push(this.graphAll.nodes[links[p].target].name)
          }
        }
        this.shareFactor = this.shareFactor.concat((Number(i) + 1) + "." + this.graphAll.nodes[disId[i]].name + ":" + assFac.toString() + "\n")
        assFac = []
      }
      console.log(this.graph2)
      this.drawChart2();
    },
    showTableGraph1(diseaseName) {
      this.graph3 = { nodes: [], links: [], categories: [] }
      var id
      var node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var i in this.graph.nodes) {
        if (this.graph.nodes[i].name == diseaseName) {
          id = this.graph.nodes[i].id.toString()
          node.id = this.graph.nodes[i].id
          node.name = this.graph.nodes[i].name
          node.symbolSize = 15
          node.category = this.graph.nodes[i].category
          this.graph3.nodes.push(node)
          break
        }
      }
      node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var j in this.graph.links) {
        if (this.graph.links[j].source == id) {
          this.graph3.links.push(this.graph.links[j])
          node.id = this.graphAll.nodes[this.graph.links[j].target].id
          node.name = this.graphAll.nodes[this.graph.links[j].target].name
          node.symbolSize = 6
          node.category = this.graphAll.nodes[this.graph.links[j].target].category
          this.graph3.nodes.push(node)
        }
        node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      }
      // this.graph2.categories = this.graph.categories
      console.log(this.graph3)
      this.drawChart3();
    },
    showTableGraph2(factorName) {
      this.graph4 = { nodes: [], links: [], categories: [] }
      var id
      var node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var i in this.graph.nodes) {
        if (this.graph.nodes[i].name == factorName) {
          id = this.graph.nodes[i].id.toString()
          node.id = this.graph.nodes[i].id
          node.name = this.graph.nodes[i].name
          node.symbolSize = 15
          node.category = this.graph.nodes[i].category
          this.graph4.nodes.push(node)
          break
        }
      }
      node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      for (var j in this.graph.links) {
        if (this.graph.links[j].target == id) {
          this.graph4.links.push(this.graph.links[j])
          // node = this.graphAll.nodes[this.graph.links[j].source]
          node.id = this.graphAll.nodes[this.graph.links[j].source].id
          node.name = this.graphAll.nodes[this.graph.links[j].source].name
          node.symbolSize = 4
          node.category = this.graphAll.nodes[this.graph.links[j].source].category
          this.graph4.nodes.push(node)
        }
        node = { id: null, name: null, value: null, symbolSize: null, label: null, category: null }
      }
      // this.graph2.categories = this.graph.categories
      console.log(this.graph4)
      this.drawChart4();
    },
    reDraw(value) {
      this.associationNum = Math.ceil(value * this.associationNum2)
      var w
      if (value == 1) {
        w = 2
      } else if (value == 0.75) {
        w = 2.2
      } else if (value == 0.5) {
        w = 3.3
      } else if (value == 0.25) {
        w = 4
      } else if (value == 0.1) {
        w = 10
      }
      this.graph = { nodes: [], links: [], categories: [] }
      this.graph.nodes = this.graphAll.nodes
      this.graph.categories = this.graphAll.categories
      for (var i = 0; i < this.associationNum; i++) {
        this.graph.links.push(this.graphAll.links[i])
      }
      var symbolSize = w
      var nodes = []
      var lenD = 0
      var lenF = 0
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
            if (this.graphAll.nodes[n].category < 6) {
              lenD++
            } else { lenF++ }
            break;
          }
        }
      }
      this.diseaseNum = lenD
      this.factorNum = lenF
      this.graph.nodes = nodes
      var lenOld = 0
      var lenNew = 0
      for (var a in this.graph.links) {
        if (this.graph.links[a].isNew == true) {
          lenOld++
        }
        else {
          lenNew++
        }
        a
      }
      this.oldNum = lenOld
      this.newNum = lenNew
      this.drawChart();
    },
    drawChart() {
      this.myChart5 = this.$echarts.init(document.getElementById("chart5"));

      // this.myChart4.hideLoading();
      // this.graph.nodes.forEach(function (node) {
      //   node.label = {
      //     show: node.symbolSize > 1
      //   };
      // });
      // let option = {
      //   title: {
      //     text: '疾病-症状关联网络',
      //     subtext: 'Default layout',
      //     top: 'bottom',
      //     left: 'right'
      //   },
      //   tooltip: {},
      //   legend: [
      //     {
      //       // selectedMode: 'single',
      //       data: this.graph.categories.map(function (a) {
      //         return a.name;
      //       })
      //     }
      //   ],
      //   animationDuration: 1500,
      //   animationEasingUpdate: 'quinticInOut',
      //   series: [
      //     {
      //       name: 'Les Miserables',
      //       type: 'graph',
      //       layout: 'force',
      //       data: this.graph.nodes,
      //       links: this.graph.links,
      //       categories: this.graph.categories,
      //       roam: true,
      //       label: {
      //         position: 'right',
      //         formatter: '{b}'
      //       },
      //       lineStyle: {
      //         color: 'source',
      //         curveness: 0.3
      //       },
      //       emphasis: {
      //         focus: 'adjacency',
      //         lineStyle: {
      //           width: 10
      //         }
      //       }
      //     }
      //   ]
      // };
      // this.myChart4.setOption(option);

      this.graph.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 15
        };
      });

      let option = {
        color: [
          '#c23531', '#61a0a8', '#d48265', '#749f83', '#ca8622', '#bda29a', '#2f4554', '#546570', '#433b5e', '#6C7B8B', '#1C1C1C'
        ],
        // title: {
        //   text: '疾病-危险因素关联图',
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
        // focusNodeAdjacency: true,
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
      this.myChart5.setOption(option);
    },
    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById("chart1"));

      this.graph1.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 2
        };
      });

      let option = {
        color: [
          '#c23531', '#61a0a8', '#d48265', '#749f83', '#ca8622', '#bda29a', '#2f4554', '#546570', '#433b5e', '#6C7B8B', '#1C1C1C'
        ],
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
        color: [
          '#c23531', '#61a0a8', '#d48265', '#749f83', '#ca8622', '#bda29a', '#2f4554', '#546570', '#433b5e', '#6C7B8B', '#1C1C1C'
        ],
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
    drawChart3() {
      this.myChart3 = this.$echarts.init(document.getElementById("chart3"));

      this.graph3.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 2
        };
      });

      let option = {
        color: [
          '#c23531', '#61a0a8', '#d48265', '#749f83', '#ca8622', '#bda29a', '#2f4554', '#546570', '#433b5e', '#6C7B8B', '#1C1C1C'
        ],
        tooltip: {},
        legend: [
          {
            data: this.graph3.categories.map(function (a) {
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
            data: this.graph3.nodes,
            links: this.graph3.links,
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
      this.myChart3.setOption(option);
    },
    drawChart4() {
      this.myChart4 = this.$echarts.init(document.getElementById("chart4"));

      this.graph4.nodes.forEach(function (node) {
        node.label = {
          show: node.symbolSize > 2
        };
      });

      let option = {
        color: [
          '#c23531', '#61a0a8', '#d48265', '#749f83', '#ca8622', '#bda29a', '#2f4554', '#546570', '#433b5e', '#6C7B8B', '#1C1C1C'
        ],
        tooltip: {},
        legend: [
          {
            data: this.graph4.categories.map(function (a) {
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
            data: this.graph4.nodes,
            links: this.graph4.links,
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
      this.myChart4.setOption(option);
    },

  },
  mounted() {
    // this.drawChart();
    // this.$nextTick(() => {
    //   let WindowBrowerHeight = window.innerHeight;
    //   if (this.WindowScreenHeight == WindowBrowerHeight) {
    //     this.fullscreen = true;
    //   } else {
    //     this.fullscreen = false;
    //   }
    // });

    // const initChart = () => {
    //   this.myChart4.resize({ width: 600, height: 400 });
    // };
    // const checkFull = () => {
    //   let isFull =
    //     document.fullscreenElement ||
    //     document.mozFullScreenElement ||
    //     document.webkitFullscreenElement;
    //   if (isFull === undefined) isFull = false;
    //   return isFull;
    // };
    // const flag = this;
    // window.onresize = function () {
    //   const fullDom = checkFull();
    //   if (!fullDom) {
    //     initChart();
    //     flag.$set(flag.isFull, "ok", false);
    //   }
    // };
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