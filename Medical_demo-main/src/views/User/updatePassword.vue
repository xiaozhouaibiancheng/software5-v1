<template>
<div>
  <div style="display: flex; justify-content: center; align-items: center; height: calc(100vh - 150px);">
    <el-card style="width: 40%;">
      <el-button
          type="text"
          @click="returnIndex"
          style="
              align-self: flex-start;
              margin-left: 20px;
              color: rgb(128,128,128);
              font-size: 15px;
            "
      >返回</el-button>
      <h3 style="text-align: center;margin-bottom: 20px;font-weight: bolder;">修改密码</h3>
      <el-form ref="form" :model="form" label-width="150px" style="width: 60%;font-size: 15px" :rules="rules">
        <el-form-item label="原密码:" prop="originPass" >
          <el-input show-password v-model="form.originPass" placeholder="请输入原密码" @blur="VerifyPas"></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPass">
          <el-input show-password v-model="form.newPass" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="confirmNewPass">
          <el-input show-password v-model="form.confirmNewPass"  placeholder="请确认新密码" @blur="compare"></el-input>
        </el-form-item>
      </el-form>
      <div id="center" style="margin-top: 25px">
        <el-button type="primary" @click="charge">保存</el-button>
      </div>
    </el-card>
  </div>
</div>
</template>
<script>
import {getRequest, postRequest} from "@/utils/api";
import sha256 from 'crypto-js/sha256'; // 导入SHA-256加密算法

export default {
  name:"updatePassword",
  data(){
    let checkPwd2 = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error("请确认密码不能为空"));
      } else if (value !== this.forgetForm3.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    let checkPwd1 = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error("请确认密码不能为空"));
      } else {
        // 例如，密码需要至少 8 个字符，包含字母和数字
        if (!/^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,}$/.test(value)) {
          callback(
              new Error(
                  "密码至少需要8个字符，且包含字母、数字、特殊字符串任意两种"
              )
          );
        } else {
          callback();
        }
      }
    };
    return{
      form:{
        originPass:"",
        newPass:"",
        confirmNewPass:"",
      },
      uid: sessionStorage.getItem("userid")
        ? parseInt(sessionStorage.getItem("userid"))
        : 0,
      user: sessionStorage.getItem("username")
          ? sessionStorage.getItem("username")
          : "",
      rules:{
        originPass:[
          {  required: true ,message:"请输入原密码"},
        ],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: checkPwd1, trigger: "blur" },
        ],
        confirmNewPass:[
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: checkPwd2, trigger: "blur" }
        ],
      },
    }
  },
  methods: {
    returnIndex() {
      this.$router.push("/dash");
    },
    charge(){
      if(this.form.originPass === ""){
        this.$message.error("请先输入原密码")
        return;
      } else if(this.form.newPass === ""){
        this.$message.error("新密码不能为空")
        return;
      }else if(this.form.confirmNewPass === ""){
        this.$message.error("请确认密码")
        return;
      }
      let request = {
        username: this.user,
        password: sha256(this.form.newPass).toString()
      };
      postRequest('/user/updatePas',request).then(res => {
        if(res.code === 200){
          this.$message.success("密码修改成功，请重新登录")
          this.LogOut()
        }else {
          this.$message.error(res.msg)
        }
      })
    },
    LogOut(){
      sessionStorage.clear();
      this.$router.replace("/")
    },
    VerifyPas() {
      if(this.form.originPass === ""){
        this.$message.error("请先输入原密码")
        return;
      }else {
        // 对新密码进行SHA-256加密
        let requestBody = {
          username: this.user,
          password: sha256(this.form.originPass).toString()
        };
        postRequest(`/user/VerifyPas`,requestBody
        ).then(res => {
          if (res.data === false) {
            this.$message.error("原密码输入错误，请重新输入")
          }
        })
      }

    },

    compare(){
      if(this.form.newPass !== this.form.confirmNewPass){
        this.$message.error("两次输入的新密码不一致，请重新输入")
      }
      return
    }
  }
}
</script>

<style scoped>

</style>