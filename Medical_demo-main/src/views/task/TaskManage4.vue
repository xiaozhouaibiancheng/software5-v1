<template>
  <div class="main">
    <div class="left_tree">
      <div class="tipInfo">
        <h3>任务所用数据集</h3>
        <span class="statistic"> 一级病种: {{ diseaseNum }} 个  ▍ </span>
        <span class="statistic"> 数据表: {{ datasetNum }} 个 </span>
        <!-- <div class="statistic">
          一级病种: {{ diseaseNum }} 个
        </div>
        <div class="statistic">
          数据表: {{ datasetNum }} 个
        </div> -->
      </div>
      <hr class="hr-dashed" />
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree ref="tree" :data="treeData" :show-checkbox="false" node-key="id" default-expand-all
               :expand-on-click-node="false" :check-on-click-node="true" :highlight-current="true" @node-click="changeData"
               :filter-node-method="filterNode">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.catLevel == 1" style="font-weight: bold; font-size: 15px; color: #252525">{{ node.label
            }}</span>
          <span v-else>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="right" >
      <!--==========================     头部按钮     ==============================================================-->
      <div id="top_buttons">
        <span>提示：可以根据数据集、任务负责人、任务名称一起查找！</span>
        <br>
        <div class="filter" style="margin-top: 10px">
          <!-- <span>任务负责人：</span> -->
          <el-select v-model="leader" placeholder="请选择任务负责人" @change="pagehelper()">
            <el-option v-for="item in taskLeaderList1" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </div>
<!--        <div class="filter">-->
<!--          &lt;!&ndash; <span>任务类型：</span> &ndash;&gt;-->
<!--          <el-select v-model="tasktype" placeholder="请选择任务类型" @change="pagehelper()">-->
<!--            <el-option v-for="item in taskTypeOptions" :key="item.value" :label="item.label" :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
        <div class="filter">
          <!-- <span>任务名称：</span> -->
          <el-input label="" placeholder="请输入任务名称" v-model="searchTask" style="display: inline" @change="pagehelper()">
          </el-input>
        </div>
        <el-button @click="clearFilter()">清除</el-button>
        <el-button type="success" @click="submitForm1">新建任务</el-button>
      </div>

      <!--===============================    卡片组     ==============================================================-->
      <div class="cardGroup">
        <el-card class="taskCard" v-for="item in currentTaskList" :key="item.id" shadow="always" v-show="!(disease || leader) ||
          (disease == item.disease && !leader) ||
          (leader == item.leader && !disease) ||
          (disease == item.disease && leader == item.leader)
          ">
          <div class="cardInfo">
            <div><span class="ttl">任务名称：</span>{{ item.taskname }}</div>
            <div><span class="ttl">负责人：</span>{{ item.leader }}</div>
            <div><span class="ttl">所属疾病：</span>{{ item.disease }}</div>
            <div><span class="ttl">使用模型：</span>{{ item.model }}</div>
            <div><span class="ttl">数据表：</span>{{ item.dataset }}</div>
            <div><span class="ttl">创建时间：</span>{{ item.createtime }}</div>
          </div>
          <div class="editButton">
            <el-tooltip class="item" effect="light" content="已挖掘的结果可以查看" placement="left">
              <el-button size="mini" type="primary" @click="handleCheck(item)" style="margin-right: 20px">查看</el-button>
            </el-tooltip>
            <el-popconfirm title="删除后无法恢复" icon="el-icon-warning" icon-color="red" @confirm="handleDelete(item)">
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </div>
        </el-card>
      </div>
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" id="center"
                     :current-page="this.params.page" :page-sizes="[6, 9, 12, 15, 24]" :page-size="this.params.size"
                     layout="total, sizes, prev, pager, next, jumper" :total="this.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getRequest, postRequest} from "@/utils/api";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { getCategory } from "@/api/category";

