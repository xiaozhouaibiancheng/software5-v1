<template>
  <div class="app-container">
    <el-card class="box-card" style="height: 750px">
      <div slot="header" class="clearfix">
        <el-button style="float: left; padding: 3px 0" type="text" @click="back">返回</el-button>
        <h3 style="text-align: center">算法上传</h3>
      </div>
      <div>
        <el-form
            :model="form"
            ref="form"
            label-width="130px"
            v-loading="formLoading"
            :rules="rules"
        >
          <!-- <el-form-item label="数据表id："  prop="id" required>
              <el-input v-model="form.id"></el-input>
            </el-form-item> -->
          <el-form-item label="算法名称：" prop="name">
            <el-input
                v-model="form.algorithmName"
                placeholder="与上传文件名一致，且带后缀名"
            ></el-input>
          </el-form-item>
          <el-form-item label="算法类型：" prop="type">
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

          <el-form-item label="算法描述：">
            <el-input v-model="form.algorithmDescription"></el-input>
          </el-form-item>
          <!-- <el-form-item label="数据表上传时间：">
              <el-input v-model="form.createTime"></el-input>
            </el-form-item> -->
          <span class="upload">
        <el-upload
            class="upload-demo"
            ref="upload"
            drag
            action="http://10.16.48.219:8005/api/algorithm/upload"
            multiple
            :auto-upload="false"
            :limit="5"
            :on-success="handleFilUploadSuccess"
            :on-remove="handleRemove"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">大小不超过500m</div>
        </el-upload>
      </span>
          <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleUpload">确 定</el-button>
          </span> -->
          <el-form-item style="margin-left: 650px; margin-top: 150px">
            <el-button
                type="primary"
                @click="
            submitForm();
            handleUpload();
          "
            >提交</el-button
            >
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
      },
      success: false,
    }
  },
  methods: {
    back(){
      this.$router.push("/sideBar/model/list");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 文件上传成功时的函数
    handleFilUploadSuccess(res, file, fileList) {
      console.log(res, file, fileList)
      this.$message.success("文件上传成功")
    },
    // 处理文件上传的函数
    handleUpload() {
      // console.log(res,file)
      this.submitUpload()
    },
    submitForm() {
      let _this = this
      this.formLoading = true
      postRequest('algorithm/insert', this.form).then(
        response => {
          console.log(response)
          if (response === true) {
            _this.$message.success("算法上传成功")
            this.submitUpload()
            _this.$router.push('/model/list')
          } else {
            _this.$message.error("算法上传失败")
            _this.formLoading = false
          }
        })


    },
    resetForm() {
      //   let lastId = this.form.id
      //   this.$refs['form'].resetFields()
      this.form = {
        id: null,
        name: null,
        type: null,
        description: null,
        tableCreateId: null,
        createTime: null
      }
      //   this.form.id = lastId
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