<template>
  <div>
    <el-container>
      <el-header>
        <h3>任务设置</h3>
        <el-divider></el-divider>
      </el-header>
      <div id="step">
        <el-steps :active="step" style="margin-top: 20px"  align-center>
          <el-step title="任务信息" icon="el-icon-guide"></el-step>
          <el-step title="数据选择" icon="el-icon-document"></el-step>
          <el-step title="特征选择" icon="el-icon-share"></el-step>
          <el-step title="算法选择" icon="el-icon-search"></el-step>
          <el-step title="运算结果" icon="el-icon-view"></el-step>
        </el-steps>
      </div>

      <el-main v-if="step === 1" class="mainBox">
        <TaskInfoVue :moduleName="moduleName"></TaskInfoVue>
      </el-main>

      <el-main v-if="step === 2" class="mainBox">
        <DataSelectVue :moduleName="moduleName"></DataSelectVue>
      </el-main>

      <el-main v-if="step === 3" class="mainBox">
        <FeatureSelectVue :moduleName="moduleName"></FeatureSelectVue>
      </el-main>

      <el-main v-if="step === 4" class="mainBox">
        <AlgorithmSelectVue :moduleName="moduleName"></AlgorithmSelectVue>
      </el-main>

      <el-main v-if="step === 5" class="mainBox">
        <ResultVue :moduleName="moduleName"></ResultVue>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AlgorithmSelectVue from "./subcomponents/AlgorithmSelect.vue";
import DataSelectVue from "./subcomponents/DataSelect.vue";
import FeatureSelectVue from "./subcomponents/FeatureSelect.vue";
import ResultVue from "./subcomponents/Result.vue";
import TaskInfoVue from "./subcomponents/TaskInfo.vue";
import vuex_mixin from "@/components/mixins/vuex_mixin";
export default {
  name: "DisFactor",
  components: {
    TaskInfoVue,
    DataSelectVue,
    FeatureSelectVue,
    AlgorithmSelectVue,
    ResultVue,
  },
  mixins: [vuex_mixin],
  computed: {
    ...mapState("disFactor", ["step"]),
  },
  data() {
    return {
      moduleName: "disFactor",
    };
  },
  created() {
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
    this.m_changeTaskInfo(defaultValue);
    this.m_changeStep(1);


  },

  methods: {
  },
};
</script>

<style scoped></style>