export default {
  computed: {
    ...mapState(["taskList"]),
    ...mapGetters(["taskDiseaseList"]),
    loginUserID() {
      return sessionStorage.getItem("userid");
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getCatgory();
    this.getTaskList();
    this.pagehelper();
    this.getUsers();
  },
  data() {
    return {
      taskLeaderList1 : [],
      searchTask: "",
      datasetNum: 0,
      diseaseNum: 0,
      disease: "",
      dataset: "",
      leader: "",
      result: {},
      total: 0,
      buttonText: "新建任务",
      params: {
        page: 1,
        size: 9,
      },
      // dialogDiseaseVisible:false,
      // diseaseName:'',
      currentTaskList: [],
      treeData: [],
      tasktype: "",
      taskTypeOptions: [
        {
          label: "疾病危险因素挖掘",
          value: "disFactor",
        },
        {
          label: "危险因素相关因素挖掘",
          value: "f_Factor",
        },
        {
          label: "危险因素相关疾病挖掘",
          value: "factorDis",
        },
      ],
      filterText: ''
    };
  },

  methods: {
    ...mapActions(["getTaskList", "getTreeData"]),
    ...mapMutations(["SetTaskList"]),
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCommand(command) {
      this.$router.push(command);
    },
    handleCheck(row) {
      getRequest(`Task/result/${row.id}`).then((res) => {
        console.log(res)
        if (res.code === 200) {
          console.log("-------------"+res.code)
          this.result = res.data;
          // if(this.result.parameters != null){
          //   this.result.parameters = this.result.parameters.split(",");

          // }
          sessionStorage.setItem("result", JSON.stringify(this.result));
          this.$router.push("/TaskResult");
        } else {
          this.$message.error("查看任务失败");
        }
      });
    },
    submitForm1(){
      this.$router.push('/sideBar/DisFactor');
    },
    handleDelete(row) {
      getRequest(`Task/delete/${row.id}`).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除任务成功");
          this.pagehelper();
        } else {
          this.$message.error("删除任务失败");
        }
      });
    },
    getUsers(){
      postRequest('/user/getAll', {}).then(response=>{
        this.taskLeaderList1 = []
        for(var i=0;i<response.length;i++){
          this.taskLeaderList1.push(response[i].username)
        }
        console.log('=================用户')
        console.log(this.taskLeaderList1)
      })
    },
    clearFilter() {
      this.disease = "";
      this.leader = "";
      this.tasktype = "";
      this.dataset = "";
      (this.searchTask = ""), this.pagehelper();
    },
    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },

    changeData(data) {
      if (data.isLeafs == 0) {
        this.dataset = "";
        this.disease = data.label;
      }
      if (data.isLeafs == 1) {
        this.dataset = data.label;
        this.disease = "";
      }
      this.pagehelper();
    },
    handleSizeChange(val) {
      this.params.size = val;
      this.pagehelper();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.pagehelper();
    },
    pagehelper() {
      getRequest(
          `Task/selectByPage?pageNum=${this.params.page}&pageSize=${this.params.size}&leader=${this.leader}&disease=${this.disease}&dataset=${this.dataset}&tasktype=${this.tasktype}&searchTask=${this.searchTask}`
      ).then((res) => {
        if (res) {
          this.total = res.data.total;
          this.currentTaskList = res.data.list;
        }
      });
    },
    getCatgory() {
      getCategory("/api/Taskcategory").then((response) => {
        this.treeData = response.data;
        // 获取病种和数据集总数
        this.diseaseNum =
            response.data[0].children.length;
        getRequest("/tableDescribe/getTableNumber").then((res) => {
          if (res.code == 200) this.datasetNum = res.data;
        });
      });
    },
  },
};
</script>

<style scoped>
.main {
  display: grid;
  grid-template-columns: 18% 82%;
  height: 820px;
}

.left_tree {
  display: inline-block;
  height: 99%;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  overflow: auto;
  /* width: 250px; */
}

.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 50px;
  text-align: center;
}

.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
}

.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}

h3 {
  color: #3d3d3d;
  text-align: center;
}

.right {
  display: inline-block;
  height: 99%;
}

.pagination {
  margin-top: 2%;
  margin-left: 3%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

#top_buttons {
  margin-left: 3%;
  margin-bottom: 20px;
}

#top_buttons>* {
  display: inline-block;
}

#task_disease {
  margin-right: 40px;
}

.filter {
  margin-right: 10px;
}

#table {
  margin-top: 10px;
}

.lineStyle {
  color: rgb(100, 172, 231);
}

.featureTitle {
  font-weight: 800;
}

.cardGroup {
  /* width: 90%; */
  margin-left: 3%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-row-gap: 40px;
  grid-column-gap: 60px;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto;
  /* 定义四行，高度根据内容自适应 */
  gap: 10px;
  /* 定义网格行和列之间的间隙 */
}

.cardInfo>div:nth-child(5),
  /* 第五个子元素（数据表） */
.cardInfo>div:nth-child(6)

  /* 第六个子元素（创建时间） */
{
  grid-column: 1 / span 2;
  /* 这两个元素跨越两列 */
}

.ttl {
  font-weight: 600;
  color: #071135;
}

.editButton {
  margin-left: 30%;
  margin-top: 5%;
}

.icon {
  justify-self: end;
}

.taskCard {
  width: 110%;
}

.addTask[disabled]:hover::after {
  position: absolute;
  right: 28vw;
  top: 12vh;
  padding: 5px;
  background-color: #444444;
  border-radius: 5px;
  color: #fff;
  z-index: 2;
  width: 120px;
  content: "请先选择任务类型";
}

.el-dropdown {
  vertical-align: top;
}

.el-dropdown+.el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
