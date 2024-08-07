<template>
  <el-row>
    <el-col :span="12">
      <el-card style="margin-right: 20px; margin-bottom: 20px; height: 470px">
        <el-card class="card" style="margin-bottom: 20px; height: 200px">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>快捷入口</span>
          </div>
          <div class="quickEntryBox">
            <div v-for="(item, index) in quickEntry" :key="index">
              <div class="singleBox" @click="quickLink(index)">
                <img
                  :src="item.img"
                  class="imgStyle"
                  style="border-radius: 15px"
                />
                <div style="text-align: center; font-size: 13px">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </el-card>
        <el-card style="height: 200px">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>统计数据</span>
          </div>
          <el-row :gutter="24" style="margin-top: 15px">
            <el-col :span="6">
              <div>
                <el-statistic
                  group-separator=","
                  :value="diseaseNum"
                  title="疾病总数"
                ></el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic
                  group-separator=","
                  :value="factorNum"
                  title="危险因素总数"
                ></el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic
                  group-separator=","
                  :value="associationNum"
                  title="已有关联数量"
                ></el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic
                    group-separator=","
                    :value="tasknumber"
                    title="已建任务数量"
                ></el-statistic>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin-bottom: 20px; height: 470px">
        <el-card style="margin-bottom: 20px; height: 200px">
          <el-descriptions title="疾病关联数据示例">
            <el-descriptions-item label="疾病名称">{{
              diseaseName[0]
            }}</el-descriptions-item>
            <el-descriptions-item label="相关联危险因素" :span="8">
              <div v-for="(item, index) in factorName0" :key="index">
                <div v-if="index < 3">
                  <el-tag size="small">{{ item.name }}</el-tag>
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="疾病名称">{{
              diseaseName[1]
            }}</el-descriptions-item>
            <el-descriptions-item label="相关联危险因素" :span="10">
              <div v-for="(item, index) in factorName1" :key="index">
                <div v-if="index < 3">
                  <el-tag size="small">{{ item.name }}</el-tag>
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="疾病名称">{{
              diseaseName[2]
            }}</el-descriptions-item>
            <el-descriptions-item label="相关联危险因素" :span="10">
              <div v-for="(item, index) in factorName2" :key="index">
                <div v-if="index < 3">
                  <el-tag size="small">{{ item.name }}</el-tag>
                </div>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card style="height: 200px">
          <el-descriptions title="危险因素关联数据示例">
            <el-descriptions-item label="危险因素名称">{{
              factorName[0]
            }}</el-descriptions-item>
            <el-descriptions-item label="相关联疾病" :span="16">
              <div v-for="(item, index) in diseaseName0" :key="index">
                <div v-if="index < 2">
                  <el-tag size="small">{{ item.name }}</el-tag>
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="危险因素名称">{{
              factorName[1]
            }}</el-descriptions-item>
            <el-descriptions-item label="危险因素联疾病" :span="16">
              <div v-for="(item, index) in diseaseName1" :key="index">
                <div v-if="index < 1">
                  <el-tag size="small">{{ item.name }}</el-tag>
                </div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="危险因素名称">{{
              factorName[2]
            }}</el-descriptions-item>
            <el-descriptions-item label="相关联疾病" :span="16">
              <div v-for="(item, index) in diseaseName2" :key="index">
                <div v-if="index > 4">
                  <el-tag size="small">{{ item.name }}</el-tag>
                </div>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin-right: 20px">
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>疾病统计</span>
        </div>
        <div id="chart1" style="width: 100%; height: 500px"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <div slot="header" class="clearfix">
          <span class="lineStyle">▍</span><span>危险因素统计</span>
        </div>
        <div id="chart2" style="width: 100%; height: 500px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { postRequest } from "@/utils/api";
