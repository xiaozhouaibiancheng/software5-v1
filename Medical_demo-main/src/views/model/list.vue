<template>
    <div class="app-container">
      <span>算法类型：</span>
      <el-select v-model="queryParam.algorithmType" placeholder="请选择算法类型" @change="submitForm()" clearable>
        <el-option label="疾病或危险因素关联挖掘" value="diseaseOrFactor"></el-option>
        <el-option label="疾病-危险因素关联挖掘" value="disease-factor"></el-option>
      </el-select>
      <span style="margin-left: 20px">算法名称：</span>
      <el-input v-model="queryParam.algorithmName" placeholder="请输入算法名称" style="width: 200px" @change="submitForm()"></el-input>
      <el-button style="margin-left: 20px" @click="clearFilter()">取消</el-button>

      <el-divider></el-divider>
      <el-card class="box-card" style="height: 800px">
        <div slot="header" class="clearfix">
          <span><b style="font-size: 20px">算法列表</b></span>
<!--          <el-button class="el-icon-upload" type="success" round style="margin-left: 90%;" @click="submitForm1">    上传</el-button>-->
        </div>
        <div>
          <el-table  v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%"
                     :header-cell-style="{ backgroundColor: '#e8e5e5', color: 'black', fontWeight: 'bold'}">
            <el-table-column prop="id" label="Id" width="90px"/>
            <el-table-column prop="algorithmName" label="算法名称" width="120px" />
            <el-table-column prop="taskType" label="算法类型" width="140px"  />
            <el-table-column prop="algorithmDescription" label="算法描述"  />
            <el-table-column  label="操作" align="center"  width="160px">
              <template slot-scope="{row}">
                <el-button size="mini" @click="$router.push({path:'/sideBar/model/edit',query:{row:row}})" >编辑</el-button>
                <el-button size="mini" type="danger"  @click="deleteTable(row)" class="link-left">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" id="center"
                         :current-page="this.page" :page-sizes="[6, 9, 12, 15, 24]" :page-size="this.size"
                         layout="total, sizes, prev, pager, next, jumper" :total="this.total">
          </el-pagination>
        </div>
      </el-card>
    </div>


  </template>
  
  <script>
  import { postRequest, getRequest } from "@/utils/api";
  import {push} from "echarts/lib/component/dataZoom/history";
  export default {
    data () {
      return {
        queryParam: {
          algorithmName: "",
          algorithmType: ""
        },
        searchObj: {}, //条件封装对象
        subjectFilter: null,
        listLoading: true,
        tableData: [
            {
                id:1,
                name:'sdf',
                tasktype:'ss',
                algorithmDescription:'ll',
                deployFilePath:null
            }
        ],
        page:1,
        size:10,
        total: 0,
      }
    },
    created () {
    //   this.initSubject()
    //   this.searchAll()
      this.submitForm()
    },
    methods: {
      clearFilter(){
        this.queryParam.algorithmType=""
        this.queryParam.algorithmName=""
        this.submitForm()
      },
      searchAll () {
        this.listLoading = true
        postRequest('algorithm/getAll',{}).then(
            (response)=>{
              console.log('1',response)
              this.tableData=response
              this.listLoading=false
            }
        );
      },
      searchByType(type){
        getRequest('algorithm/getByType/'+this.queryParam.algorithmType).then(
            (response)=>{
              console.log(response)
              this.tableData=[]
              this.tableData=response
              this.listLoading=false
              console.log(this.tableData)
            }
        )
      },
      submitForm () {
        this.search()
      },
      submitForm1 () {
        // this.queryParam.pageIndex = 1
        this.$router.push("/model/upload");
      },
      search(){
        // this.listLoading=true
        console.log(this.queryParam)
        this.listLoading = true
        getRequest(
            `algorithm/selectByPage?pageNum=${this.page}&pageSize=${this.size}&algorithmType=${this.queryParam.algorithmType}&algorithmName=${this.queryParam.algorithmName}`
        ).then((res) => {
          console.log(res)
          if (res.code==200) {
            this.total = res.data.total;
            this.tableData = res.data.list;
          }
          this.listLoading=false
        });
        // if(this.queryParam.algorithmName){
        //   getRequest('algorithm/getByName/'+this.queryParam.algorithmName).then(
        //       (response)=>{
        //         console.log(response)
        //         this.tableData=[]
        //         this.tableData=response
        //         this.listLoading=false
        //         console.log(this.tableData)
        //       }
        //   )
        // }
        // else if(!this.queryParam.algorithmName && !this.queryParam.algorithmType){
        //   this.$message.error("请选择算法类型或填写算法名称")
        // }
      },
      handleSizeChange(val) {
        this.size = val;
        this.submitForm();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.submitForm();
      },
      deleteTable (row) {
        let _this = this
        getRequest('algorithm/delete/'+row.id).then(
            (response)=>{
                console.log(response)
                if(response === true){
                    // _this.searchAll()
                    _this.submitForm()
                    _this.$message.success("删除成功")
                }else{
                    _this.$message.error("删除失败")
                }
            }
        )
      },
    }
  }
  </script>
  <style scoped="scoped">
  .pagination {
    margin-top: 2%;
    margin-left: 3%;
  }
</style>