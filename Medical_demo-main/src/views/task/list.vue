<template>
<!--  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">-->
<!--    <el-tab-pane label="多病种关联挖掘任务管理" name="first">-->
  <div class="main">
    <div class="left_tree">
      <div class="tipInfo">
        <div style="margin-bottom: 10px">
          <h3>任务所用的数据集</h3>
          <span class="statistic">多病种知识库: {{ number1 }} 个 ▍ </span>
          <!--        <br>-->
          <span class="statistic">私有数据集: {{ number2 }} 个</span>
        </div>
        <hr class="hr-dashed" />
        <el-tree :data="data2" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="true">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
              </span>
            </span>
        </el-tree>
      </div>
    </div>
      <div class="right">
        <!--==========================     头部按钮     ==============================================================-->
        <div id="top_buttons">
          <span>提示：可以根据数据集、任务负责人、任务名称一起查找！</span>
          <br>
          <div id="task_leader" style="margin-top: 10px">
<!--            <span>任务负责人：</span>-->
            <el-select v-model="leader" placeholder="请选择任务负责人" @change="pagehelper()" clearable>
              <el-option
                  v-for="item in taskLeaderList"
                  :key="item"
                  :label="item"
                  :value="item"
              >
              </el-option>
            </el-select>
<!--            <span style="margin-left: 10px">任务类型：</span>-->
            <el-select v-model="queryParam.type" placeholder="请选择任务类型" @change="pagehelper()" filterable style="margin-left: 10px" clearable>
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
<!--            <span style="margin-left: 10px">任务名称：</span>-->
<!--            <el-input v-model="taskName" placeholder="请输入要查询的任务名称" clearable style="width: 220px"></el-input>-->
            <el-select v-model="taskName" placeholder="请选择任务名称" @change="pagehelper()" style="margin-left: 10px" clearable>
              <el-option
                  v-for="item in taskList"
                  :key="item"
                  :label="item"
                  :value="item"
              >
              </el-option>

            </el-select>
          </div>
          <el-button @click="clearFilter">清除</el-button>
          <el-button type="success" @click="submitForm1">新建任务</el-button>
<!--          <el-dropdown style="margin-left: 5px" @command="handleCommand">-->
<!--            <el-button type="success">-->
<!--              新建任务<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--            </el-button>-->
<!--            <el-dropdown-menu slot="dropdown">-->
<!--              <el-dropdown-item command="/sideBar/DisFactor">疾病危险因素挖掘</el-dropdown-item>-->
<!--              <el-dropdown-item command="/sideBar/mining">多病种关联关系挖掘</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--          </el-dropdown>-->
        </div>

        <!--===============================    卡片组     ==============================================================-->
        <div class="cardGroup">
          <el-card
              class="taskCard"
              v-for="item in tableData_now"
              :key="item.id"
              shadow="always"
          >
            <div class="cardInfo">
              <div><span class="ttl">任务名称：</span>{{ item.name }}</div>
              <div><span class="ttl">负责人：</span>{{ item.creator }}</div>
              <div><span class="ttl">使用模型：</span>{{ item.algorithmName }}</div>
              <div><span class="ttl">数据表：</span>{{ item.tableName }}</div>
              <div><span class="ttl">任务类型：</span>{{ item.type }}</div>
              <div><span class="ttl">创建时间：</span>{{ item.time }}</div>
            </div>
            <div class="editButton">
<!--              <el-button-->
<!--                  size="mini"-->
<!--                  type="primary"-->
<!--                  @click="handleCheck(item)"-->
<!--                  style="margin-right: 20px"-->
<!--              >查看</el-button-->
<!--              >-->
              <el-tooltip class="item" effect="light" content="参数已保存，可以直接运行" placement="left">
                <el-button size="mini" type="primary" @click="run(item)" style="margin-right: 20px">运行</el-button>
              </el-tooltip>
              <el-popconfirm
                  title="删除后无法恢复"
                  icon="el-icon-warning"
                  icon-color="red"
                  @confirm="deleteTable(item)"
              >
                <el-button
                    slot="reference" size="mini" type="danger"
                >删除</el-button
                >
              </el-popconfirm>
            </div>
          </el-card>
        </div>
        <div style="margin-top: 20px" id="center">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page=this.params.page :page-sizes="[6, 9, 12, 15, 24]" :page-size=this.params.size
                         layout="total, sizes, prev, pager, next, jumper" :total=this.total
                         style="bottom: 0">
          </el-pagination>
        </div>
      </div>
    </div>
