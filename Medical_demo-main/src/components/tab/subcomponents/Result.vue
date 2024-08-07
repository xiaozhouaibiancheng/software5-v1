<template>
  <div>
    <div id="pdf_1">
      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>任务信息:</h2>
        </div>
        <div class="taskInfo_box_card_group">
          <div class="taskInfo_box_card_item">
            <i class="el-icon-data-board" style="font-size: 25px"></i
            ><span class="featureTitle">任务名称：</span>
            <span>{{ m_taskName }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-user" style="font-size: 25px"></i
            ><span class="featureTitle">任务负责人：</span>
            <span>{{ m_principal }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-info" style="font-size: 25px"></i
            ><span class="featureTitle">参与人：</span>
            <span>{{ m_participants }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-collection-tag" style="font-size: 25px"></i
            ><span class="featureTitle">任务备注：</span>
            <span>{{ m_tips }}</span>
          </div>
        </div>
      </el-card>
      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>研究对象:</h2>
        </div>
        <div class="taskInfo_box_card_group">
          <div class="taskInfo_box_card_item">
            <i class="el-icon-takeaway-box" style="font-size: 25px;"></i><span class="featureTitle">研究病种：</span>
            <span>{{ m_disease }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-s-grid" style="font-size: 25px;"></i><span class="featureTitle">所用数据：</span>
            <span>{{ m_dataset }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-cpu" style="font-size: 25px;"></i><span class="featureTitle">所用算法：</span>
            <span>{{ m_algorithm }}</span>
          </div>

          <div class="taskInfo_box_card_item">
            <i class="el-icon-star-off" style="font-size: 25px;"></i><span class="featureTitle">所用特征：</span>
            <span>{{ m_caculate_use_features.toString() }}</span>
          </div>

        </div>
        </el-card>

      <el-card class="taskInfo_box_card">
        <div slot="header" class="">
          <h2>任务结果:</h2>
          <el-button type="success" @click="getPdf()" round style="margin-left: 1500px">导出结果</el-button>
        </div>
        <el-row>
          <el-col :span="16">
            <el-card style="margin-top: 0.8%;">
              <div class="graphBox">
                <GraphVue v-if="initFlag" :title_text="graphTitile" :node="node" :links="links"></GraphVue>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card style="margin-top: 10px; margin-left: 2%; height: 45.5vh">
              <h4>申请将危险因素加入到多病种知识库中</h4>
              <span>注释：管理员同意后才能在多病种知识库中查看</span>
              <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="危险因素"
                    width="120">
                  <template slot-scope="scope">{{ scope.row.data }}</template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="权重"
                    width="120">
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-button @click="toggleSelection()">添加</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- <el-card style="margin-top: 0.8%;">
          <div class="treeBox">
            <Tree v-if="initFlag" :title_text="graphTitile" :data="data"></Tree>
          </div>
        </el-card> -->
        <el-dialog
            :show-close="false"
            :close-on-click-modal="false"
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
          疾病名称：<el-input v-model="this.m_disease" disabled style="width: 80%;margin-bottom: 10px"></el-input>
          <br>
          疾病类别：<template>
          <el-select v-model="diseaseSelect" style="width: 80%">
            <el-option
                v-for="item in diseaseClass"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </template>
          <!-- 显示表数据 -->
          <!--          <el-table :data="multipleSelection" stripe style="width: 100%" class="custom-table" max-height="600">-->
          <el-table :data="selectMultipleData" stripe style="width: 100%" class="custom-table" max-height="600">
            <el-table-column v-for="(value, key) in selectMultipleData[0]" :key="key" :prop="key" :label="key" width="80">
              <template slot-scope="{ row }">
                <div class="truncate-text">{{ row[key] }}</div>
              </template>
            </el-table-column>
            <el-table-column label="类别">
              <template slot-scope="scope">
                <el-select v-model="selectMultipleData[scope.$index].category" placeholder="请选择" style="width: 80%" required>
                  <el-option
                      v-for="item in factorClass"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <span slot="footer" class="dialog-footer">
          <el-button @click="deletes">取 消</el-button>
          <el-button type="primary" :plain="true" @click="submitInsert()">确 定</el-button>
          </span>
        </el-dialog>

      </el-card>
    </div>
    <div class="buttonGroup">
      <el-button type="primary" @click="backStep()" round>上一步</el-button>
      <el-button type="primary" @click="next" round>保存任务</el-button>
    </div>
  </div>
</template>

<script>
// import FileSaver from "file-saver";
// import XLSX from "xlsx";
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import vuex_mixin from "@/components/mixins/vuex_mixin";
import GraphVue from "./Graph.vue";
import { postRequest } from "@/api/user";
import { mapMutations } from "vuex";
// import { time } from "echarts";
import { getRequest } from "@/api/user.js";
export default {
  name: "Result",
  mixins: [vuex_mixin],
  components: {
    GraphVue,
    // Tree,
  },
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  computed: {
    ratio() {
      let num = (this.m_result.ratio * 100).toFixed(2);
      return num + "%";
    },
  },

  data() {
    return {
      sendBody:[],
      dialogVisible:false,
      diseaseSelect:'心脑血管疾病',
      tableData: [],
      initFlag: false,
      graphTitile: "",
      node: [],
      links: [],
      data: {},
      type: "",
      distribution: [],
      haveResult: true,
      multipleSelection: [],
      selectMultipleData: [],
      factorClass:[{
        value: 'head',
        label: '头颈',
      },{
        value: 'thoracodorsal',
        label: '胸背',
      },{
        value: 'belly',
        label: '腹',
      },{
        value: 'limb',
        label: '四肢',
      },{
        value: 'others',
        label: '四肢',
      }
      ],
      diseaseClass:[{
        value: 'cardiovascular_cerebrovascular',
        label: '心脑血管疾病'
      }, {
        value: 'metabolic_system',
        label: '代谢系统疾病'
      }, {
        value: 'cancer',
        label: '恶性肿瘤'
      }, {
        value: 'mental_disorder',
        label: '精神疾病'
      }, {
        value: 'respiratory_system',
        label: '呼吸系统疾病'
      }, {
        value: 'others',
        label: '其他'
      }],
    };
  },

  created() {
    let tempNode = {
      name: this.m_caculate_target_feature[0],
      x: 300,
      y: 300,
      color: "#7B68EE",
      symbolSize: 65,
    };
    let tempLink = {
      source: "",
      target: "",
      value: "",
      label: {
        show: true,
      },
      lineStyle: {
        width: 5,
        curveness: 0.2,
      },
    };
    let top_y = 200;
    let bottom_y = 300;
    switch (this.moduleName) {
      case "disFactor": {
        tempNode.name = this.m_caculate_target_feature[0];
        tempNode.x = 500;
        tempNode.y = bottom_y;
        tempNode.color = "#7B68EE";
        if (this.m_result.res.flat(Infinity).length < 1) {
          this.$message("未挖掘出相关关系");
          this.haveResult = false;
          tempNode.x = 500;
          tempNode.y = 500;
          tempNode.color = "#c2b8fae1";
          break;
        }
        this.graphTitile = `${this.m_disease}相关危险因素`;
        this.node.push(JSON.parse(JSON.stringify(tempNode)));
        let ref_x = 1000 / (this.m_result.res[0].length + 1);
        for (let i = 0; i < this.m_result.res[0].length; i++) {
          tempNode.name = this.m_result.res[0][i];
          tempNode.x = ref_x * (i + 1);
          tempNode.y = top_y;
          tempNode.color = "#FFDEAD";
          this.node.push(JSON.parse(JSON.stringify(tempNode)));
          tempLink.source = this.m_caculate_target_feature[0];
          tempLink.target = this.m_result.res[0][i];
          // 权重是随机数
          tempLink.value = Number(Math.random().toFixed(3));
          tempLink.lineStyle.width += tempLink.value * 2;
          this.links.push(JSON.parse(JSON.stringify(tempLink)));
        }

        break;
      }

      case "f_Factor": {
        // 不能有重复的name，用map存储已有name进行去重
        let existedName = new Map();
        let ref_x_t = 1000 / (this.m_caculate_target_feature.length + 1);
        for (let i = 0; i < this.m_caculate_target_feature.length; i++) {
          tempNode.name = this.m_caculate_target_feature[i];
          tempNode.x = ref_x_t * i;
          tempNode.y = bottom_y;
          if (
            this.m_result.res[i].length > 0 &&
            this.m_result.res[i].length <= 2
          ) {
            tempNode.color = "#7B68EE";
          } else if (this.m_result.res[i].length >= 3) {
            tempNode.color = "#000080";
          } else {
            tempNode.color = "#c2b8fae1";
          }
          this.node.push(JSON.parse(JSON.stringify(tempNode)));
          existedName.set(tempNode.name, 1);
        }
        // 检查结果二维数组中是否有值并统计总长度
        let resLength = 0;
        let ref_x_r = [];
        for (const item of this.m_result.res) {
          let tempLen = Number((ref_x_t / (item.length + 1)).toFixed(2));
          ref_x_r.push(tempLen);
          if (item.length > 0) {
            resLength += item.length;
          }
        }
        if (resLength == 0) {
          {
            this.$message("未挖掘出相关关系");
            this.haveResult = false;
            break;
          }
        }

        this.graphTitile = `${this.m_disease}中部分危险因素间关联关系`;
        console.log(this.m_disease, this.graphTitile);

        for (let i = 0; i < this.m_result.res.length; i++) {
          for (let j = 0; j < this.m_result.res[i].length; j++) {
            console.log(this.m_result.res[i][j], ref_x_r[i]);
            if (!existedName.has(this.m_result.res[i][j])) {
              tempNode.name = this.m_result.res[i][j];
              tempNode.x = ref_x_t * i + (ref_x_r[i] + 1) * j;
              tempNode.y = top_y;
              tempNode.color = "#FFDEAD";
              this.node.push(JSON.parse(JSON.stringify(tempNode)));
              existedName.set(tempNode.name, 1);
            }
            tempLink.source = this.m_caculate_target_feature[i];
            tempLink.target = this.m_result.res[i][j];
            // 权重是随机数
            // tempLink.value = Number(Math.random().toFixed(3));
            tempLink.lineStyle.width = 3 + tempLink.value * 8;
            this.links.push(JSON.parse(JSON.stringify(tempLink)));
          }
        }
        break;
      }
      case "factorDis": {
        // 不能有重复的name，用map存储已有name进行去重
        let existedName = new Map();
        let ref_x_t = 1000 / (this.m_caculate_target_feature.length + 1);
        for (let i = 0; i < this.m_caculate_target_feature.length; i++) {
          tempNode.name = this.m_caculate_target_feature[i];
          tempNode.x = ref_x_t * i;
          tempNode.y = bottom_y;
          if (
            this.m_result.res[i].length > 0 &&
            this.m_result.res[i].length <= 2
          ) {
            tempNode.color = "#7B68EE";
          } else if (this.m_result.res[i].length >= 3) {
            tempNode.color = "#000080";
          } else {
            tempNode.color = "#c2b8fae1";
          }
          this.node.push(JSON.parse(JSON.stringify(tempNode)));
          existedName.set(tempNode.name, 1);
        }
        // 检查结果二维数组中是否有值并统计总长度
        let resLength = 0;
        let ref_x_r = [];
        for (const item of this.m_result.res) {
          let tempLen = Number((ref_x_t / (item.length + 1)).toFixed(2));
          ref_x_r.push(tempLen);
          if (item.length > 0) {
            resLength += item.length;
          }
        }
        if (resLength == 0) {
          {
            this.$message("未挖掘出相关关系");
            this.haveResult = false;
            break;
          }
        }

        this.graphTitile = `${this.m_caculate_target_feature[0]}因素相关疾病`;

        for (let i = 0; i < this.m_result.res.length; i++) {
          for (let j = 0; j < this.m_result.res[i].length; j++) {
            console.log(this.m_result.res[i][j], ref_x_r[i]);
            if (!existedName.has(this.m_result.res[i][j])) {
              tempNode.name = this.m_result.res[i][j];
              tempNode.x = ref_x_t * i + (ref_x_r[i] + 1) * j;
              tempNode.y = top_y;
              tempNode.color = "#FFDEAD";
              this.node.push(JSON.parse(JSON.stringify(tempNode)));
              existedName.set(tempNode.name, 1);
            }
            tempLink.source = this.m_caculate_target_feature[i];
            tempLink.target = this.m_result.res[i][j];
            // 权重是随机数
            tempLink.value = Number(Math.random().toFixed(3));
            tempLink.lineStyle.width = 3 + tempLink.value * 8;
            this.links.push(JSON.parse(JSON.stringify(tempLink)));
          }
        }
        break;
      }
      default:
        break;
    }

    getRequest(`scripts/get_stastic?tablename=${this.m_dataset}`, {
      tableName: this.m_dataset,
    }).then((res) => {
      if (res.code == 200) {
        var result_str = res.data[0].replace(/NaN/g, "null");
        this.distribution = JSON.parse(result_str);
      }
    });
    this.initFlag = true;

    let i
    for (i=0;i<this.links.length;i++){
      let node = {data:'',name:''}
      node.name = this.links[i].value
      node.data = this.links[i].target
      this.tableData.push(node)
    }
  },

  methods: {
    ...mapMutations(["SetTaskList"]),
    next() {
      //上传任务
      let payload = {
        taskName: this.m_taskName,
        leader: this.m_principal,
        participant: this.m_participants,
        tips: this.m_tips,
        disease: this.m_disease,
        model: this.m_algorithm,
        feature: this.m_caculate_use_features,
        targetcolumn: this.m_caculate_target_feature,
        time: this.m_result?.time,
        ratio: this.m_result?.ratio?.toFixed(5),
        ci: this.m_result?.ci,
        res: this.m_result?.res,
        dataset: this.m_dataset,
        uid: sessionStorage.getItem("userid") - 0,
        tasktype: this.moduleName,
      };
      let alghName = "m_" + this.m_algorithm;
      let para = [];
      let paraValue = [];
      for (const key in this[alghName]) {
        if (Object.hasOwnProperty.call(this[alghName], key)) {
          console.log(this[alghName]);
          para.push(key);
          console.log(key);
          console.log(this[alghName][key]);
          paraValue.push(this[alghName][key]);
        }
      }
      payload.para = para;
      payload.paraValue = paraValue;
      postRequest("Task/add", payload)
        .then((res) => {
          this.SetTaskList(res.reverse());
          this.$message({
            showClose: true,
            type: "success",
            message: "任务保存成功",
          });
          this.m_changeStep(1);
          let defaultValue = {
            step: 1,
            taskName: "",
            principal: "",
            participants: "",
            disease: "",
            tips: "",
            dataset: "",
            use_features: [],
            known_features: [],
            target_feature: [],
            all_featrues: [],
            caculate_use_features: [],
            caculate_known_features: [],
            caculate_target_feature: [],
            algorithm: "",
            SF_DRMB: {
              K_OR: 0.15,
              K_and_PC: 0.3,
              K_and_SP: 0.75,
            },
            result: [],
            is_common: false,
            node_data: "",
          };
          // TODO:这个改不了深层参数，需要写一个深拷贝通用方法
          this.m_changeTaskInfo(defaultValue);
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: "新建任务失败",
          });
          console.log(err);
          this.m_changeStep(this.m_step - 1);
          return false;
        });
    },
    deletes(){
      this.$refs.multipleTable.clearSelection()
      this.selectMultipleData = []
      this.dialogVisible = false
    },
    submitInsert(){
      this.sendBody = []
      let i, flag=true
      for (i=0;i<this.selectMultipleData.length;i++){
        const body = {
          diseaseName:'',
          diseaseCategory:'',
          factorName:'',
          factorCategory:'',
          weight:0.0,
          status:'',
          uid:'',
          username:'',
        }
        body.uid = sessionStorage.getItem("userid")
        body.username = sessionStorage.getItem("username")
        body.diseaseName = this.m_disease
        body.diseaseCategory = this.diseaseSelect
        body.factorName = this.selectMultipleData[i].name
        body.factorCategory = this.selectMultipleData[i].category
        body.weight = this.selectMultipleData[i].data
        body.status = '0'
        this.sendBody.push(body)
      }
      console.log(this.sendBody)
      for(i=0;i<this.selectMultipleData.length;i++){
        if(this.selectMultipleData[i].category===''){
          flag = false
        }
      }
      if(flag){
        postRequest('/knowledgeBase/insert',this.sendBody).then((res)=>{
          console.log(res)
          if(res.code===200){
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            });
            this.dialogVisible = false;
            this.selectMultipleData = []
          }
          else if(res.code===400){
            this.$message({
              showClose:true,
              message:res.data,
              type:'error'
            })
          }
        })
      }
      else{
        this.$message.error("请选择危险因素的类别！")
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection)
      let i
      for (i=0;i<this.multipleSelection.length;i++){
        let node = {data: '', name: '', category: ''}
        node.data = this.multipleSelection[i].name
        node.name = this.multipleSelection[i].data
        this.selectMultipleData.push(node)
      }
    },
    toggleSelection(rows) {
      this.dialogVisible = true
      console.log(this.multipleSelection)
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    backStep() {
      this.m_changeStep(this.m_step - 1);
    },
    exportToCSV() {
      // 将表格数据转化为CSV格式
      const csvContent = this.convertArrayOfObjectsToCSV(this.distribution);
      console.log(csvContent);
      // 创建 Blob 对象
      const blob = new Blob([csvContent], { type: "text/csv" });

      // 创建 URL
      const url = window.URL.createObjectURL(blob);

      // 创建 a 标签
      const link = document.createElement("a");

      // 设置下载属性
      link.href = url;
      link.download = this.m_dataset + ".csv";

      // 模拟点击下载
      link.click();

      // 释放资源
      window.URL.revokeObjectURL(url);
    },
    handleClose(){
      //关闭弹框
      this.dialogVisible = false;
    },
    convertArrayOfObjectsToCSV(data) {
      const csvRows = [];
      const headers = Object.keys(data[0]);

      // 添加表头
      csvRows.push(headers.join(","));

      // 添加表格数据
      data.forEach((row) => {
        const values = headers.map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
      });

      // 将 CSV 行组合成 CSV 文本
      const csvText = csvRows.join("\n");
      return csvText;
    },

    async exportRes() {
      this.exportToCSV();
      // const divsToExport = ['pdf_graph'];
      // const pdf_positions = [
      //   { x: 5, y: 10 }
      // ];
      // const pdf = new jsPDF();

      // const renderPromises = divsToExport.map((divId, index) => {
      //   const div = document.getElementById(divId);
      //   return html2canvas(div).then((canvas) => {
      //     const imgData = canvas.toDataURL('image/png');
      //     const imgProps = pdf.getImageProperties(imgData);
      //     const pdfWidth = pdf.internal.pageSize.getWidth();
      //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      //     const position = pdf_positions[index] || { x: 0, y: 0 };
      //     pdf.addImage(
      //       imgData,
      //       'PNG',
      //       position.x,
      //       position.y,
      //       pdfWidth,
      //       pdfHeight
      //     );
      //   });
      // });

      // await Promise.all(renderPromises);
      // pdf.save(`${this.m_taskName}.pdf`);
    },

    getSatisticTableData() {
      getRequest(`scripts/get_stastic?tablename=${this.m_dataset}`).then(
        (res) => {
          if (res.code == 200) {
            console.log(res.data[0]);
            console.log(typeof (res.data));
          }
          else {
            this.$message.error("获取数据失败");
          }
        }
      );
    }
  },
};
</script>

<style scoped>
.taskBox1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.taskInfoBox {
  margin-bottom: 20px;
}

.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 100;
  font-size: 25px;
}

.featureTitle {
  font-size: 18px;
  margin-bottom: 20px;
  line-height: 30px;
  vertical-align: top;
}

.taskInfo_box_card_item span {
  line-height: 30px;
  vertical-align: top;
}

h3 {
  display: inline;
  margin-right: 15%;
}

.graphBox {
  width: 100%;
  height: 40vh;
  margin-top: 20px;
}

.treeBox {
  width: 100%;
  height: 50vh;

  margin-top: 20px;
}

.buttonGroup {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

span {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.taskInfo_box_card {
  margin: 1%;
}

.taskInfo_box_card h2 {
  font-size: 20px;
}

.taskInfo_box_card_group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.graphPlaceHolder {
  width: 100%;
  height: 380px;
  text-align: center;
  line-height: 350px;
  /* background-color: rgba(179, 178, 178, 0.144); */
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select: none;
}
</style>
