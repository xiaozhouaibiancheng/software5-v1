<template>
  <div id="container">
    <!-- 上一页、下一页 -->
    <div class="right-btn">
      <!-- 输入页码 -->
      <div class="pageNum">
        <input v-model.number="currentPage"
               type="number"
               class="inputNumber"
               @input="inputEvent()"> / {{pageCount}}
      </div>
      <div @click="changePdfPage('first')"
           class="turn">
        首页
      </div>
      <!-- 在按钮不符合条件时禁用 -->
      <div @click="changePdfPage('pre')"
           class="turn-btn"
           :style="currentPage===1?'cursor: not-allowed;':''">
        上一页
      </div>
      <div @click="changePdfPage('next')"
           class="turn-btn"
           :style="currentPage===pageCount?'cursor: not-allowed;':''">
        下一页
      </div>
      <div @click="changePdfPage('last')"
           class="turn">
        尾页
      </div>
    </div>

    <div class="pdfArea">
      <pdf :src="src"
           ref="pdf"
           v-show="loadedRatio===1"
           :page="currentPage"
           @num-pages="pageCount=$event"
           @progress="loadedRatio = $event"
           @page-loaded="currentPage=$event"
           @loaded="loadPdfHandler"
           @link-clicked="currentPage = $event"
           style="display: inline-block;width:100%"
           id="pdfID"></pdf>
    </div>
    <!-- 加载未完成时，展示进度条组件并计算进度 -->
    <div class="progress"
         v-show="loadedRatio!==1">
      <el-progress type="circle"
                   :width="70"
                   color="#53a7ff"
                   :percentage="Math.floor(loadedRatio * 100)"></el-progress>
      <br>
      <!-- 加载提示语 -->
      <span>{{remindShow}}</span>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  computed: {
  },
  created () {
    this.prohibit()
  },
  destroyed () {
    // 在页面销毁时记得清空 setInterval
    clearInterval(this.intervalID)
  },
  mounted () {
    // 更改 loading 文字
    this.intervalID = setInterval(() => {
      this.remindShow === this.remindText.refresh
          ? this.remindShow = this.remindText.loading
          : this.remindShow = this.remindText.refresh
    }, 4000)
    // 监听滚动条事件
    this.listenerFunction()
  },
  data () {
    return {
      // ----- loading -----
      remindText: {
        loading: '加载文件中，文件较大请耐心等待...',
        refresh: '若卡住不动，可刷新页面重新加载...'
      },
      remindShow: '加载文件中，文件较大请耐心等待...',
      intervalID: '',
      // ----- vuepdf -----
      src: '/operation.pdf',
      // src服务器路径: 'http://.../xxx.pdf'
      // src: "Medical_demo-main/src/assets/operation.pdf",
      // 当前页数
      currentPage: 0,
      // 总页数
      pageCount: 0,
      // 加载进度
      loadedRatio: 0
    }
  },
  methods: {
    // 监听滚动条事件
    listenerFunction (e) {
      document.getElementById('container').addEventListener('scroll', true)
    },
    // 页面回到顶部
    toTop () {
      document.getElementById('container').scrollTop = 0
    },
    // 输入页码时校验
    inputEvent () {
      if (this.currentPage > this.pageCount) {
        // 1. 大于max
        this.currentPage = this.pageCount
      } else if (this.currentPage < 1) {
        // 2. 小于min
        this.currentPage = 1
      }
    },
    // 切换页数
    changePdfPage (val) {
      if (val === 'pre' && this.currentPage > 1) {
        // 切换后页面回到顶部
        this.currentPage--
        this.toTop()
      } else if (val === 'next' && this.currentPage < this.pageCount) {
        this.currentPage++
        this.toTop()
      } else if (val === 'first') {
        this.currentPage = 1
        this.toTop()
      } else if (val === 'last' && this.currentPage < this.pageCount) {
        this.currentPage = this.pageCount
        this.toTop()
      }
    },

    // pdf加载时
    loadPdfHandler (e) {
      // 加载的时候先加载第一页
      this.currentPage = 1
    },

    // 禁用鼠标右击、F12 来禁止打印和打开调试工具
    prohibit () {
      // console.log(document)
      document.oncontextmenu = function () {
        return false
      }
      document.onkeydown = function (e) {
        if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 80 || e.keyCode === 83 || e.keyCode === 85 || e.keyCode === 86 || e.keyCode === 117)) {
          return false
        }
        if (e.keyCode === 18 || e.keyCode === 123) {
          return false
        }
      }
    }
  }
}
</script>

<style scoped>
#container {
  overflow: auto;
  height: 800px;
  font-family: PingFang SC;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  position: relative;
}

/* 右侧功能按钮区 */
.right-btn {
  position: fixed;
  right: 5%;
  bottom: 15%;
  width: 120px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 99;
}

.pdfArea {
  width: 80%;
}

/* ------------------- 输入页码 ------------------- */
.pageNum {
  margin: 10px 0;
  font-size: 18px;
}
/*在谷歌下移除input[number]的上下箭头*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/*在firefox下移除input[number]的上下箭头*/
input[type='number'] {
  -moz-appearance: textfield;
}

.inputNumber {
  border-radius: 8px;
  border: 1px solid #999999;
  height: 35px;
  font-size: 18px;
  width: 60px;
  text-align: center;
}
.inputNumber:focus {
  border: 1px solid #00aeff;
  background-color: rgba(18, 163, 230, 0.096);
  outline: none;
  transition: 0.2s;
}

/* ------------------- 切换页码 ------------------- */
.turn {
  background-color: #888888;
  opacity: 0.7;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}

.turn-btn {
  background-color: #000000;
  opacity: 0.6;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.turn-btn:hover,
.turn:hover {
  transition: 0.3s;
  opacity: 0.5;
  cursor: pointer;
}

/* ------------------- 进度条 ------------------- */
.progress {
  position: absolute;
  right: 50%;
  top: 50%;
  text-align: center;
}
.progress > span {
  color: #199edb;
  font-size: 14px;
}
</style>

