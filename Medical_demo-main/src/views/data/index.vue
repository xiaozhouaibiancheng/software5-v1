<template>
  <div class="content">
    <div class="left_tree">
      <div class="tipInfo">
        <h3>可选数据</h3>
        <span class="statistic">多病种知识库: {{ number1 }} 个 ▍ </span>
        <!--        <br>-->
        <span class="statistic">公开数据集: {{ number2 }} 个</span>
        <hr class="hr-dashed" />
        <el-tree :data="data2" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="true">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                  v-if="!data.isLeafs"
                  icon="el-icon-folder-add"
                  size="mini"
                  type="text"
                  @click="multMarkNode(data)"
              >
              </el-button>

              <el-popconfirm title="删除后无法恢复" icon="el-icon-warning" icon-color="red" confirm-button-text="确认"
                             cancel-button-text="取消" @confirm="() => remove(node,data)">
                <el-button v-if="(data.uid === loginUserID && data.isLeafs===true && data.value!=='多病种知识库')" icon="el-icon-delete" size="mini" type="text" slot="reference">
                </el-button>
              </el-popconfirm>

            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <!--===============================     导入多病种数据表单   ===================================================================-->
    <el-dialog
        v-loading="loading"
        :element-loading-text="loadText"
        id="importDataTable"
        title="导入多病种数据表"
        :visible.sync="dialogMultiFormVisible"
        width="40%"
    >
      <el-form
          :model="dialogForm"
          ref="dialogFormRef"
          :rules="dialogForm.rules"
          label-width="110px"
      >
        <el-form-item label="选择数据表" prop="filesInfo">
          <el-upload
              action=""
              class="upload"
              ref="uploadRef"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="changeFile"
              :auto-upload="false"
              accept=".csv"
              :limit="1"
              :multiple="false"
              :file-list="dialogForm.filesInfo"
              :http-request="
                        (data) => {
                          multUpRequest(data);
                        }
                      "
          >
            <el-button slot="trigger" size="small" type="success"
            >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传csv文件，且数据集需含有disease_name和factor_name列</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="数据表名称" prop="tableName">
          <el-input
              v-model="dialogForm.tableName"
              placeholder="请输入数据表名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="数据表描述" prop="tableDescribe" required>
          <el-input
              v-model="dialogForm.tableDescribe"
              placeholder="请简要描述一下"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
<!--        <el-button-->
<!--            @click="-->
<!--                      dialogFormVisible = false;-->
<!--                      resetForm('dialogFormRef');-->
<!--                    "-->
<!--        >取消</el-button-->
<!--        >-->
<!--        <el-button @click="resetForm('dialogFormRef')">重置</el-button>-->
        <el-button type="primary" @click="multUploadFile">提交</el-button>
      </div>
    </el-dialog>
    <div class="right_table">
      <el-card class="right_table_topCard" :body-style="{ height: '850px' }">
        <div style="height: 30px; padding-left: 5px">
          <h3 style="margin: -20px">数据预览</h3>
          <el-button type="primary" @click="csvDialogVisible = true" size="mini" v-if="showDataForm.tableName"
                     class="csv_btn">导出数据</el-button>
        </div>
        <div class="describe_content">
          <p style="margin-top: 0.5%; width: 100%">
            <i class="el-icon-folder"></i> 数据集名称:<span style="font-weight: bold; font-size: 18px; color: #252525">{{
              showDataForm.tableName }}</span>
            <i class="el-icon-user"></i> 创建人:<span>{{
              showDataForm.createUser
            }}</span>
            <i class="el-icon-time"></i> 创建时间:<span>{{
              showDataForm.createTime
            }}</span>
            <i class="el-icon-finished"></i> 样本个数:<span>{{
              showDataForm.sampleNum
            }}</span>
            <i class="el-icon-finished"></i> 特征个数:<span>{{
              allColumns.length
            }}</span>
            <i class="el-icon-folder-opened"></i> 所属类别:<span>{{ showDataForm.classPath }}</span>
          </p>
        </div>

        <el-dialog title="请选择要导出的字段" :visible.sync="csvDialogVisible" width="60%" :before-close="handleCloseCSV">
          <div class="selectFeatrueDescribe" style="background-color: #f5f7fa">
            <i class="el-icon-s-help"></i> 字段个数:<span>{{
              allColumns.length
            }}</span>
            <i class="el-icon-finished" style="margin-left: 50%"></i>
            已选字段个数:<span>{{ selectedFields.length }}</span>
          </div>
          <el-divider></el-divider>
          <el-checkbox v-model="selectAll" @change="handleSelectAll" /> 全选
          <el-checkbox-group v-model="selectedFields">
            <el-checkbox style="width: 150px" v-for="field in allColumns" :key="field" :label="field">{{ field
              }}</el-checkbox>
          </el-checkbox-group>
          <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseCSV">取 消</el-button>
          <el-button type="primary" @click="toCSV">确 定</el-button>
        </span>
        </el-dialog>
        <div class="tabledata">
          <!-- 显示表数据 -->
