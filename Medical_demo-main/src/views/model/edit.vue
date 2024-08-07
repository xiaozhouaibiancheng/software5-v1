<template>
  <div class="app-container">
    <el-card class="box-card" style="height: 750px">
      <div slot="header" class="clearfix">
        <el-button style="float: left; padding: 3px 0" type="text" @click="back">返回</el-button>
        <h3 style="text-align: center">算法编辑</h3>
      </div>
      <div>
        <el-form
            :model="form"
            ref="form"
            label-width="130px"
            v-loading="formLoading"
            :rules="rules"
        >
          <el-form-item label="算法id：" prop="id">
            <el-input v-model="form.id"  required :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="算法名称：" prop="name" >
            <el-input v-model="form.algorithmName" required></el-input>
          </el-form-item>
          <el-form-item label="任务类型：" prop="type">
            <el-select v-model="form.taskType" placeholder="请选择算法类型"  style="width: 1600px" clearable>
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input v-model="form.algorithmDescription"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 650px;margin-top: 100px">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>

import { postRequest } from "@/utils/api";
export default {
  data() {
    return {
      options: [{
        value: 'diseaseOrFactor',
        label: 'diseaseOrFactor'
      }, {
        value: 'disease-factor',
        label: 'disease-factor'
      }],
      form: {
        id: null,
        algorithmName: null,
        taskType: null,
        algorithmDescription: null,
        deployFilePath: null
      },
      formLoading: false,
      rules: {
        userName: [
          { required: true, message: '请输入数据表名', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.unit()
  },
  methods: {
    unit(){
      this.form.id = this.$route.query.row.id
      this.form.algorithmName = this.$route.query.row.algorithmName
      this.form.taskType = this.$route.query.row.taskType
      this.form.algorithmDescription = this.$route.query.row.algorithmDescription
    },
    back(){
      this.$router.push("/sideBar/model/list");
    },
    submitForm() {
      let _this = this
      this.formLoading = true
      postRequest('algorithm/update', this.form).then(
        response => {
          console.log(response)
          if (response === true) {
            _this.$message.success("修改成功")
            _this.$router.push('/sideBar/model/list')
          } else {
            _this.$message.error("修改失败")
            _this.formLoading = false
          }
        })
    },
    resetForm() {
      this.unit()
      // let lastId = this.form.id
      // this.$refs['form'].resetFields()
      // this.form.algorithmDescription=null
      // this.form = {
      //   id: null,
      //   name: null,
      //   type: null,
      //   description: null,
      //   tableCreateId: null,
      //   createTime: null
      // }
      // this.form.id = lastId
    },
  }
}

</script>

<style scoped>
.upload {
  height: 10.666667rem;
  width: 100%;
  display: table;
  text-align: center;
}
</style>