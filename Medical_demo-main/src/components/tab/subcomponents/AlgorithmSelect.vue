<template>
  <div v-loading="loading" element-loading-text="拼命运算中">
    <el-container>
      <el-tabs id="modelList" v-model="model" tab-position="left">
        <!-- tab-pane的name值必须与vuex里的算法名字一一对应 -->
        <el-tab-pane
            label="SF-DRMB"
            :disabled="moduleName !== 'disFactor'"
            name="SF_DRMB"
        >
          <div class="titleBox">SF-DRMB</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              SF-DRMB是一种因果特征选择算法，可用于挖掘疾病和危险因素之间存在的因果关系。
            </p>
          </div>
          <div class="paramBox">
            <el-form
                :model="SF_DRMB_form"
                class=""
                label-position="top"
                ref="SF_DRMB_ref"
            >
              <el-form-item prop="K_OR">
                <template slot="label">
                  <span class="paramTitle">K_OR</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_OR参数用于控制恢复假阴性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                        slot="reference"
                        class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_OR"></el-input>
                <span class="valueRange">(取值范围为 0 - 1 )</span>
              </el-form-item>

              <el-form-item prop="K_and_PC">
                <template slot="label">
                  <span class="paramTitle">K_and_PC</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_and_pc参数用于控制剔除父子假阳性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                        slot="reference"
                        class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_PC"></el-input>
                <span class="valueRange">(取值范围为 0.15 - 0.3 )</span>
              </el-form-item>

              <el-form-item prop="K_and_SP">
                <template slot="label">
                  <span class="paramTitle">K_and_SP</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_and_sp参数用于控制剔除配偶假阳性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                        slot="reference"
                        class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_SP"></el-input>
                <span class="valueRange">(取值范围为 0.4 - 0.8 )</span>
              </el-form-item>
            </el-form>
            <div class="buttonBox">
              <el-button round @click="backStep()">上一步</el-button>
              <el-button round @click="resetForm('SF_DRMB_ref')"
              >恢复默认</el-button
              >
              <el-button
                  type="primary"
                  round
                  @click="submit('/runtime_bus/sf_drmb')"
              >提交运算</el-button
              >
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="IAMB" name="IAMB">
          <div class="titleBox">IAMB</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              IAMB是一种因果特征选择算法，可用于挖掘疾病和危险因素之间存在的因果关系。
            </p>
          </div>
          <div class="buttonBox">
            <el-button round @click="backStep()">上一步</el-button>
            <el-button type="primary" round @click="submit('/runtime_bus/iamb')"
            >提交运算</el-button
            >
          </div>
          <div class="paramBox"></div>
        </el-tab-pane>

        <el-tab-pane label="SSP-Tree" :disabled="true">SSP-Tree</el-tab-pane>
        <el-tab-pane label="FP-Growth" :disabled="true">FP-Growth</el-tab-pane>
        <el-tab-pane label="Logistic Regression" :disabled="true"
        >Logistic Regression</el-tab-pane
        >
      </el-tabs>
      <!-- <el-switch v-model="value1">
      </el-switch>
      <el-switch v-model="value2" active-color="#13ce66" inactive-color="#ff4949"
       >
      </el-switch> -->
    </el-container>
  </div>
</template>

<script>
import { postRequest } from "@/api/user";
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "AlgorithmSelect",
  mixins: [resetForm, vuex_mixin],
  props: {
    moduleName: {
      type: String,
      default: "disFactor",
    },
  },
  computed: {},
  data() {
    return {
      model: "",
      loading: false,
      SF_DRMB_form: {
        K_OR: 0,
        K_and_PC: 0,
        K_and_SP: 0,
      },
      res: "",
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.SF_DRMB_form = this.m_SF_DRMB;
      if (this.moduleName === "disFactor") {
        this.model = "SF_DRMB";
      } else {
        this.model = "IAMB";
      }
    },

    backStep() {
      this.m_changeStep(this.m_step - 1);
    },

    submit(url) {
      this.loading = true;
      this.m_SF_DRMB_update(this.SF_DRMB_form);
      let payload = {
        tablename: this.m_dataset,
        targetcolumn: this.m_caculate_target_feature,
        fea: this.m_caculate_use_features,
        K_OR: Number(this.m_SF_DRMB.K_OR),
        K_and_pc: Number(this.m_SF_DRMB.K_and_PC),
        K_and_sp: Number(this.m_SF_DRMB.K_and_SP),
        knowledge: this.m_caculate_known_features,
      };
      postRequest(url, payload)
          .then((res) => {
            console.log("res", res);
            if (isNaN(res.data.ratio)) {
              console.log("ration:");
              res.data.ratio = 0;
              console.log(res.ratio);
            }
            this.m_changeTaskInfo({ algorithm: this.model, result: res.data });
            this.loading = false;
            console.log(this.m_result);
            this.m_changeStep(this.m_step + 1);
          })
          .catch((err) => {
            this.loading = false;
            this.$message({
              showClose: true,
              type: "error",
              message: `发生错误：${err}`,
            });
          });
    },
  },
};
</script>

<style scoped>
#modelList {
  height: 80vh;
  width: 100%;
  margin-bottom: 5vh;
}

.titleBox {
  margin: 10px auto 10px auto;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.introBox {
  background-color: #e8f3ff;
  height: 5vh;
  width: 100%;
  overflow: auto;
}

.introBox p {
  margin-left: 15px;
}

.introBox p:first-child {
  font-size: 18px;
  font-weight: 600;
}

.introBox p:nth-child(2) {
  margin-left: 2em;
}

.paramBox .el-form {
  margin-top: 2vh;
  margin-left: 60vh;
}

.paramBox .el-form .el-input {
  width: 25vh;
  margin-top: -50px;
}

.paramTitle {
  font-size: 20px;
  font-weight: 600;
}

.valueRange {
  color: gray;
  margin-left: 10px;
  margin-bottom: 30px;
}

.el-icon-warning-outline {
  margin-left: 10px;
  font-size: 20px;
}

.el-icon-warning-outline:hover {
  color: #368ce7;
}

.buttonBox {
  width: 35vh;

  margin-right: auto;
  margin-left: auto;
}
</style>
