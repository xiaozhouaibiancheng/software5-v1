<template>
  <div>
    <div class="searchByCondition">
      <span>疾病：</span>
      <el-input
          placeholder="请输入疾病名称"
          v-model="disease"
          class="user_input"
          clearable
          @clear="pagehelper()"
          @change="pagehelper()"
          style="width: 300px"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <span style="margin-left: 5px">危险因素：</span>
      <el-input
          placeholder="请输入危险因素名称"
          v-model="factor"
          class="user_input"
          clearable
          @clear="pagehelper()"
          @change="pagehelper()"
          style="width: 300px"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <span style="margin-left: 5px">用户：</span>
      <el-select v-model="user" placeholder="请选择用户" @change="pagehelper()">
        <el-option v-for="item in createUserList" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button type="danger" @click="clearFilter()" style="margin-left: 10px">清除条件</el-button>
    </div>
    <el-divider></el-divider>
    <el-card class="user_list_card">
      <div slot="header" class="clearfix">
        <span>疾病-危险因素关联表</span>
        <el-button
            type="success"
            round
            style="margin-left: 70%"
            @click="addInformDialogVisible = true"
        >添加</el-button
        >
        <el-badge :value="approveNum" class="item">
        <el-button
            type="primary"
            plain
            round
            @click="getApprove()"
            style="margin-left: 10px"
        >审核</el-button
        >
        </el-badge>
      </div>

      <el-table :data="disease_factor_data" stripe style="width: 100%"  :header-cell-style="{ backgroundColor: '#e8e5e5', color: 'black', fontWeight: 'bold'}">
        <el-table-column
            prop="id"
            label="Id"
            width="110px"
            align="center"
        >
        </el-table-column>
        <el-table-column
            label="疾病id"
            prop="source"
            width="110px"
            align="center"
        >
        </el-table-column>
        <el-table-column label="疾病名称" width="220px" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-input v-model="scope.row.diseaseName" size="small"></el-input>
            </div>
            <div v-show="!scope.row.editing">
              {{ scope.row.diseaseName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="危险因素id"
            prop="target"
            width="110px"
            align="center"
        >
        </el-table-column>
        <el-table-column label="危险因素名称" width="220px" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-input v-model="scope.row.factorName" size="small"></el-input>
            </div>
            <div v-show="!scope.row.editing">
              {{ scope.row.factorName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="权重" width="110px" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.editing">
              <el-input v-model="scope.row.weight" size="small"></el-input>
            </div>
            <div v-show="!scope.row.editing">
              {{ scope.row.weight }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
            label="用户id"
            prop="uid"
            width="110px"
            align="center"
        >
        </el-table-column>
        <el-table-column
            prop="createUser"
            label="创建人"
            width="220px"
            align="center"
        >
        </el-table-column>

        <el-table-column label="操作" width="400px" align="center">
          <template slot-scope="scope">
            <el-button
                type="primary"
                icon="el-icon-edit"
                @click="toggleEditing(scope.row)"
            >
              {{ scope.row.editing ? "保存" : "编辑" }}</el-button
            >

            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除该记录吗？"
                @confirm="deleteInform(scope.row)"
            >
              <el-button
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                  style="margin-left: 10px"
              >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" id="center"
                       :current-page="this.params.page" :page-sizes="[6, 9, 12, 15, 24]" :page-size="this.params.size"
                       layout="total, sizes, prev, pager, next, jumper" :total="this.total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="新增关联信息" :visible.sync="addInformDialogVisible">
      <div class="addInformcontent">
        <el-form :model="addCorrleation">
          <el-form-item label="疾病名字" label-width="120">
            <el-input
                v-model="addCorrleation.diseaseName"
                autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="疾病类别" label-width="120">
            <el-select v-model="addCorrleation.diseaseCategory" placeholder="请选择" style="width: 100%">
              <el-option
                  v-for="item in diseaseClass"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="危险因素名字" label-width="120">
            <el-input
                v-model="addCorrleation.factorName"
                autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="危险因素类别" label-width="120">
            <el-select v-model="addCorrleation.factorCategory" placeholder="请选择" style="width: 100%">
              <el-option
                  v-for="item in factorClass"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button type="primary" @click="addInform()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="知识库关联审核" :visible.sync="checkVisible" v-loading="checkLoding">
      <el-button type="success" round
                 @click="confirmUsenames(1)">
        <i  class="el-icon-check"></i>一键通过</el-button>
      <el-button type="danger" round
                 @click="confirmUsenames(0)">
        <i  class="el-icon-close"></i>一键拒绝</el-button>
      <el-table
          ref="multipleTable"
          :data="approveData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            type="selection"
            width="55"
            label="全选"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            width="55"
            label="id"
            align="center">
        </el-table-column>
        <el-table-column
            prop="diseaseName"
            label="疾病名称"
            width="120"
            align="center">
        </el-table-column>
        <el-table-column
            prop="factorName"
            label="危险因素名称"
            width="120"
            align="center">
        </el-table-column>
        <el-table-column
            prop="uid"
            label="用户id"
            width="120"
            align="center">
        </el-table-column>
        <el-table-column
            prop="createUser"
            label="用户姓名"
            width="120"
            align="center">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="申请时间"
            width="120"
            align="center">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" round
                       @click="updateCheckApprove(scope.row.id,1)">通过</el-button>

            <el-button type="danger" round
                       @click="updateCheckApprove(scope.row.id,0)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeIt">关 闭</el-button>
      </div>
    </el-dialog>




  </div>

</template>

<script>
import {getRequest, postRequest} from "@/api/user";

export default {
  data(){
    return{
      total: 0,
      currentTotal: 0,
      params: {
        page: 1,
        size: 9,
      },
      disease:'',
      factor:'',
      user:'',
      createUserList:[],
      disease_factor_data:[],
      addInformDialogVisible: false,
      disease_name:"",
      factor_name:"",
      checkVisible: false,
      checkLoding: false,
      approveData: [],
      multipleSelection: [],
      approveNum: 0,
      addCorrleation: {
          diseaseName: "",
          diseaseCategory: "",
          factorName: "",
          factorCategory:"",
        },
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
      }],
    }
  },
  created() {
    this.getUsers()
    // this.searchAll()
    this.pagehelper()
    this.getApproveNum()
  },
  methods:{
    closeIt(){
      this.checkVisible = false;
      window.location.reload()
    },
    getApproveNum(){
      getRequest(
          `knowledgeBase/getApprove`
      ).then((res) => {
        this.approveNum = res.data.length
      });
    },
    searchAll () {
      this.listLoading = true
      getRequest(`knowledgeBase/selectByPage?pageNum=${this.params.page}&pageSize=${this.params.size}&diseaseName=${this.disease}&factorName=${this.factor}&username=${this.user}`).then(
          (response)=>{
            this.disease_factor_data = response
          }
      );
    },
    getUsers(){
      postRequest('/user/getAll', {}).then(response=>{
        this.createUserList = []
        for(var i=0;i<response.length;i++){
          this.createUserList.push(response[i].username)
        }
      })
    },
    pagehelper() {
      getRequest(
          `knowledgeBase/selectByPage?pageNum=${this.params.page}&pageSize=${this.params.size}&diseaseName=${this.disease}&factorName=${this.factor}&username=${this.user}`
      ).then((res) => {
        console.log(res)
        if (res) {
          this.total = res.data.total;
          this.disease_factor_data = res.data.list;
        }
      });
    },
    getApprove(){
      this.checkVisible = true
      getRequest(
          `knowledgeBase/getApprove`
      ).then((res) => {
        this.approveData = res.data
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    confirmUsenames(type){
      if (this.multipleSelection.length < 1){ // 自定义状态码
        this.$message({
          type: "warning",
          message: "请选择至少一条关联进行审批",
        });
        return;
      }
      this.checkLoding=true;
      this.multipleSelection.forEach(
          selection => this.updateCheckApprove(selection.id, type)
      )
      this.checkLoding=false;
    },
    updateCheckApprove(id, type){
      let uid = sessionStorage.getItem("uid")-0
      let username = sessionStorage.getItem("username")
      if(type==1){
        getRequest(`/knowledgeBase/underCheckApprove?knowledgeBaseId=${id}&uid=${uid}&username=${username}`).then(
            (res)=>{
              if(res.code==200){
                this.$message.success("通过审核申请")
                this.getApprove()
              }else{
                this.$message.error("审核失败")
                this.getApprove()
              }
            }
        )
      }else if(type==0){
        getRequest(`/knowledgeBase/denyCheckApprove?knowledgeBaseId=${id}&uid=${uid}&username=${username}`).then(
            (res)=>{
              if(res.code==200){
                this.$message.success("拒绝审核申请")
                this.getApprove()
              }else{
                this.$message.error("拒绝失败")
                this.getApprove()
              }
            }
        )
      }
    },
    deleteInform(row) {
      let uid = sessionStorage.getItem("uid")-0
      let username = sessionStorage.getItem("username")
      getRequest(`knowledgeBase/delete?knowledgeBaseId=${row.id-0}&diseaseName=${row.diseaseName}&factorName=${row.factorName}&uid=${uid}&username=${username}`).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.pagehelper();
        } else {
          this.$message.error("删除失败");
          this.pagehelper();
        }
      });
    },
    handleSizeChange(val) {
      this.params.size = val;
      this.pagehelper();
    },
    handleCurrentChange(val) {
      this.params.page = val;
      this.pagehelper();
    },
    closeDialog() {
      this.addInformDialogVisible = false;
      this.addCorrleation = {
        diseaseName: "",
        diseaseCategory: "",
        factorName: "",
        factorCategory:"",
      }
    },
    toggleEditing(row) {
      if (row.editing) {
        this.saveChanges(row); // 如果当前是保存状态，保存数据
      }
      // row.editing = !row.editing; // 切换编辑状态
      this.$set(row,"editing",!row.editing)
    },
    saveChanges(row) {
      console.log(row)
      postRequest("knowledgeBase/update", row).then((res) => {
        if (res.code === 200) {
          this.$message.success("修改成功");
          this.pagehelper()
        } else {
          this.$message.warning("修改失败！");
        }
      });
    },
    clearFilter() {
      this.disease = "";
      this.factor = "";
      this.user = "";
      this.pagehelper();
    },
    addInform() {
      const params = {
        diseaseName: this.addCorrleation.diseaseName,
        diseaseCategory: this.addCorrleation.diseaseCategory,
        factorName: this.addCorrleation.factorName,
        factorCategory: this.addCorrleation.factorCategory,
        weight: 1,
        uid: sessionStorage.getItem("userid"),
        username: sessionStorage.getItem("username"),
        status: 1
      };
      const temp = [params]
      console.log(temp)
      postRequest("knowledgeBase/insert", temp).then((res) => {
        if (res.code == 200) {
          this.$message.success("添加成功");
          this.closeDialog();
          this.pagehelper()
        } else {
          this.$message.error("添加失败");
        }
      });
    },
  }
}
</script>

<style scoped>
.searchByCondition {
  width: 100%;
}
.user_input {
  width: 80%;
}
.addInformcontent {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>