<!--          <el-table :data="tableData" stripe style="width: 100%" class="custom-table">-->
<!--            <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" width="80">-->
<!--              <template slot-scope="{ row }">-->
<!--                <div class="truncate-text">{{ row[key] }}</div>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
          <el-table :data="tableData" stripe style="width: 100%" class="custom-table" max-height="700">
            <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" width="200">
              <template slot-scope="{ row }">
                <div class="truncate-text">{{ row[key] }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRequest, postRequest } from "@/api/user";
import { getFetures } from "@/api/feature.js";
import { getCategory, addDisease, removeCate } from "@/api/category";
import { getTableDes, getTableData} from "@/api/tableDescribe.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { disOptions } from "@/components/tab/constData.js";
import { resetForm, debounce } from "@/components/mixins/mixin";
import {utils} from "xlsx";
import * as XLSX from "xlsx";

let id = 1000;

export default {

  mixins: [resetForm, debounce],
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    loginUserID() {
      return (sessionStorage.getItem("userid") - 0);
    },
  },

  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();

    },
  },

  data() {
    return {
      tableSize: 0,
      number1:1,
      number2:0,
      allColumns:[],
      checkAll: false,
      isIndeterminate: true,
      showColumnSelection:false,
      selectedColumns:[],
      treeData1:[],

      // 获取虚拟树形结构数据
      // treeData: JSON.parse(JSON.stringify(treeData)),
      treeData: [],
      // 获取虚拟表格数据
      // tableData: JSON.parse(JSON.stringify(tableData)),
      tableData: [],
      fullData: '',
      showTooltip: false,
      hoverTimer: null,
      dialogDiseaseVisible: false,
      dialogDataVisible: false,
      dialogMultiFormVisible: false,
      characterVisible: false,
      showAddTableData: false,
      characterId:1,
      showDataForm: {
        tableName:'',
        createUser:'',
        createTime:'',
        classPath:'',
        sampleNum:'',
        featureNum: '',
      },
      addDataForm:{
        dataName:"",
        createUser: "",
        createTime: "",
        path: "",
        characterList:[
          {
            opt:'',
            characterId:-1,
            featureName: '',
            chName: '',
            type: '',
            unit:'',
            range:'',
            button:'点击选择特征',
            value:'',
            computeOpt:''
          }
        ]
      },
      characterOptList:[
      ],
      addTableData: [],
      input3: '',
      dataid:'1005',
      datalable:'copd',
      select: '',

      dialogDiseaseVisible2: false,

      nodeData: {},

      diseaseName:'',

      loading: false,
      loading2: false,
      getData_loading: false,
      loadText: "拼命加载中",
      loadText2: "拼命加载中",
      disease: "",
      creator: "",
      disOptions,
      featuresVision: false,
      DatadialogVisible:false,
      featuresMap: {},
      patientTable:[],
      dialogForm: {
        filesInfo: [],
        tableDescribe:'',
        tableName: "",
        isOnly: true,
        dataDisease: "",
        featuresNum: 1,
        fields: [{ name: "", type: "" }],
        rules: {
          tableName: [
            {
              required: true,
              message: "数据表名称不能为空",
              trigger: "change",
            },
          ],
          dataDisease: [
            {
              required: true,
              message: "涉及疾病不能为空",
              trigger: "blur",
            },
          ],
          numFeatures: [
            { required: true, message: "特征个数不能为空", trigger: "blur" },
            { type: "integer", message: "特征个数需为整数", trigger: "blur" },
            { min: 1, message: "特征个数需>1", trigger: "blur" },
          ],
        },
      },
      selectAll: false,
      csvDialogVisible: false,
      selectedFields: [],
      fields: [],
      dialogFormVisible: false,
      options: {
        method: "post",
        data: {},
        url: "/DataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
        data2: [{
          label: '多病种知识库',
          value:'knowledgebase',
          uid:0,
          isLeafs: true,
        }, {
          label: '公开数据集',
          isLeafs: false,
          uid:0,
          children: []
        }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      tableInfo: {
        id: null,
        name: null,
        valueName: null,
        type: null,
        description: null,
        createUser: null,
        createTime: null
      },
      };
  },

  created() {
    // 检查重名的防抖函数
    this.checkTableName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
        newname: this.dialogForm.tableName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    // this.getCatgory();
    this.getTable(1)
    this.getTableData("1","knowledgebase");
    this.getTreeData1();
    console.log("loginuserid:", this.loginUserID)
  },

  methods: {
    exportData(selectedColumns) {
      console.log('----------------------')
      console.log(this.showDataForm.tableName)
      getTableData("/api/getTableData", this.dataid, this.showDataForm.tableName)
          .then(response => {
            console.log(this.showDataForm.tableName)

            // 确保 response.data 不为空
            if (response.data && response.data.length > 0) {
              this.tableData1 = response.data;
              this.showDataForm.sampleNum = response.data.length
              const a = Object.keys(this.tableData[0]);
              const allColumns = Object.keys(this.tableData[0]);
              this.allColumns = allColumns;
              this.showDataForm.featureNum = this.allColumns.length;
              console.log("数据长度：" + response.data.length);

              // 根据selectedColumns过滤tableData
              const filteredData = this.tableData1.map(row => {
                return selectedColumns.reduce((acc, key) => ({
                  ...acc,
                  [key]: row[key],
                }), {});
              });

              // 将数据转换为适合Excel的工作簿对象
              const ws = utils.json_to_sheet(filteredData); // 或者 utils.json_to_sheet(filteredData);

              // 创建工作簿
              const wb = XLSX.utils.book_new();

              // 添加worksheet到工作簿
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

              // 导出为Excel文件
              const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
              const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

              // 使用FileSaver或者其他兼容的方式保存文件
              saveAs(blob, 'selected_data.xlsx'); // 假设 saveAs 函数来自 FileSaver 库
            } else {
              console.error("未获取到有效的表数据。");
            }
          })
          .catch(error => {
            console.error("获取表数据出错：", error);
          });
    },
    handleExport() {
      this.showColumnSelection = false; // 关闭对话框
      // 现在可以使用this.selectedColumns来进行数据导出


      this.exportData(this.selectedColumns);
    },
    handleCheckAllChange(val) {
      this.selectedColumns = val ? this.allColumns : [];
      this.isIndeterminate = false;
    },
    compelete() {
      // 判断多标签合理性
      let labelCount = 0;
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          if (this.featuresMap[key] == "label") {
            labelCount++;
          }
        }
      }
      if (labelCount < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请至少设置一个标签特征",
        });
        return false;
      }
      if (this.dialogForm.dataDisease != "多疾病" && labelCount > 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "只有多病种数据集能设置多个标签特征",
        });
        return false;
      }

      this.loadText2 = "正在添加字段类型";
      this.loading2 = true;
      let tableHeaders = [];
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          switch (this.featuresMap[key]) {
            case "diagnosis":
              tableHeaders.push({
                fieldName: key,
                isDiagnosis: "1",
              });
              break;
            case "examine":
              tableHeaders.push({
                fieldName: key,
                isExamine: "1",
              });
              break;
            case "pathology":
              tableHeaders.push({
                fieldName: key,
                isPathology: "1",
              });
              break;
            case "vital_signs":
              tableHeaders.push({
                fieldName: key,
                isVitalSigns: "1",
              });
              break;
            case "label":
              tableHeaders.push({
                fieldName: key,
                isLabel: "1",
              });
              break;
            default:
              break;
          }
        }
      }
      // let userId = sessionStorage.getItem("userid")-0;
      // 上传特征分类结果
      postRequest("/api/feature/insertFeature", {
        tableName: this.dialogForm.tableName,
        tableHeaders
        // userId
      }).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
      });

      // 重新上传数据表，使其保存到数据列表中
      // 此处上传时后台已有数据表，可和后台配合只发送保存通知已提高效率
      // this.options.url = "/DataTable/uploadTable";
      // this.$axios(this.options).then((res) => {

      //   this.loading2 = false;
      //   this.resetForm('dialogFormRef');
      //   if (res?.code == "200") {
      //     this.$message({
      //       showClose: true,
      //       type: "success",
      //       message: "上传成功",
      //     });
      //     this.featuresVision = false;
      //     this.dialogFormVisible = false;
      //     this.getDataList();
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       type: "error",
      //       message: "上传失败",
      //     });
      //   }
      // });
      this.getCategory(); // 更新目录结构
    },
    changeLabel(name, label) {
      console.log("name: ")
      console.log(name)

      console.log("label:")
      console.log(label)

      this.featuresMap[name] = label;
    },
    confirmCharacter(){
      this.characterVisible = false
      let index = this.addDataForm.characterList.indexOf(this.characterOptItem)
      let oldObj = this.addDataForm.characterList[index]
      for (let i = 0; i < this.characterOptList.length; i++) {
        let a = this.characterOptList[i]
        if (this.characterId == a.characterId){
          oldObj.characterId = a.characterId
          oldObj.featureName = a.featureName
          oldObj.chName = a.chName
          oldObj.type = a.type
          oldObj.unit = a.unit
          oldObj.range = a.range
          oldObj.button = a.chName
          oldObj.value = ''
          // oldObj.opt = this.characterItem.opt
          oldObj.opt = this.opt
        }
      }
      this.addDataForm.characterList[index] = oldObj
      console.log(this.addDataForm.characterList);
      this.characterId=''
    },

    // 数据表上传函数
    upRequest(data) {
      console.log("开始上传文件")
      const payload = new FormData();
      payload.append("file", data.file);
      payload.append("tableName", this.dialogForm.tableName);
      // payload.append("disease", this.dialogForm.dataDisease);
      payload.append("createUser", sessionStorage.getItem("username"));
      payload.append("uid", sessionStorage.getItem("userid")-0);
      payload.append("description", this.dialogForm.tableDescribe);

      console.log("============================:", payload)

      // payload.append("parentId", this.nodeData.id);
      // payload.append("parentType", this.nodeData.path);

      this.options = {
        method: "post",
        data: payload,
        url: "tables/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$axios(this.options).then((res) => { // 返回表头信息
        this.loading = false;
        console.log(res);
        if (res?.code == "200") {
          this.$message({
            showClose: true,
            type: "success",
            message: "解析成功",
          });
          console.log("返回数据为：")
          console.log(res);
          let featureList = res.data;
          // 把特征存为map的键
          for (const item of featureList) {
            this.$set(this.featuresMap, item, "diagnosis");
          }
          // this.featuresVision = true;
          this.dialogFormVisible = false;
          this.getCatgory();
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "解析失败",
          });
        }
      });
    },
    multUpRequest(data) {
      const fileSize = data.file.size;
      const fileSizeInMB = (fileSize / (1024.0 * 1024.0)).toFixed(2)
      const payload = new FormData();
      payload.append("file", data.file);
      payload.append("tableName", this.dialogForm.tableName);
      payload.append("createUser", sessionStorage.getItem("username"));
      payload.append("uid", sessionStorage.getItem("userid")-0);
      payload.append("description", this.dialogForm.tableDescribe);
      payload.append("tableSize", fileSizeInMB);
      console.log("============================:", payload)
      this.options = {
        method: "post",
        data: payload,
        url: "tables/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$axios(this.options).then((res) => { // 返回表头信息
        this.loading = false;
        console.log("======================")
        console.log(res);
        if (res?.msg === "200") {
          this.$message({
            showClose: true,
            type: "success",
            message: "解析成功",
          },
          this.dialogMultiFormVisible = false,
          location.reload()
          );
          console.log("返回数据为：")
          console.log(res);

        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "解析失败",
          });
        }
      });
    },
    getCatgory(){
      getCategory("/api/category").then((response)=>{
        this.treeData = response.data;
      })
    },
    uploadFile() {
      console.log("开始上传文件")
      if (this.$refs["uploadRef"].uploadFiles.length < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择数据表",
        });
        return false;
      }
      this.checkTableName();
      if (!this.dialogForm.isOnly) {
        return false;
      }
      this.$refs["dialogFormRef"].validate((valid) => {
        if (valid) {
          this.loadText = "正在上传并解析文件";
          this.loading = true;
          this.$refs.uploadRef.submit();
        }
      });
    },
    handleSelectAll() {
      if (this.selectAll) {
        this.selectedFields = this.allColumns.filter((feature) => feature);
      } else {
        // 如果一键全选按钮未选中，则清空已选择数组
        this.selectedFields = [];
      }
    },
    multUploadFile() {
      console.log("开始上传文件")
      if (this.$refs["uploadRef"].uploadFiles.length < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择数据表",
        });
        return false;
      }
      this.checkTableName();
      if (!this.dialogForm.isOnly) {
        return false;
      }
      this.$refs["dialogFormRef"].validate((valid) => {
        if (valid) {
          this.loadText = "正在上传并解析文件";
          this.loading = true;
          this.$refs.uploadRef.submit();
        }
      });
    },
    getTableDescribe(id){
      getTableDes("/api/tableDescribe",id).then(response=>{
        this.showDataForm.tableName = response.data.tableName
        this.showDataForm.createUser = response.data.createUser;
        this.showDataForm.createTime = response.data.createTime;
        this.showDataForm.classPath = response.data.classPath;
        this.tableData = [];
      })
          .catch(error=>{
            console.log("错误",error)
          });
    },
    handleCloseCSV() {
      this.selectedFields = [];
      this.csvDialogVisible = false;
    },
    toCSV() {
      // 发送请求给后端，传递表名和选定的字段
      getRequest(`/api/getInfoByTableName/${this.showDataForm.tableName}`).then(
          (res) => {
            const header = this.selectedFields.join(",") + "\n";
            const data = res.data;
            // 构建数据行
            const rows = data
                .map((row) => {
                  const values = this.selectedFields.map((field) => {
                    return this.formatCSVValue(row[field]);
                  });
                  return values.join(",");
                })
                .join("\n");

            // 合并表头和数据行
            const csvContent = header + rows;
            console.log("============================================",csvContent);

            // 创建 Blob 对象
            const blob = new Blob([csvContent], { type: "text/csv" });

            // 创建 URL
            const url = window.URL.createObjectURL(blob);

            // 创建 a 标签
            const link = document.createElement("a");

            // 设置下载属性
            link.href = url;
            link.download = this.showDataForm.tableName + ".csv";

            // 模拟点击下载
            link.click();

            // 释放资源
            window.URL.revokeObjectURL(url);
            this.csvDialogVisible = false;
            this.selectedFields = [];
          }
      );
    },
    getTreeData1(){
      postRequest('/tables/getAll', {}).then(response=>{
        this.treeData1 = response;
        let i;
        for(i=0;i<response.length;i++){
          if(response[i].type === 1){
            this.number2 = this.number2 + 1
            let node2 = {label: '', value: '', isLeafs: true, uid:0}
            node2.label = response[i].valueName;
            node2.value = response[i].name;
            node2.uid = response[i].uid;
            this.data2[1].children.push(node2)
          }
        }
      })
    },
    formatCSVValue(value) {
      // 处理特殊字符
      if (
          typeof value === "string" &&
          (value.includes(",") || value.includes("\n"))
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    },
    getTable(tableId){
      getRequest('tables/getById/' + tableId).then(
          (response) => {
            console.log("11111==", response)
            this.showDataForm.tableName = response.name
            this.showDataForm.createUser = response.createUser;
            this.showDataForm.createTime = response.createTime;
            this.showDataForm.sampleNum = 50
            this.showDataForm.featureNum = 7
            this.showDataForm.classPath = 'knowledgebase'
          }
      )
    },
    getTableData(tableId,tableName){
      getTableData("/tables/getTableData",tableId,tableName).then(response=>{   // 获取表数据
        console.log(response.data)
        this.tableData = response.data;
        console.log("数据长度"+response.data.length)
        if (Array.isArray(this.tableData) && this.tableData.length > 0) {
          this.allColumns = Object.keys(this.tableData[0]); // 对象形式的表头
          // 或者，如果表头是数组形式：this.allColumns = this.tableData[0];

          console.log("限制数据长度" + this.tableData.length);
          console.log("表头: ", this.allColumns);
        } else {
          console.warn("没有获取到表头数据");
        }
      })
          .catch(error=>{
            console.log(error);
          })
    },
    changeData(data){
      if(data.isLeafs==1) {
        //获取描述信息
        this.getTableDescribe(data.id);
        //获取数据信息
        this.getTableData(data.id, data.label);

      }
    },
    append(isLeaf) {
      // 发送请求新增一个病种信息（目录结构）
      let catagoryNode = {
        label: this.diseaseName,
        catLevel: this.nodeData.catLevel+1,
        parentId: this.nodeData.id,
        isLeafs: isLeaf,
        isCommon: this.nodeData.isCommon,
        path: this.nodeData.path+"/"+this.diseaseName,
        isDelete: 0,
        children: []
      };

      let catagoryNodeJSON = JSON.stringify(catagoryNode);
      addDisease("/api/addDisease",catagoryNodeJSON).then(response=>{
        this.getCatgory(); //刷新目录结构
        console.log(response.data);
      })
          .catch(error=>{
            alert("新增疾病目录错误"+error)
          })
      this.nodeData = {};
      this.cleanInput();
      this.dialogDiseaseVisible = false;
    },
    appendCommon() {
      const newChild = { id: id++, label: this.diseaseName, children: [] , isLeafs: false,isCommon:true};
      if (!this.nodeData.children) {
        this.$set(this.nodeData, 'children', []);
      }
      this.nodeData.children.push(newChild);
      this.nodeData = {};
      this.cleanInput();
    },
    remove(node,data) {
      let id=0;
      let fileSize = 0;
      let tableName = '';
      let username = '';
      console.log("")
      for(let i=0;i<this.treeData1.length;i++){
        if(this.treeData1[i].name === node.label){
          id = this.treeData1[i].id;
          tableName = this.treeData1[i].name
          username = this.treeData1[i].createUser
          fileSize = this.treeData1[i].tableSize
        }
      }
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex((d) => d.id === data.id);
      // children.splice(index, 1);
      removeCate("/tables/delete",{
        id:id,
        tableSize:fileSize,
        tableName:tableName,
        uid:sessionStorage.getItem("userid")-0,
        username:username
          }
      ).then(response=>{ // data就是要删除的目录信息
        console.log("删除的信息：")
        console.log(response.data);
        // this.showDataForm={};
        // this.tableData=[];
        this.getTreeData1();
        location.reload()
      }).catch(error=>{
        console.log(error);
      })
    },

    addDisease() {
      const newNode = { id: id++, label: this.diseaseName, children: [] , isLeafs: false};
      this.treeData.push(newNode);
      this.cleanInput()
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id])
      }
    },

    markNode(data){
      console.log(data);
      this.nodeData = data;
    },

    multMarkNode(data){
      this.dialogMultiFormVisible=true;
      console.log(data);
      this.nodeData = data;
    },

    cleanInput(){
      this.dialogDiseaseVisible = false;
      this.dialogDiseaseVisible2 = false;
      this.diseaseName = ""
    },
    cleanDataInput(){
      this.dialogDataVisible = false
    },
    addTable(){ // 创建表
      this.diseaseName = this.addDataForm.dataName
      this.dialogDataVisible = false
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/createTable",
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.$axios(this.options).then(res=>{
        console.log("数据:")
        console.log(res.data);
      });
      this.append(1)
    },
    putToAddDataForm(){
      let number = -Math.floor(Math.random() * 100);
      let item = {
        opt:'',
        characterId:-1,
        featureName: '',
        chName: '',
        type: '',
        unit:'',
        range:'',
        removeIndex:number,
        button:'点击选择特征',
        value:'',
        computeOpt:''
      }
      this.addDataForm.characterList.push(item);
    },
    deleteToAddDataForm(item){
      let index = this.addDataForm.characterList.indexOf(item)
      if (index !== -1) {
        this.addDataForm.characterList.splice(index, 1)
      }
    },
    chooseCharacter(item){
      this.exchangeCharacterList(0);
      this.characterVisible = true
      this.characterOptItem = item
    },
    submitCharacterCondition() {
      console.log("this.addDataForm.characterList");
      console.log(this.addDataForm.characterList)
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/filterTableData",
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("请求参数："+JSON.stringify(filterConditions))
      this.$axios(this.options).then(res=>{
        this.addTableData = res.data;
        console.log("数据:")
        console.log(this.addTableData)
        this.showAddTableData = true
      }).catch((error)=>{
        this.$message.error("获取数据失败");
        console.log("获取数据失败"+error);
      });
      //展示表格

      //发送axios请求
      // getFielterData("/api/filterTableData",this.addDataForm, this.nodeData).then(response=>{
      //   console.log(response.data);
      // }).catch(error=>{
      //   console.log("数据筛选失败！！！！！！！！！！");
      // })
      let s = JSON.stringify(this.addDataForm.characterList, null, 2);
      console.log("this.addDataForm:")
      console.log(this.addDataForm)
      console.log(s)
    },
    getNowDateFormat() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    exchangeCharacterList(index){
      getFetures("/api/feature/getFeatures",index).then(response=>{
        console.log("特征为：");
        console.log(response.data);
        this.characterOptList = response.data;
        console.log(this.characterList)
      }).catch(error=>{
        console.log(error);
      })
    },
    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),
    getData(tablename) {
      this.DatadialogVisible = true;
      this.getData_loading = true;
      getRequest("/DataTable/getInfoByTableName", {
        tableName: tablename,
      }).then((res) => {
        this.patientTable = res.data;
        console.log("patientTable:"+res.data);
        this.getData_loading = false;
      });
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(row) {
      postRequest(`DataTable/delete/${row.id}`).then((res) => {
        this.SetDataList(res.reverse());
      });
    },
    clearFilter() {
      this.disease = "";
      this.creator = "";
    },
    importData() {
      this.dialogFormVisible = true;
    },

    handleSubmit() {
      console.log("文件上传中...");
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      //上传前的验证
      const isCSV =
          file.type === "text/csv" || file.type === "application/vnd.ms-excel";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isCSV) {
        this.$message.error("上传文件仅支持 CSV 格式");
      }
      // return isJPG && isLt2M;
      return isCSV;
    },

    removeFileExtension(fileName) {
      // 寻找最后一个点号的位置
      const lastDotIndex = fileName.lastIndexOf(".");

      // 如果找到了点号并且不在文件名的开头或结尾
      if (
          lastDotIndex !== -1 &&
          lastDotIndex < fileName.length - 1 &&
          lastDotIndex > 0
      ) {
        // 返回删除了后缀的文件名部分
        return fileName.substring(0, lastDotIndex);
      } else {
        // 如果没有找到点号或者点号在文件名的开头或结尾，直接返回原文件名
        return fileName;
      }
    },

    changeFile() {
      console.log(this.$refs["uploadRef"].uploadFiles);
      if (this.dialogForm.tableName.length < 1) {
        this.dialogForm.tableName = this.removeFileExtension(
            this.$refs["uploadRef"].uploadFiles[0].name
        );
      }
    },
    handleNodeClick(data) {
      let tableName = data.value
      let tableId = '100'
      if(data.isLeafs) {
        getTableData("/tables/getTableData", tableId, tableName).then(response => {   // 获取表数据
          console.log(response.data)
          this.tableData = response.data;
          if (Array.isArray(this.tableData) && this.tableData.length > 0) {
            this.allColumns = Object.keys(this.tableData[0]); // 对象形式的表头
            // 或者，如果表头是数组形式：this.allColumns = this.tableData[0];

            console.log("限制数据长度" + this.tableData.length);
            console.log("表头: ", this.allColumns);
          } else {
            console.warn("没有获取到表头数据");
          }
          console.log("数据长度" + response.data.length)
        })
            .catch(error => {
              console.log(error);
            })
        console.log(this.treeData1)
        let i;
          for(i=0;i<this.treeData1.length;i++){
          if(this.treeData1[i].valueName === data.label){
            let path = ''
            if(this.treeData1[i].type===1){
              path = '公开数据集/'
            }
            this.showDataForm.tableName = this.treeData1[i].name
            this.showDataForm.createUser = this.treeData1[i].createUser;
            this.showDataForm.createTime = this.treeData1[i].createTime;
            this.showDataForm.classPath = path + data.label;
          }
        }
      }
      }
  },

};
</script>