export default {
  data() {
    return {
      disease: [],
      factor: [],
      association: [],
      diseaseNum: 0,
      factorNum: 0,
      associationNum: 0,
      tasknumber:0,
      diseaseName: [],
      diseaseName0: [],
      diseaseName1: [],
      diseaseName2: [],
      factorName: [],
      factorName0: [],
      factorName1: [],
      factorName2: [],

      diseaseInfo: {
        cardiovascular_cerebrovascular: 0,
        metabolic_system: 0,
        cancer: 0,
        mental_disorder: 0,
        respiratory_system: 0,
        others: 0
      },
      factorInfo: {
        head: 0,
        thoracodorsal: 0,
        belly: 0,
        limb: 0,
        others: 0
      },
      quickEntry: [
        {
          title: "危险因素挖掘",
          img: require("../../assets/other.png"),
          router: "/sideBar/DisFactor",
        },
        {
          title: "关联关系挖掘",
          img: require("../../assets/dataManage.png"),
          router: "/sideBar/mining",
        },
        {
          title: "数据管理",
          img: require("../../assets/ModelManage.png"),
          router: "/sideBar/data/list",
        },
        {
          title: "算法管理",
          img: require("../../assets/mutipile.png"),
          router: "/sideBar/model/list",
        },
        {
          title: "任务日志",
          img: require("../../assets/feiai.png"),
          router: "/sideBar/task/list",
        },
      ],
      listloading: true,
      myChart1: null,
      myChart2: null,
    }
  },
  created() {
    this.getAll()
    this.getAll().then(() => {
      this.drawChart1();
      this.drawChart2();
      this.diseaseName.push(this.disease[0].name)
      this.diseaseName.push(this.disease[1].name)
      this.diseaseName.push(this.disease[2].name)
      for (var d in this.association) {
        var a = this.association[d].target

        if (this.association[d].source == 1) {
          this.factorName0.push(this.factor[a])
        } else if (this.association[d].source == 2) {
          this.factorName1.push(this.factor[a])
        } else if (this.association[d].source == 3) {
          this.factorName2.push(this.factor[a])
        }
      }
      this.factorName.push(this.factor[0].name)
      this.factorName.push(this.factor[2].name)
      this.factorName.push(this.factor[3].name)
      for (var c in this.association) {
        var e = this.association[c].source
        if (this.association[c].target == 1) {
          this.diseaseName0.push(this.disease[e])
        } else if (this.association[c].target == 3) {
          this.diseaseName1.push(this.disease[e])
        } else if (this.association[c].target == 4) {
          this.diseaseName2.push(this.disease[e])
        }
      }
    }).catch((error) => {
      console.log(error)
    });
  },
  // mounted() {
  //   this.drawChart1();
  //   this.drawChart2();
  // },
  methods: {
    async getAll() {
      postRequest("info/getDisease", {}).then(
        (response) => {
          this.disease = response
          var lenDis = 0
          var lena = 0
          var lenb = 0
          var lenc = 0
          var lend = 0
          var lene = 0
          var lenf = 0
          for (var d in this.disease) {
            if (this.disease[d].category == "cardiovascular_cerebrovascular") {
              lena++
            } else if (this.disease[d].category == "metabolic_system") {
              lenb++
            } else if (this.disease[d].category == "cancer") {
              lenc++
            } else if (this.disease[d].category == "mental_disorder") {
              lend++
            } else if (this.disease[d].category == "respiratory_system") {
              lene++
            } else if (this.disease[d].category == "others") {
              lenf++
            }
            lenDis++
          }
          this.diseaseInfo.cardiovascular_cerebrovascular = lena
          this.diseaseInfo.metabolic_system = lenb
          this.diseaseInfo.cancer = lenc
          this.diseaseInfo.mental_disorder = lend
          this.diseaseInfo.respiratory_system = lene
          this.diseaseInfo.others = lenf
          this.diseaseNum = lenDis
        }
      )
      postRequest('mining/getAll', {}).then(
          (response) => {
            this.tasknumber = response.length
          }
      );
      postRequest("info/getFactor", {}).then(
        (response) => {
          // console.log(response)
          this.factor = response
          var lenFac = 0
          var len1 = 0
          var len2 = 0
          var len3 = 0
          var len4 = 0
          var len5 = 0
          for (var f in this.factor) {
            if (this.factor[f].category == "head") {
              len1++
            } else if (this.factor[f].category == "thoracodorsal") {
              len2++
            } else if (this.factor[f].category == "belly") {
              len3++
            } else if (this.factor[f].category == "limb") {
              len4++
            } else if (this.factor[f].category == "others") {
              len5++
            }
            lenFac++
          }
          this.factorInfo.head = len1
          this.factorInfo.thoracodorsal = len2
          this.factorInfo.belly = len3
          this.factorInfo.limb = len4
          this.factorInfo.others = len5
          this.factorNum = lenFac
        }
      )
      await postRequest("info/getKnowledgeNumber", {}).then(
          (response)=>{
            this.associationNum = response
          }
      )
      await postRequest("info/getAssociation", {}).then(
        (response) => {
          // console.log(response)
          this.association = response
          // var lenAss = 0
          // for (var d in this.association) {
          //   lenAss++
          //   d
          // }
          // this.associationNum = lenAss
        }
      )

      // console.log(this.diseaseInfo)
      // console.log(this.factorInfo)

      this.listLoading = false
    },
    quickLink(index) {
      console.log(this.quickEntry[index].router);
      this.$router.replace(this.quickEntry[index].router);
    },
    drawChart1() {
      this.myChart1 = this.$echarts.init(document.getElementById("chart1"));
      let option = {
        title: {
          text: '疾病种类统计',
          // subtext: '不同种类疾病',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            // name: '疾病统计',
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.diseaseInfo.cardiovascular_cerebrovascular, name: '心脑血管疾病' },
              { value: this.diseaseInfo.metabolic_system, name: '代谢系统疾病' },
              { value: this.diseaseInfo.cancer, name: '恶性肿瘤' },
              { value: this.diseaseInfo.mental_disorder, name: '精神疾病' },
              { value: this.diseaseInfo.respiratory_system, name: '呼吸系统疾病' },
              { value: this.diseaseInfo.others, name: '其他' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.myChart1.setOption(option);
    },
    drawChart2() {
      this.myChart2 = this.$echarts.init(document.getElementById("chart2"));
      let option = {
        title: {
          text: '危险因素种类统计',
          // subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            // name: '特征统计',
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.factorInfo.head, name: '头颈' },
              { value: this.factorInfo.thoracodorsal, name: '胸背' },
              { value: this.factorInfo.belly, name: '腹' },
              { value: this.factorInfo.limb, name: '四肢' },
              { value: this.factorInfo.others, name: '其他' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      this.myChart2.setOption(option);
    }
  }

}
</script>

<style>
.quickEntryBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.quickEntryBox .singleBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 80px;
  height: 80px;
  border-radius: 20%;
}
.quickEntryBox .imgStyle {
  width: 90%;
  height: 90%;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>