<!--    </el-tab-pane>-->
<!--    <el-tab-pane label="疾病危险因素挖掘任务管理" name="second">-->
<!--      配置管理-->
<!--    </el-tab-pane>-->

<!--  </el-tabs>-->
</template>

  <script>
import { getRequest, postRequest } from "@/utils/api";
import {getTableData} from "@/api/tableDescribe";
export default {
  computed: {
  },
  data() {
    return {
      number1:1,
      number2:0,
      params: {
        page: 1,
        size: 9,
      },
      dataset : "",
      activeName: 'first',
      disease:'',
      leader:'',
      taskName:'',
      taskList : [],
      state: '',
      timeout:  null,
      taskLeaderList:[],
      data2: [{
        label: '多病种知识库',
        value:'knowledgebase',
        isLeafs: true,
      }, {
        label: '私有数据集',
        isLeafs: false,
        children: []
      }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData1:[],
      treeData:[
        {
          id: '1',
          label: 'disease_mining',
        },
        {
          id: '2',
          label: 'factor_mining',
        },
        {
          id: '3',
          label: 'disease_factor_mining',
        }
      ],
      queryParam: {
        id: null,
        name: "",
        type: "",
        //   pageIndex: 1,
        //   pageSize: 10
      },
      subjectFilter: null,
      listLoading: true,
      tableData: [
        {
          id: 1,
          name: 'sdf',
          type: 'disease_mining',
          description: 'sfa',
          disease: 'asdf',
          factor: 'sd',
          tableName: 'sdfa',
          algorithmName: 'ag',
          time: null
        }
      ],
      tableData_now:[],
      tableData_now_1 :[],
      total: 0,
      options: [{
        value: 'disease_mining',
        label: '疾病关联挖掘'
      }, {
        value: 'factor_mining',
        label: '危险因素关联挖掘'
      }, {
        value: 'disease_factor_mining',
        label: '疾病-危险因素关联挖掘'
      }],
    }
  },
  created() {
    this.getTreeData1()
    this.getUsers()
    this.pagehelper()
  },
  methods: {
    unique(arr) {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    getTaskList() {
      let taskList1 = []
      postRequest('mining/getAll', {}).then(response=>{
        for(let i=0;i<response.length;i++){
          taskList1.push(response[i].name)
        }
        console.log("名字")
        console.log(taskList1)
        this.taskList = this.unique(taskList1)
        console.log("没有重复的名字")
        console.log(this.taskList)
      })
    },
  getUsers(){
      postRequest('/user/getAll', {}).then(response=>{
        this.taskLeaderList = []
        for(var i=0;i<response.length;i++){
          this.taskLeaderList.push(response[i].username)
        }
        console.log('=================用户')
        console.log(this.taskLeaderList)
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    pagehelper() {
      console.log("======1233", this.queryParam.type)
      getRequest(
          `mining/selectByPage?pageNum=${this.params.page}&pageSize=${this.params.size}&leader=${this.leader}&dataset=${this.dataset}&tasktype=${this.queryParam.type}&searchTask=${this.taskName}`
      ).then((res) => {
        if (res) {
          this.total = res.data.total;
          this.tableData_now = res.data.list;
        }
      });
    },
    findByLeader(){
      getRequest(
          `Task/selectByPage?pageNum=${this.params.page}&pageSize=${this.params.size}&leader=${this.leader}&dataset=${this.dataset}&tasktype=${this.tasktype}&searchTask=${this.searchTask}`
      ).then((res) => {
        if (res) {
          this.total = res.data.total;
          this.currentTaskList = res.data.list;
        }
      });
    //   this.disease = "";
    //   this.queryParam.type =  '';
    //   this.taskName = "";
    //   // console.log(this.tableData)
    //   // let i
    //   // let tableInfo = []
    //   // for (i=0;i<this.tableData.length;i++){
    //   //   if(this.tableData[i].creator === this.leader){
    //   //     tableInfo.push(this.tableData[i])
    //   //   }
    //   // }
    //   // this.tableData_now = tableInfo
    //   this.listLoading = true
    // getRequest('/mining/getByCreator/' + this.leader).then(
    //       (response) => {
    //         console.log(response)
    //         this.tableData_now_1 = response
    //         this.tableData_now = this.tableData_now_1.slice(
    //             (this.page - 1) * this.size,
    //             this.page * this.size
    //         );
    //         this.total = this.tableData_now_1.length
    //         console.log("Total：", this.total)
    //         this.listLoading = false
    //       }
    //   )
    },
    findByTask(){
      this.disease = "";
      this.leader = "";
      this.queryParam.type =  '';
      this.listLoading = true
      getRequest('/mining/getByName/' + this.taskName).then(
          (response) => {
            console.log(response)
            this.tableData_now_1 = []
            this.tableData_now_1 = response
            this.tableData_now = this.tableData_now_1.slice(
                (this.page - 1) * this.size,
                this.page * this.size
            );
            this.total = this.tableData_now_1.length
            console.log("Total：", this.total)
            this.listLoading = false
          }
      )
    },
    clearFilter() {
      this.dataset = "";
      this.leader = "";
      this.queryParam.type =  '';
      this.taskName = "";
      this.pagehelper()
    },
    // changeData(data) {
    //   let i
    //   let tableInfo = []
    //   for (i=0;i<this.tableData.length;i++){
    //     if(this.tableData[i].type === data.label){
    //       tableInfo.push(this.tableData[i])
    //     }
    //   }
    //   this.tableData_now = tableInfo
    // },
    getTreeData1(){
      postRequest('/tables/getAll', {}).then(response=>{
        console.log("表信息")
        console.log(response)
        this.treeData1 = response;
        let i;
        for(i=0;i<response.length;i++){
          if(response[i].type === 1){
            this.number2 = this.number2 + 1
            let node2 = {label: '', value: '', isLeafs: true,}
            node2.label = response[i].valueName;
            node2.value = response[i].name;
            this.data2[1].children.push(node2)
          }
        }
      })
    },
    searchAll() {
      this.listLoading = true
      postRequest('mining/getAll', {}).then(
        (response) => {
          console.log("数据")
          console.log(response)
          console.log("长度")
          console.log(response.length)
          console.log("============================")
          console.log(this.disease, this.leader, this.queryParam.type, this.taskName)
          this.tableData_now_1 = response
          // let i
          // let tableInfo = []
          // for (i=0;i<this.tableData.length;i++){
          //   if(this.tableData[i].type === 'disease_mining'){
          //     tableInfo.push(this.tableData[i])
          //   }
          // }
          // this.tableData_now = tableInfo
          this.tableData_now = this.tableData_now_1.slice(
              (this.page - 1) * this.size,
              this.page * this.size
          );
          this.total = this.tableData_now_1.length
          console.log("Total：", this.total)
          this.listLoading = false
        }
      );
    },
    //page改变时的回调参数，参数为当前页码
    handleCurrentChange(val){
      this.params.page = val;
      this.pagehelper();
      // console.log("翻页，当前为第几页", val);
      // this.page = val;
      // if(this.disease !== '' && this.leader==='' && this.queryParam.type==='' && this.taskName==='')
      // {
      //  this.handleNodeClick()
      // }
      // else if(this.disease === '' && this.leader !=='' && this.queryParam.type==='' && this.taskName==='')
      // {
      //   this.findByLeader()
      // }
      // else if(this.disease === '' && this.leader ==='' && this.queryParam.type !=='' && this.taskName==='')
      // {
      //   this.submitForm(this.queryParam.type)
      // }
      // else if(this.disease === '' && this.leader ==='' && this.queryParam.type==='' && this.taskName!=='')
      // {
      //   this.findByTask()
      // }
      // else if(this.disease === '' && this.leader === '' && this.queryParam.type==='' && this.taskName ==='')
      // {
      //   this.searchAll();
      // }
    },
    handleSizeChange(val){
      this.params.size = val;
      this.pagehelper();
      // console.log("改变每页多少条，当前一页多少条数据", val);
      // this.size = val;
      // this.page = 1;
      // if(this.disease !== '' && this.leader==='' && this.queryParam.type==='' && this.taskName==='')
      // {
      //   this.handleNodeClick()
      // }
      // else if(this.disease === '' && this.leader !=='' && this.queryParam.type==='' && this.taskName==='')
      // {
      //   this.findByLeader()
      // }
      // else if(this.disease === '' && this.leader ==='' && this.queryParam.type !=='' && this.taskName==='')
      // {
      //   this.submitForm(this.queryParam.type)
      // }
      // else if(this.disease === '' && this.leader ==='' && this.queryParam.type==='' && this.taskName!=='')
      // {
      //   this.findByTask()
      // }
      // else {
      //   this.searchAll();
      // }
    },
    handleNodeClick(data) {
      this.dataset = data.value
      this.pagehelper();
      // this.leader = "";
      // this.queryParam.type =  '';
      // this.taskName = "";
      // this.listLoading = true
      // let tableName = data.value
      // console.log("lskdjfalkjdfasdjfl")
      // console.log(data)
      // let tableId = '100'
      // this.nowTableName = data.label
      // console.log(data)
      // getRequest('/mining/getByTableName/' + tableName).then(
      //     (response) => {
      //       console.log(response)
      //       this.tableData_now = []
      //       this.tableData_now = response
      //       this.listLoading = false
      //     }
      // )
    },
    // submitForm() {
    //   this.disease = "";
    //   this.leader = "";
    //   this.taskName = "";
    //   this.listLoading = true
    //   getRequest('/mining/getByType/' + this.queryParam.type).then(
    //       (response) => {
    //         console.log(response)
    //         this.tableData_now_1 = []
    //         this.tableData_now_1 = response
    //         this.tableData_now = this.tableData_now_1.slice(
    //             (this.page - 1) * this.size,
    //             this.page * this.size
    //         );
    //         this.total = this.tableData_now_1.length
    //         console.log("Total：", this.total)
    //         this.listLoading = false
    //       }
    //   )
    // },
    handleCommand(command){
      this.$router.push(command);
    },
    submitForm1(){
      this.$router.push('/sideBar/mining');
    },
    submitForm2(){
      this.$router.push('/sideBar/DisFactor');
    },
    // search() {
    //   this.listLoading = true
    //   console.log(this.queryParam)
    //   if (this.queryParam.id) {
    //     getRequest('mining/getById/' + this.queryParam.id).then(
    //       (response) => {
    //         console.log(response)
    //         this.tableData = []
    //         this.tableData[0] = response
    //         this.listLoading = false
    //         console.log(this.tableData)
    //       }
    //     )
    //   }
    //   else if (this.queryParam.name) {
    //     getRequest('mining/getByName/' + this.queryParam.name).then(
    //       (response) => {
    //         console.log(response)
    //         this.tableData = []
    //         this.tableData = response
    //         this.listLoading = false
    //         console.log(this.tableData)
    //       }
    //     )
    //   }
    //   else if (this.queryParam.type) {
    //     getRequest('/mining/getByType/' + this.queryParam.type).then(
    //       (response) => {
    //         console.log(response)
    //         this.tableData = []
    //         this.tableData = response
    //         this.listLoading = false
    //       }
    //     )
    //   }
    // },
    deleteTable(row) {
      let _this = this
      getRequest('mining/delete/' + row.id).then(
        (response) => {
          console.log(response)
          if (response === true) {
            _this.pagehelper()
            _this.$message.success("删除成功")
          } else {
            _this.$message.error("删除失败")
          }
        }
      )
    },
    run(row) {
      let _this = this
      console.log(row)
      if (row.type === "disease_mining") {
        _this.$router.push({ path: '/sideBar/disease/result', query: { form: row,flag:1 } })
      }
      else if (row.type === "factor_mining") {
        _this.$router.push({ path: '/sideBar/factor/result', query: { form: row, flag:1 } })
      }
      else if (row.type === "disease_factor_mining") {
        _this.$router.push({ path: '/sideBar/diseaseFactor/result', query: { form: row, flag:1 } })
      }

    }
  },
  mounted() {
    this.getTaskList();
  }
}
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
}

.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 100px;
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
.tablePlaceholder {
  height: 100%;
  text-align: center;
  line-height: 600px;
  background-color: rgba(179, 178, 178, 0.144);
  font-weight: bold;
  color: rgba(58, 57, 57, 0.651);
  user-select: none;
}

#top_buttons > * {
  display: inline-block;
}
#task_leader {
  margin-right: 20px;
}
.cardGroup {
  //width: 100%;
  margin-left: 3%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-row-gap: 40px;
  grid-column-gap: 60px;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto; /* 定义四行，高度根据内容自适应 */
  gap: 10px; /* 定义网格行和列之间的间隙 */
}

.cardInfo > div:nth-child(5), /* 第五个子元素（数据表） */
.cardInfo > div:nth-child(6) /* 第六个子元素（创建时间） */ {
  grid-column: 1 / span 2; /* 这两个元素跨越两列 */
}

.ttl{
  font-weight: 600;
  color: #071135;
}

.editButton {
  margin-left: 30%;
  margin-top: 5%;
}

.taskCard{
  width: 110%;
}
</style>