<style scoped>
#top_buttons > * {
  display: inline-block;
}
.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#DiseaseFilter {
  margin-right: 40px;
}
#creatorFilter {
  margin-right: 20px;
}
#top_right_buttons {
  float: right;
  margin-right: 100px;
}
#table {
  margin-top: 10px;
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
h3 {
  color: #3d3d3d;
  text-align: center;
}

.featureLabel {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}
.horizontal-line {
  border: none; /* 移除默认的边框 */
  border-top: 1px solid #000; /* 定义水平线的样式，可以根据需要修改颜色、宽度等 */

}

.featureLabel .el-form-item__label {
  color: #252525;
}


.left_tree {
  display: inline-block;
  height: 820px;
  width: 18%;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.right_table {
  display: inline-block;
  height: 820px;
  width: 82%;
  position: absolute;
  /* border: none; */
  /* overflow-y: auto; */
}

.right_table_topCard {
  padding: 0;
  height: 820px;
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  /* top: 2%; */
  left: 1%;
  /* overflow-y: auto; */
}
.clearfix:before,
.clearfix:after {

  display: table;
  content: "";
}
.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
}

.describe_content {
  display: inline-block;
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.describe_content span {
  margin: 10px;
}

.add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.nameInput {
  width: 70%;
}

.csv_btn {
  position: absolute;
  right: 2%;
  top: 1%;
}

.addDataClass {
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 16px;
}
.addDataClass .el-input {
  width: 160px;
}
.addDataClass .addDataBaseInfo {
  margin-left: 50px;
}
.addDataClass .addDataTitle{
  margin-top: 10px;
  margin-right: 15px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.lineStyle{
  color: '#5470C6',
}
.cool-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(to right, #26acdf, #3ee09a);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 200px;
  letter-spacing: 1px;
  cursor: pointer
}
.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 100px;
  text-align: center;
}

.cool-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}
.content {
  position: relative;
  width: 100%;
  height: 820px;
}

.cool-button:hover {
  background: linear-gradient(to right, #51bae2, #80e7bb);
}

.cool-button:hover::before {
  transform: scaleX(1);
}
.custom-table tr {
  background-color: #dcf3fc !important;
}
.tableData {
  width: 100%;
  height: 700px;
  overflow-y: auto;
}
.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}
</style>