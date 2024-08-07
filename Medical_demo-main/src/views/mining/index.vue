<template>
  <div class="app-container">
    <el-header>
      <h3>任务设置</h3>
      <el-divider></el-divider>
    </el-header>
    <el-steps
        :active="active"
        style="margin-top: 20px"
        align-center
    >
      <el-step
          title="任务信息"
          icon="el-icon-guide"
          description="填写任务的一些基本信息"
      ></el-step>
      <el-step
          title="数据选择"
          icon="el-icon-document"
          description="选择用于关联挖掘的数据集"
      ></el-step>
      <el-step
          title="病种选择"
          icon="el-icon-share"
          description="选择用于关联挖掘的多种疾病"
      ></el-step>
      <el-step
          title="危险因素选择"
          icon="el-icon-menu"
          description="选择用于关联挖掘的多种危险因素"
      ></el-step>
      <el-step
          title="算法选择"
          icon="el-icon-search"
          description="选择用于关联挖掘的算法"
      ></el-step>
    </el-steps>
    <div v-if="active === 0">
      <!-- <el-container id="maintest"> -->
      <div id="mainform">
        <el-card class="box-card" style="width: 1000px;margin-top: 50px">
          <div slot="header" class="clearfix">
            <span>任务信息</span>
          </div>
          <div>
            <el-form
                ref="form"
                :model="form"
                label-width="100px"
                class="form"
                label-position="top"
            >
              <el-form-item class="inputBox shortItem" required>
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>任务名称</span>
                </template>
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item class="inputBox shortItem" required>
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>任务负责人</span>
                </template>
                <el-input v-model="principal" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item class="inputBox shortItem" required>
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>任务类型</span>
                </template>
                <el-select v-model="form.type" placeholder="请选择任务类型" @change="getAlgorithm(form.type)">
                  <el-tooltip class="item" effect="light" content="挖掘疾病之间的关联关系" placement="right">
                    <el-option
                        label="疾病关联挖掘"
                        value="disease_mining"
                    ></el-option>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="挖掘危险因素之间的关联关系" placement="right">
                    <el-option label="危险因素关联挖掘" value="factor_mining"></el-option>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" content="挖掘疾病和危险因素之间的关联关系" placement="right">
                    <el-option
                        label="疾病-危险因素关联挖掘"
                        value="disease_factor_mining"
                    ></el-option>
                  </el-tooltip>
                </el-select>
              </el-form-item>
              <el-form-item class="inputBox shortItem" required>
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>参与人员</span>
                </template>
                <el-input v-model="participants"></el-input>
              </el-form-item>
              <el-form-item>
                <template slot="label">
                  <span class="lineStyle">▍</span>
                  <span>备注</span>
                </template>
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 7, maxRows: 745    }"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入内容"
                    v-model="form.description"
                ></el-input>
              </el-form-item>

              <el-form-item id="center" style="margin-top: 20px">
                <el-button type="primary" @click="next1()">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
    <div v-if="active === 1">
      <template>
        <div style="margin-top: 25px">
          <div class="content">
            <div class="left_tree">
              <div class="tipInfo">
                <h3>可选数据</h3>
                <div>
                  <div style="margin-top: 5px">
                    <i class="el-icon-s-order"></i>
                    <span class="statistic">多病种知识库: {{ number1 }}</span>
                  </div>
                  <div style="margin-top: 10px">
                    <i class="el-icon-share"></i>
                    <span class="statistic">私有数据集: {{ number2 }}</span>
                  </div>
                </div>
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
            <div class="right_table">
              <el-card class="right_table_topCard">
                <div id="center"  style="height: 50px; padding-left: 5px">
                  <h3 style="margin-top:-20px">数据预览</h3>
                </div>
                <div class="describe_content">
                  <p>
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
                    <i class="el-icon-folder-opened"></i> 所属类别:<span>{{ showDataForm.classPath }}</span>
                  </p>
                </div>

                <!-- 显示表数据 -->
                <el-table :data="tableData" stripe style="width: 100%" max-height="700"
                          v-if="tableData.length > 0" :header-cell-style="{ background: '#eee', color: '#606266' }"
                          ref="scrollTable">
                  <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" width="200">
                    <template slot-scope="{ row }">
                      <div class="truncate-text">{{ row[key] }}</div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </div>
        </div>
      </template>
      <div class="buttonGroup" id="center">
        <el-button @click="prev" round>上一步</el-button>
        <el-button type=primary @click="next2" round>下一步</el-button>
      </div>
    </div>
    <div v-if="active === 2">
      <template>
        <div style="margin-top: 25px">
          <div class="select_feature_var_top">
            <h3 style="margin-left: 7%">病种选择</h3>
            <div class="searchButton">
              <el-input style="width:200px"  v-model="disease_input" placeholder="请输入搜索病种名称" clearable></el-input>
              <el-button icon="el-icon-search" circle size="mini" type="success" style="margin-left: 5px" @click="search_disease"></el-button>
            </div>
          </div>
          <el-form ref="form" :model="form" label-width="120px" v-loading="listLoading">
            <el-collapse
                v-model="activeNames"
                @change="handleChange"
                style="margin-left: 5%; margin-top: 20px"
                class="diseaseSelect"
            >
              <el-collapse-item name="1" class="el-collapse-item">
                <template slot="title">
                  <span class="diseaseSelectSpan">心脑血管疾病</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateDisease1"
                    v-model="diseaseCheckAll1"
                    @change="handleCheckDiseaseAllChange1"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="diseaseShow.cardiovascular_cerebrovascular"
                    @change="handleCheckedDiseasesChange1"
                >
                  <el-checkbox
                      v-for="d in diseasesShow.cardiovascular_cerebrovascular"
                      :label="d"
                      :key="d"
                  >{{ d }}</el-checkbox
                  >
                </el-checkbox-group>
                <!--            <el-form-item label="卒中相关">-->
                <!--              <el-checkbox-group v-model="cuzhong1">-->
                <!--                <el-checkbox label="垂体卒中"></el-checkbox>-->
                <!--              </el-checkbox-group>-->
                <!--            </el-form-item>-->
                <!--            <el-form-item label="冠心病相关">-->
                <!--              <el-checkbox-group v-model="guanxinbing1">-->
                <!--                <el-checkbox label="心绞痛"></el-checkbox>-->
                <!--                <el-checkbox label="冠心病"></el-checkbox>-->
                <!--                <el-checkbox label="稳定型心绞痛"></el-checkbox>-->
                <!--                <el-checkbox label="老年人稳定型心绞痛"></el-checkbox>-->
                <!--              </el-checkbox-group>-->
                <!--            </el-form-item>-->
                <!--            <el-form-item label="高血压相关">-->
                <!--              <el-checkbox-group v-model="gaoxueya1">-->
                <!--                <el-checkbox label="高血压脑出血"></el-checkbox>-->
                <!--              </el-checkbox-group>-->
                <!--            </el-form-item>-->
              </el-collapse-item>
              <el-collapse-item title="代谢系统疾病" name="2" class="el-collapse-item">
                <template slot="title">
                  <span class="diseaseSelectSpan">代谢系统疾病</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateDisease2"
                    v-model="diseaseCheckAll2"
                    @change="handleCheckDiseaseAllChange2"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="diseaseShow.metabolic_system"
                    @change="handleCheckedDiseasesChange2"
                >
                  <el-checkbox
                      v-for="d in diseasesShow.metabolic_system"
                      :label="d"
                      :key="d"
                  >{{ d }}</el-checkbox
                  >
                </el-checkbox-group>
                <!--            <el-form-item label="糖尿病相关">-->
                <!--              <el-checkbox-group v-model="tangniaobing1">-->
                <!--                <el-checkbox label="肾性糖尿"></el-checkbox>-->
                <!--                <el-checkbox label="糖尿病"></el-checkbox>-->
                <!--              </el-checkbox-group>-->
                <!--            </el-form-item>-->
                <!--            <el-form-item label="血脂异常相关">-->
                <!--              <el-checkbox-group v-model="xuezhiyichang1">-->
                <!--                <el-checkbox label="家族性混合型高脂血症"></el-checkbox>-->
                <!--              </el-checkbox-group>-->
                <!--            </el-form-item>-->
              </el-collapse-item>
              <el-collapse-item title="恶性肿瘤" name="3" class="el-collapse-item">
                <template slot="title">
                  <span class="diseaseSelectSpan">恶性肿瘤</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateDisease3"
                    v-model="diseaseCheckAll3"
                    @change="handleCheckDiseaseAllChange3"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="diseaseShow.cancer"
                    @change="handleCheckedDiseasesChange3"
                >
                  <el-checkbox
                      v-for="d in diseasesShow.cancer"
                      :label="d"
                      :key="d"
                  >{{ d }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-collapse-item>
              <el-collapse-item title="精神疾病" name="4" class="el-collapse-item">
                <template slot="title">
                  <span class="diseaseSelectSpan">精神疾病</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateDisease4"
                    v-model="diseaseCheckAll4"
                    @change="handleCheckDiseaseAllChange4"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="diseaseShow.mental_disorder"
                    @change="handleCheckedDiseasesChange4"
                >
                  <el-checkbox
                      v-for="d in diseasesShow.mental_disorder"
                      :label="d"
                      :key="d"
                  >{{ d }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-collapse-item>
              <el-collapse-item title="呼吸系统疾病" name="5" class="el-collapse-item">
                <template slot="title">
                  <span class="diseaseSelectSpan">呼吸系统疾病</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateDisease5"
                    v-model="diseaseCheckAll5"
                    @change="handleCheckDiseaseAllChange5"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="diseaseShow.respiratory_system"
                    @change="handleCheckedDiseasesChange5"
                >
                  <el-checkbox
                      v-for="d in diseasesShow.respiratory_system"
                      :label="d"
                      :key="d"
                  >{{ d }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-collapse-item>
              <el-collapse-item title="其他疾病" name="6" class="el-collapse-item">
                <template slot="title">
                  <span class="diseaseSelectSpan">其他疾病</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateDisease6"
                    v-model="diseaseCheckAll6"
                    @change="handleCheckDiseaseAllChange6"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="diseaseShow.others"
                    @change="handleCheckedDiseasesChange6"
                >
                  <el-checkbox
                      v-for="d in diseasesShow.others"
                      :label="d"
                      :key="d"
                  >{{ d }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </el-form>
          <div class="buttonGroup" id="center">
            <el-button @click="prev" round>上一步</el-button>
            <el-button type="danger" @click="clear_disease">重置选项</el-button>
            <el-button type="primary" @click="next3" round>下一步</el-button>
          </div>
        </div>
      </template>
    </div>
    <div v-if="active == 3">
      <template>
        <div style="margin-top: 25px">
          <div class="select_feature_var_top">
            <h3 style="margin-left: 7%">危险因素选择</h3>
            <div class="searchButton">
              <el-input style="width:200px"  v-model="factor_input" placeholder="请输入要搜索危险因素的名称"  clearable></el-input>
              <el-button icon="el-icon-search" circle size="mini" type="success" style="margin-left: 5px" @click="search_factor"></el-button>
            </div>
          </div>
          <el-form ref="form" :model="form" label-width="120px">
            <el-collapse
                v-model="activeNames1"
                @change="handleChange1"
                style="margin-left: 5%; margin-top: 20px"
                class="factorSelect"
            >
              <el-collapse-item name="1" class="el-collapse-item">
                <template slot="title">
                  <span class="factorSelectSpan">头颈</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateFactor1"
                    v-model="factorCheckAll1"
                    @change="handleCheckFactorAllChange1"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="factorShow.head"
                    @change="handleCheckedFactorsChange1"
                >
                  <el-checkbox v-for="f in factorsShow.head" :label="f" :key="f">{{
                      f
                    }}</el-checkbox>
                </el-checkbox-group>
              </el-collapse-item>
              <el-collapse-item name="2" class="el-collapse-item">
                <template slot="title">
                  <span class="factorSelectSpan">胸背</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateFactor2"
                    v-model="factorCheckAll2"
                    @change="handleCheckFactorAllChange2"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="factorShow.thoracodorsal"
                    @change="handleCheckedFactorsChange2"
                >
                  <el-checkbox
                      v-for="f in factorsShow.thoracodorsal"
                      :label="f"
                      :key="f"
                  >{{ f }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-collapse-item>
              <el-collapse-item name="3" class="el-collapse-item">
                <template slot="title">
                  <span class="factorSelectSpan">腹部</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateFactor3"
                    v-model="factorCheckAll3"
                    @change="handleCheckFactorAllChange3"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="factorShow.belly"
                    @change="handleCheckedFactorsChange3"
                >
                  <el-checkbox v-for="f in factorsShow.belly" :label="f" :key="f">{{
                      f
                    }}</el-checkbox>
                </el-checkbox-group>
              </el-collapse-item>
              <el-collapse-item name="4" class="el-collapse-item">
                <template slot="title">
                  <span class="factorSelectSpan">四肢</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateFactor4"
                    v-model="factorCheckAll4"
                    @change="handleCheckFactorAllChange4"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="factorShow.limb"
                    @change="handleCheckedFactorsChange4"
                >
                  <el-checkbox v-for="f in factorsShow.limb" :label="f" :key="f">{{
                      f
                    }}</el-checkbox>
                </el-checkbox-group>
              </el-collapse-item>
              <el-collapse-item name="5" class="el-collapse-item">
                <template slot="title">
                  <span class="factorSelectSpan">其他</span>
                </template>
                <el-checkbox
                    :indeterminate="isIndeterminateFactor5"
                    v-model="factorCheckAll5"
                    @change="handleCheckFactorAllChange5"
                >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox-group
                    v-model="factorShow.others"
                    @change="handleCheckedFactorsChange5"
                >
                  <el-checkbox
                      v-for="f in factorsShow.others"
                      :label="f"
                      :key="f"
                  >{{ f }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </el-form>
          <div class="buttonGroup" id="center">
            <el-button @click="prev" round>上一步</el-button>
            <el-button type="danger" @click="clear_factor">重置选项</el-button>
            <el-button type="primary" @click="next4" round>下一步</el-button>
          </div>
        </div>
      </template>
    </div>
    <div v-if="active === 4">
      <template>
        <div style="margin-top: 25px">
          <div class="titleBox1">
            <p>
            <strong>可选择的算法</strong>
            </p>
          </div>
          <el-container>
            <el-tabs id="modelList" tab-position="left" @tab-click="onTabClick">
              <el-tab-pane v-for="item in algorithmOptions" :key="item.value" :label="item.label" :value="item.value" >
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span class="titleBox">{{item.label}}</span>
                  </div>
                  <div class="introBox">
                    <p>算法介绍：</p>
                    <p>
                      {{item.algorithmDescription}}
                    </p>
                  </div>
                  <div class="introBox">
                    <p>功能介绍：</p>
                    <p>
                      {{item.functionality}}
                    </p>
                  </div>
                  <div class="introBox">
                    <p>算法原理：</p>
                    <p>
                      {{item.principle}}
                    </p>
                  </div>
                  <div class="introBox">
                    <p>使用场景：</p>
                    <p>
                      {{item.useCase}}
                    </p>
                  </div>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </el-container>
          <div class="buttonGroup" id="center">
            <el-button @click="prev" round>上一步</el-button>
            <el-button type="success" @click="submitForm" round>提交</el-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script>
import { getRequest, postRequest } from "@/utils/api";
import {getTableData} from "@/api/tableDescribe";
// import algorithmSelect from "@/components/tab/subcomponents/AlgorithmSelect.vue";

export default {

  data() {
    return {
      allColumns:[],
      principal:'',
      participants:'',
      tableData1: [
        {
          id:1,
          name:'sdf',
          tasktype:'ss',
          algorithmDescription:'ll',
          deployFilePath:null
        }
      ],
      color: 'red',
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
      number1:1,
      number2:0,
      nowTableName:'knowledgebase',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      showDataForm: {
        tableName:'knowledgebase',
        createUser:'admin',
        createTime:'2024-04-01',
        classPath:'多病种知识库',
        sampleNum:'50',
      },
      tableData: [],
      treeData1:[],
      active: 0,//步骤条初始化
      form: {
        id: null,
        name: '多病种关联关系挖掘',
        creator: null,
        type: null,
        description: null,
        disease: null,
        factor: null,
        tableName: null,
        algorithmName: '',
      },
      diseaseCheckAll1: false,
      diseaseCheckAll2: false,
      diseaseCheckAll3: false,
      diseaseCheckAll4: false,
      diseaseCheckAll5: false,
      diseaseCheckAll6: false,
      factorCheckAll1: false,
      factorCheckAll2: false,
      factorCheckAll3: false,
      factorCheckAll4: false,
      factorCheckAll5: false,
      disease: [],
      diseaseShow: {
        cardiovascular_cerebrovascular: [],
        metabolic_system: [],
        cancer: [],
        mental_disorder: [],
        respiratory_system: [],
        others: []
      },
      diseases: [],
      diseasesShow: {
        cardiovascular_cerebrovascular: [],
        metabolic_system: [],
        cancer: [],
        mental_disorder: [],
        respiratory_system: [],
        others: []
      },

      // cuzhong: ["垂体卒中"],
      // cuzhong1: [],
      // guanxinbing: ["心绞痛", "冠心病", "稳定型心绞痛", "老年人稳定型心绞痛"],
      // guanxinbing1: [],
      // gaoxueya: ["高血压脑出血"],
      // gaoxueya1: [],
      // tangniaobing: ["肾性糖尿", "糖尿病"],
      // tangniaobing1: [],
      // xuezhiyichang1: [],
      // feiai: ["肺癌肝转移"],
      // feiai1: [],
      // ganai: ["肝血管肉瘤"],
      // ganai1: [],
      // yixianai: ["胰岛素瘤"],
      // yixianai1: [],
      // jiezhichangai: ["结肠癌"],
      // jiezhichangai1: [],
      // gongjingai: ["子宫颈残端癌"],
      // gongjingai1: [],
      // shenjingxitongzhongliu: ["咽部神经鞘膜瘤", "植物神经系统肿瘤", "眼眶神经鞘瘤"],
      // shenjingxitongzhongliu1: [],
      // aerzihaimozheng: ["老年人血管性痴呆"],
      // aerzihaimozheng1: [],
      // diedao: ["桡骨骨折"],
      // diedao1: [],

      factor: [],
      factorShow: {
        head: [],
        thoracodorsal: [],
        belly: [],
        limb: [],
        others: []
      },
      factors: [],
      factorsShow: {
        head: [],
        thoracodorsal: [],
        belly: [],
        limb: [],
        others: []
      },
      disease_input: "",
      factor_input: "",
      judge1:false,
      judge2:false,
      judge3:false,
      judge4:false,
      association: [],
      isIndeterminateDisease1: true,
      isIndeterminateDisease2: true,
      isIndeterminateDisease3: true,
      isIndeterminateDisease4: true,
      isIndeterminateDisease5: true,
      isIndeterminateDisease6: true,
      isIndeterminateFactor1: true,
      isIndeterminateFactor2: true,
      isIndeterminateFactor3: true,
      isIndeterminateFactor4: true,
      isIndeterminateFactor5: true,
      activeNames: "1",
      activeNames1: "1",
      algorithmOptions: [],
      listLoading: true,
      flag: 0,
      tablename:'',
    };
  },
  created() {
    this.principal = sessionStorage.getItem("username");
    this.participants = sessionStorage.getItem("username");
    this.init()
    this.getStartData()
    this.searchAll()
  },

  methods: {
    init(){
      console.log("表格")
      console.log(this.$route.query.form)
      if(this.$route.query.form){
        this.active = 4
        this.form = this.$route.query.form
        this.tablename = this.$route.query.form.tableName
        this.diseaseShow = this.$route.query.diseaseShow
        this.diseasesShow = this.$route.query.diseasesShow
        this.factorShow = this.$route.query.factorShow
        this.factorsShow = this.$route.query.factorsShow
        this.diseases = this.$route.query.diseases
        this.factors = this.$route.query.factors
        this.association = this.$route.query.associations
        this.flag = this.$route.query.flag
        this.getAlgorithm(this.form.type)
      }
      console.log(this.active)
      console.log("form:")
      console.log(this.form)
      // this.form = this.$route.query.form
    },
    onTabClick(item) {
      console.log(item.label)
      this.form.algorithmName = item.label
      console.log(this.form.algorithmName)
    },
    searchAll () {
      this.listLoading = true
      postRequest('algorithm/getAll',{}).then(
          (response)=>{
            console.log('1',response)
            this.tableData1=response
            this.listLoading=false
          }
      );
    },
    search_disease(){
      console.log(this.disease_input)
      console.log("======================================================")
      console.log(this.diseasesShow)
      let target = 0
      for(let i=0; i < this.diseasesShow.cardiovascular_cerebrovascular.length; i++){
        console.log(this.diseasesShow.cardiovascular_cerebrovascular[i])
        if(this.disease_input === this.diseasesShow.cardiovascular_cerebrovascular[i]){
          console.log("该病的名字为：", this.diseasesShow.cardiovascular_cerebrovascular[i])
          this.activeNames = "1"
          this.diseaseShow.cardiovascular_cerebrovascular.push(this.diseasesShow.cardiovascular_cerebrovascular[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.diseasesShow.metabolic_system.length; i++){
        console.log(this.diseasesShow.metabolic_system[i])
        if(this.disease_input === this.diseasesShow.metabolic_system[i]){
          console.log("该病的名字为：", this.diseasesShow.metabolic_system[i])
          this.activeNames = "2"
          this.diseaseShow.metabolic_system.push(this.diseasesShow.metabolic_system[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.diseasesShow.cancer.length; i++){
        console.log(this.diseasesShow.cancer[i])
        if(this.disease_input === this.diseasesShow.cancer[i]){
          console.log("该病的名字为：", this.diseasesShow.cancer[i])
          this.activeNames = "3"
          this.diseaseShow.cancer.push(this.diseasesShow.cancer[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.diseasesShow.mental_disorder.length; i++){
        console.log(this.diseasesShow.mental_disorder[i])
        if(this.disease_input === this.diseasesShow.mental_disorder[i]){
          console.log("该病的名字为：", this.diseasesShow.mental_disorder[i])
          this.activeNames = "4"
          this.diseaseShow.mental_disorder.push(this.diseasesShow.mental_disorder[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.diseasesShow.respiratory_system.length; i++){
        console.log(this.diseasesShow.respiratory_system[i])
        if(this.disease_input === this.diseasesShow.respiratory_system[i]){
          console.log("该病的名字为：", this.diseasesShow.respiratory_system[i])
          this.activeNames = "5"
          this.diseaseShow.respiratory_system.push(this.diseasesShow.respiratory_system[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.diseasesShow.others.length; i++){
        console.log(this.diseasesShow.others[i])
        if(this.disease_input === this.diseasesShow.others[i]){
          console.log("该病的名字为：", this.diseasesShow.others[i])
          this.activeNames = "6"
          this.diseaseShow.others.push(this.diseasesShow.others[i])
          target = 1
          break
        }
      }
      if(target === 0){
        this.$message.error("查无此病！")
      }
    },
    search_factor(){
      console.log(this.factor_input)
      console.log("======================================================")
      console.log(this.factorsShow)
      let target = 0
      for(let i=0; i < this.factorsShow.head.length; i++){
        console.log(this.factorsShow.head[i])
        if(this.factor_input === this.factorsShow.head[i]){
          console.log("该危险因素的名字为：", this.factorsShow.head[i])
          this.activeNames1 = "1"
          this.factorShow.head.push(this.factorsShow.head[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.factorsShow.thoracodorsal.length; i++){
        console.log(this.factorsShow.thoracodorsal[i])
        if(this.factor_input === this.factorsShow.thoracodorsal[i]){
          console.log("该危险因素的名字为：", this.factorsShow.thoracodorsal[i])
          this.activeNames1 = "2"
          this.factorShow.thoracodorsal.push(this.factorsShow.thoracodorsal[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.factorsShow.belly.length; i++){
        console.log(this.factorsShow.belly[i])
        if(this.factor_input === this.factorsShow.belly[i]){
          console.log("该危险因素的名字为：", this.factorsShow.belly[i])
          this.activeNames1 = "3"
          this.factorShow.belly.push(this.factorsShow.belly[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.factorsShow.limb.length; i++){
        console.log(this.factorsShow.limb[i])
        if(this.factor_input === this.factorsShow.limb[i]){
          console.log("该危险因素的名字为：", this.factorsShow.limb[i])
          this.activeNames1 = "4"
          this.factorShow.limb.push(this.factorsShow.limb[i])
          target = 1
          break
        }
      }
      for(let i=0; i < this.factorsShow.others.length; i++){
        console.log(this.factorsShow.others[i])
        if(this.factor_input === this.factorsShow.others[i]){
          console.log("该危险因素的名字为：", this.factorsShow.others[i])
          this.activeNames1 = "5"
          this.factorShow.others.push(this.factorsShow.others[i])
          target = 1
          break
        }
      }
      if(target === 0){
        this.$message.error("查无此危险因素！")
      }
    },
    clear_disease(){
      this.diseaseShow.cardiovascular_cerebrovascular = []
      this.diseaseShow.metabolic_system = []
      this.diseaseShow.cancer = []
      this.diseaseShow.others = []
      this.diseaseShow.mental_disorder = []
      this.diseaseShow.respiratory_system = []
      this.diseaseCheckAll1 = false
      this.diseaseCheckAll2 = false
      this.diseaseCheckAll3 = false
      this.diseaseCheckAll4 = false
      this.diseaseCheckAll5 = false
      this.diseaseCheckAll6 = false
      this.isIndeterminateDisease1 = false;
      this.isIndeterminateDisease2 = false;
      this.isIndeterminateDisease3 = false;
      this.isIndeterminateDisease4 = false;
      this.isIndeterminateDisease5 = false;
      this.isIndeterminateDisease6 = false;
    },
    clear_factor(){
      this.factorShow.head = []
      this.factorShow.belly = []
      this.factorShow.limb = []
      this.factorShow.others = []
      this.factorShow.thoracodorsal = []
      this.factorCheckAll1 = false
      this.factorCheckAll2 = false
      this.factorCheckAll3 = false
      this.factorCheckAll4 = false
      this.factorCheckAll5 = false
    },
    getTreeData1(){
      postRequest('/tables/getAll', {}).then(response=>{
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
    handleChange(val) {
      console.log(val);
    },
    handleChange1(val) {
      console.log(val);
    },
    //下一页
    next1() {
      console.log("========================", this.form.name)
      this.judge1 = this.form['name'] === '' || this.form['type']===null  ||  this.participants===''
      if(!this.judge1){
        if (this.active++ > 5) this.active = 0;
        if(this.active === 2) {
          this.form.tableName = this.nowTableName
          this.getDiseaseAndFactor()
        }
        if (this.active === 3) {
          this.setFactorShow()
        }
      }else{
        if(this.form['name']===''){
          this.$message.error("请填写任务名称")
        }
        else if(this.form['type']===null){
          this.$message.error("请填写任务类型")
        }
        else if(this.participants===''){
          this.$message.error("请填写参与人员信息")
        }
      }

    },

    next2() {
      if (this.active++ > 5) this.active = 0;
      if(this.active == 2) {
        this.form.tableName = this.nowTableName
        this.getDiseaseAndFactor()
      }
      if (this.active == 3) {
        this.setFactorShow()
      }
    },
    next3() {
      let d = [].concat(this.diseaseShow.cardiovascular_cerebrovascular,this.diseaseShow.metabolic_system, this.diseaseShow.cancer, this.diseaseShow.mental_disorder, this.diseaseShow.respiratory_system, this.diseaseShow.others)
      this.form.disease = d.toString()
      this.judge3 = false
      this.judge3 = this.form['disease'] === ''
      console.log('=====================================judge3')
      console.log(this.judge3)
      if(!this.judge3){
        if (this.active++ > 5) this.active = 0;
        if(this.active === 2) {
          this.form.tableName = this.nowTableName
          this.getDiseaseAndFactor()
        }
        if (this.active === 3) {
          this.setFactorShow()
        }
      }else{
        if(this.form['disease']===''){
          this.$message.error("请选择至少一种疾病！")
        }
      }
    },
    next4(){
      let f = [].concat(this.factorShow.head, this.factorShow.thoracodorsal, this.factorShow.belly, this.factorShow.limb, this.factorShow.others)
      this.form.factor = f.toString()
      this.judge4 = false
      this.judge4 = this.form['factor'] === ''
      console.log('=====================================judge4')
      console.log(this.judge4)
      if(!this.judge4){
        if (this.active++ > 5) this.active = 0;
        if(this.active === 2) {
          this.form.tableName = this.nowTableName
          this.getDiseaseAndFactor()
        }
        if (this.active === 3) {
          this.setFactorShow()
        }
      }else{
        if(this.form['factor']===''){
          this.$message.error("请选择至少一种危险因素！")
        }
      }
    },

    //上一页
    prev() {
      if (this.active > 0) this.active--;
      // if(this.active === 2) {
      //   this.getDiseaseAndFactor()
      // }
      // if (this.active === 3) {
      //   this.setFactorShow()
      // }
    },
    handleCheckDiseaseAllChange1(val) {
      this.diseaseShow.cardiovascular_cerebrovascular = val ? this.diseasesShow.cardiovascular_cerebrovascular : [];
      this.isIndeterminateDisease1 = false;
    },
    handleCheckDiseaseAllChange2(val) {
      this.diseaseShow.metabolic_system = val ? this.diseasesShow.metabolic_system : [];
      this.isIndeterminateDisease2 = false;
    },
    handleCheckDiseaseAllChange3(val) {
      this.diseaseShow.cancer = val ? this.diseasesShow.cancer : [];
      this.isIndeterminateDisease3 = false;
    },
    handleCheckDiseaseAllChange4(val) {
      this.diseaseShow.mental_disorder = val ? this.diseasesShow.mental_disorder : [];
      this.isIndeterminateDisease4 = false;
    },
    handleCheckDiseaseAllChange5(val) {
      this.diseaseShow.respiratory_system = val ? this.diseasesShow.respiratory_system : [];
      this.isIndeterminateDisease5 = false;
    },
    handleCheckDiseaseAllChange6(val) {
      this.diseaseShow.others = val ? this.diseasesShow.others : [];
      this.isIndeterminateDisease6 = false;
    },
    handleCheckFactorAllChange1(val) {
      this.factorShow.head = val ? this.factorsShow.head : [];
      this.isIndeterminateFactor1 = false;
    },
    handleCheckFactorAllChange2(val) {
      this.factorShow.thoracodorsal = val ? this.factorsShow.thoracodorsal : [];
      this.isIndeterminateFactor2 = false;
    },
    handleCheckFactorAllChange3(val) {
      this.factorShow.belly = val ? this.factorsShow.belly : [];
      this.isIndeterminateFactor3 = false;
    },
    handleCheckFactorAllChange4(val) {
      this.factorShow.limb = val ? this.factorsShow.limb : [];
      this.isIndeterminateFactor4 = false;
    },
    handleCheckFactorAllChange5(val) {
      this.factorShow.others = val ? this.factorsShow.others : [];
      this.isIndeterminateFactor5 = false;
    },
    handleCheckedDiseasesChange1(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.diseasesShow.cardiovascular_cerebrovascular.length;
      this.isIndeterminateDisease1 = checkedCount > 0 && checkedCount < this.diseasesShow.cardiovascular_cerebrovascular.length;
    },
    handleCheckedDiseasesChange2(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.diseasesShow.metabolic_system.length;
      this.isIndeterminateDisease2 = checkedCount > 0 && checkedCount < this.diseasesShow.metabolic_system.length;
    },
    handleCheckedDiseasesChange3(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.diseasesShow.cancer.length;
      this.isIndeterminateDisease3 = checkedCount > 0 && checkedCount < this.diseasesShow.cancer.length;
    },
    handleCheckedDiseasesChange4(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.diseasesShow.mental_disorder.length;
      this.isIndeterminateDisease4 = checkedCount > 0 && checkedCount < this.diseasesShow.mental_disorder.length;
    },
    handleCheckedDiseasesChange5(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.diseasesShow.respiratory_system.length;
      this.isIndeterminateDisease5 = checkedCount > 0 && checkedCount < this.diseasesShow.respiratory_system.length;
    },
    handleCheckedDiseasesChange6(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.diseasesShow.others.length;
      this.isIndeterminateDisease6 = checkedCount > 0 && checkedCount < this.diseasesShow.others.length;
    },
    handleCheckedFactorsChange1(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.factorsShow.head.length;
      this.isIndeterminateFactor1 = checkedCount > 0 && checkedCount < this.factorsShow.head.length;
    },
    handleCheckedFactorsChange2(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.factorsShow.thoracodorsal.length;
      this.isIndeterminateFactor2 = checkedCount > 0 && checkedCount < this.factorsShow.thoracodorsal.length;
    },
    handleCheckedFactorsChange3(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.factorsShow.belly.length;
      this.isIndeterminateFactor3 = checkedCount > 0 && checkedCount < this.factorsShow.belly.length;
    },
    handleCheckedFactorsChange4(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.factorsShow.limb.length;
      this.isIndeterminateFactor4 = checkedCount > 0 && checkedCount < this.factorsShow.limb.length;
    },
    handleCheckedFactorsChange5(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.factorsShow.others.length;
      this.isIndeterminateFactor5 = checkedCount > 0 && checkedCount < this.factorsShow.others.length;
    },
    getDiseaseAndFactor() {
      if(this.form.tableName !== this.tablename){
        console.log(this.flag)
        console.log(this.form.tableName)
        console.log(this.tablename)
        console.log("执行")
        this.listLoading=true
        console.log(this.form.tableName)
        // getRequest("mining/getDisease/" + this.form.tableName).then
        getRequest("mining/getDiseaseFactorAssociation/" + this.form.tableName).then(
            (response) => {
              this.diseases = response.diseases
              this.factors = response.factors
              this.association = response.associations
              var dis = { cardiovascular_cerebrovascular: [], metabolic_system: [], cancer: [], mental_disorder: [], respiratory_system: [], others: [] }
              for (var i = 0; i < this.diseases.length; i++) {
                if (this.diseases[i].category == "cardiovascular_cerebrovascular") {
                  // if (response[i].category2 != "卒中" && response[i].category2 != "冠心病" && response[i].category2 != "高血压") {
                  //   dis.cardiovascular_cerebrovascular.push(response[i].name)
                  // }
                  dis.cardiovascular_cerebrovascular.push(this.diseases[i].name)
                } else if (this.diseases[i].category == "metabolic_system") {
                  // if (response[i].category2 != "糖尿病" && response[i].category2 != "血脂异常") {
                  //   dis.metabolic_system.push(response[i].name)
                  // }
                  dis.metabolic_system.push(this.diseases[i].name)
                } else if (this.diseases[i].category == "cancer") {
                  // if (response[i].category2 != "肺癌" && response[i].category2 != "肝癌" && response[i].category2 != "胰腺癌" && response[i].category2 != "结直肠癌" && response[i].category2 != "宫颈癌" && response[i].category2 != "神经系统肿瘤") {
                  //   dis.cancer.push(response[i].name)
                  // }
                  dis.cancer.push(this.diseases[i].name)
                } else if (this.diseases[i].category == "mental_disorder") {
                  // if (response[i].category2 != "阿尔兹海默症") {
                  //   dis.mental_disorder.push(response[i].name)
                  // }
                  dis.mental_disorder.push(this.diseases[i].name)
                } else if (this.diseases[i].category == "respiratory_system") {
                  dis.respiratory_system.push(this.diseases[i].name)
                } else if (this.diseases[i].category == "others") {
                  // if (response[i].category2 != "跌倒") {
                  //   dis.others.push(response[i].name)
                  // }
                  dis.others.push(this.diseases[i].name)
                }
              }
              this.diseasesShow = dis
              setTimeout(()=>{
                const diseaseTitles = document.querySelectorAll(".diseaseSelectSpan")
                let nums=0;
                for (const key in this.diseasesShow) {
                  if(Object.hasOwnProperty.call(this.diseasesShow,key)){
                    const selectOptionsKey = this.diseasesShow[key]
                    diseaseTitles[nums].style.color = "black"
                    console.log(selectOptionsKey)
                    if(selectOptionsKey.length>0){
                      diseaseTitles[nums].style.color = "red"
                    }
                    nums++
                  }
                }
              },100)
              this.listLoading=false
            }
        )
        this.$forceUpdate()
      }
    },
    setFactorShow(){
      if(this.form.tableName !== this.tablename)
      {
        this.disease = [].concat(this.diseaseShow.cardiovascular_cerebrovascular,this.diseaseShow.metabolic_system,this.diseaseShow.cancer,this.diseaseShow.mental_disorder, this.diseaseShow.respiratory_system,this.diseaseShow.others)

        var facId = []
        var disId = []
        this.factorsShow={ head: [], thoracodorsal: [], belly: [], limb: [], others: [] }
        this.factor = []
        // 获取所有所选疾病id
        // this.disease = [].concat(_this.cuzhong1, _this.guanxinbing1, _this.gaoxueya1, _this.diseaseShow.cardiovascular_cerebrovascular, _this.tangniaobing1, _this.xuezhiyichang1, _this.diseaseShow.metabolic_system, _this.feiai1, _this.ganai1, _this.yixianai1, _this.jiezhichangai1, _this.gongjingai1, _this.shenjingxitongzhongliu1, _this.diseaseShow.cancer, _this.aerzihaimozheng1, _this.diseaseShow.mental_disorder, _this.diseaseShow.respiratory_system, _this.diedao1, _this.diseaseShow.others)

        for (var i in this.disease) {
          for (var p in this.diseases) {
            if (this.diseases[p].name == this.disease[i]) {
              disId.push(this.diseases[p].id)
            }
          }
        }
        // 获取所有关联症状id
        for (var b in disId) {
          for (var a in this.association) {
            if (this.association[a].source == disId[b]) {
              facId.push(this.association[a].target)
            }
          }
        }
        // 用Set去重
        let set = [...new Set(facId)]
        for (var item of set) {
          this.factor.push(this.factors[item-1])
        }

        var fac = { head: [], thoracodorsal: [], belly: [], limb: [], others: [] }
        for (var j = 0; j < this.factor.length; j++) {
          console.log(this.factor[j].category)

          if (this.factor[j].category == "head") {
            fac.head.push(this.factor[j].name)
          } else if (this.factor[j].category == "thoracodorsal") {
            fac.thoracodorsal.push(this.factor[j].name)
          } else if (this.factor[j].category == "belly") {
            fac.belly.push(this.factor[j].name)
          } else if (this.factor[j].category == "limb") {
            fac.limb.push(this.factor[j].name)
          } else if (this.factor[j].category == "others") {
            fac.others.push(this.factor[j].name)
          }
        }
        this.factorsShow = fac
        setTimeout(()=>{
          const factorTitles = document.querySelectorAll(".factorSelectSpan")
          let nums=0;
          for (const key in this.factorsShow) {
            if(Object.hasOwnProperty.call(this.factorsShow,key)){
              const selectOptionsKey = this.factorsShow[key]
              factorTitles[nums].style.color = "black"
              console.log(selectOptionsKey)
              if(selectOptionsKey.length>0){
                factorTitles[nums].style.color = "red"
              }
              nums++
            }
          }
        },100)
      }
    },
    getAlgorithm(type){
      this.form.algorithmName = ''
      let a=''
      if(type==="disease_mining" || type==="factor_mining"){
        a='diseaseOrFactor'
      }else if(type==="disease_factor_mining"){
        a="disease-factor"
      }
      this.algorithmOptions=[]
      getRequest('algorithm/getByType/'+a).then(
          (response)=>{
            console.log("response:")
            console.log(response)
            for(let i=0;i<response.length;i++){
              let a = response[i].algorithmName
              if(i===0){
                this.form.algorithmName = response[i].algorithmName
                console.log("打印：",this.form.algorithmName)
              }
              this.algorithmOptions.push({'value':a.valueOf(),'label':a, 'algorithmDescription':response[i].algorithmDescription,'functionality':response[i].functionality,'principle':response[i].principle,'useCase':response[i].useCase})
            }
          }
      )
      console.log("=====================algorithmOptions")
      console.log(this.algorithmOptions)
    },
    submitForm() {
      let _this = this
      var d = [].concat(_this.diseaseShow.cardiovascular_cerebrovascular,_this.diseaseShow.metabolic_system, _this.diseaseShow.cancer, _this.diseaseShow.mental_disorder, _this.diseaseShow.respiratory_system, _this.diseaseShow.others)
      this.form.disease = d.toString()
      var f = [].concat(_this.factorShow.head, _this.factorShow.thoracodorsal, _this.factorShow.belly, _this.factorShow.limb, _this.factorShow.others)
      this.form.factor = f.toString()
      this.form.creator = sessionStorage.getItem("username")
      console.log('=====================================')
      console.log(this.form['name'])
      console.log(this.form['type'])
      console.log(this.form['factor'])
      console.log(this.form['algorithmName'])
      console.log(this.form['disease'])
      this.judge = this.form['name'] === null || this.form['type']===null  || this.form['factor']==='' || this.form['algorithmName']===null || this.form['disease']===''
      console.log('=====================================')
      console.log(this.judge)
      if(!this.judge){
        postRequest("mining/insert", this.form).then(
            response => {
              console.log(response)
              if (response === true) {
                _this.$message.success("任务创建成功")
                if (_this.form.type === "disease_mining") {
                  _this.$router.push({ path: '/sideBar/disease/result', query: { form: _this.form ,flag:0, diseasesShow:_this.diseasesShow, factorsShow:_this.factorsShow, diseaseShow:_this.diseaseShow, factorShow:_this.factorShow, diseases:_this.diseases, factors:_this.factors,association:_this.association} })
                }
                else if (_this.form.type === "factor_mining") {
                  _this.$router.push({ path: '/sideBar/factor/result', query: { form: _this.form, flag:0, diseasesShow:_this.diseasesShow, factorsShow:_this.factorsShow, diseaseShow:_this.diseaseShow, factorShow:_this.factorShow } })
                }
                else if (_this.form.type === "disease_factor_mining") {
                  _this.$router.push({ path: '/sideBar/diseaseFactor/result', query: { form: _this.form, flag:0, diseasesShow:_this.diseasesShow, factorsShow:_this.factorsShow, diseaseShow:_this.diseaseShow, factorShow:_this.factorShow } })
                }
              } else {
                _this.$message.error("任务创建失败")
                _this.formLoading = false
              }
            })
      }else{
        if(this.form['disease']===''){
          _this.$message.error("请选择至少一种疾病")
        }
        else if(this.form['factor']===''){
          _this.$message.error("请选择至少一个危险因素")
        }
        else if(this.form['name']===null){
          _this.$message.error("请填写任务名称")
        }
        else if(this.form['type']===null){
          _this.$message.error("请填写任务类型")
        }
        else if(this.form['algorithmName']===null){
          _this.$message.error("请选择算法")
        }
      }
    },
    handleNodeClick(data) {
      let tableName = data.value
      let tableId = '100'
      this.nowTableName = data.value
      if(data.isLeafs) {
        getTableData("/tables/getTableData", tableId, tableName).then(response => {   // 获取表数据
          console.log(response.data)
          this.tableData = response.data;
          console.log("数据长度" + response.data.length)
          this.showDataForm.sampleNum = response.data.length
        })
            .catch(error => {
              console.log(error);
            })
        console.log("树111"+this.treeData1)
        let i;
        for(i=0;i<this.treeData1.length;i++){
          if(this.treeData1[i].name === data.value){
            let path = ''
            if(this.treeData1[i].type===1){
              path = '私有数据集/'
            }
            this.showDataForm.tableName = this.treeData1[i].name
            this.showDataForm.createUser = this.treeData1[i].createUser;
            this.showDataForm.createTime = this.treeData1[i].createTime;
            this.showDataForm.classPath = path + data.label;
          }
        }
      }
    },
    getStartData(){
      this.getTreeData1()
      getTableData("/tables/getTableData", '1', 'knowledgebase').then(response => {
        this.showDataForm.sampleNum = response.data.length// 获取表数据
        console.log(response.data)
        this.tableData = response.data;
        console.log("数据长度" + response.data.length)
        // this.number2 = this.tableData.length
      })
      let i;
      for(i=0;i<this.treeData1.length;i++){
        if(this.treeData1[i].valueName === 'knowledgebase'){
          let path = '私有数据集/'
          this.showDataForm.tableName = this.treeData1[i].valueName
          this.showDataForm.createUser = this.treeData1[i].createUser;
          this.showDataForm.createTime = this.treeData1[i].createTime;
          this.showDataForm.classPath = path + this.treeData1[i].valueName;
        }
      }
    }

  }
}
</script>

<style scoped>
.diseaseSelect .haveData>>> .el-collapse-item__header{
  color: brown;
}
.factorSelect .haveData>>> .el-collapse-item__header{
  color: brown;
}
.select_feature_var_top {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}
.searchButton {
  position: absolute;
  right: 100px;
  width: 300px;
}
#mainform {
  display: flex;
  justify-content: center;
  align-items: center;
}
#center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.right_table {
  display: inline-block;
  width: 85%;
  position: absolute;
  overflow: auto;
  height: 90%;
}
.item {
  margin: 4px;
}
.right_table_topCard {
  padding: 0;
  height: 100%;
  width: 95%;
  position: relative;
  left: 1%;
}
.alChoose {
  display: flex;
  width: 100%;
}

.describe_content {
  display: inline-block;
  width: 100%;
}
.describe_content span {
  margin: 10px;
}
.buttonGroup {

  margin-left: 40%;
  bottom: 30px;
  position: fixed;
  //margin-right: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.left_tree {
  display: inline-block;
  height: 90%;
  width: 15%;
  overflow: auto;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
}
.buttom {
  display: inline-block;
  width: 20%;
  position: relative;
  right: -20%;
  bottom: 10px;
}
.btn1 {
  position: relative;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}

.content {
  position: relative;
  width: 100%;
  height: 790px;
}
.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}
.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 80px;
  text-align: center;
}
.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
}
.form {
  width: 80vh;
  margin: auto;
}
.form .inputBox {
  width: 25%;
}
.form .shortItem {
  display: inline-block;
  margin-right: 12vh;
}
.form .inputBox:last-child {
  width: 50%;
}
.lineStyle {
  color: rgb(100, 172, 231);
}
#modelList {
  width: 100%;
  margin-bottom: 5vh;
  margin-top: 1%;
  margin-left: 1%;
}
.titleBox1 {
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}
.titleBox {
  margin: 10px auto 10px auto;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}
.introBox {
  background-color: #e8f3ff;
  height: 8vh;
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
</style>