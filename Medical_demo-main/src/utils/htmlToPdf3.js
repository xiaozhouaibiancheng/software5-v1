// htmlToPdf.js
// 导出页面为PDF格式
/*
 用法
1. main.js中引入
import htmlToPdf from '@/util/htmlToPdf'
Vue.use(htmlToPdf)

2. vue页面中调用
按钮中方法  @click="getPdf()"
data中声明变量
data() {
	return {
		htmlTitle: "测试导出文件", // 生成pdf的名称
		......
3. 打印内容 id必须为pdfDom
<div id="pdfDom" >
 */
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
    install(Vue, options) {
        Vue.prototype.getPdf3 = function() {
            var title = this.form.name //
            html2Canvas(document.querySelector('#min3'), {
                allowTaint: true,
                taintTest: false,
                useCORS: true,
                // y: 72, // 对Y轴进行裁切
                // width:1200,
                // height:5000,
                dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
                scale: 4 //按比例增加分辨率
            }).then(function(canvas) {
                let contentWidth = canvas.width
                let contentHeight = canvas.height
                let pageHeight = contentWidth / 592.28 * 841.89
                let leftHeight = contentHeight
                let position = 0
                let imgWidth = 595.28
                let imgHeight = 592.28 / contentWidth * contentHeight
                let pageData = canvas.toDataURL('image/jpeg', 1.0)
                let PDF = new JsPDF('', 'pt', 'a4')
                if (leftHeight < pageHeight) {
                    PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
                } else {
                    while (leftHeight > 0) {
                        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight
                        position -= 841.89
                        if (leftHeight > 0) {
                            PDF.addPage()
                        }
                    }
                }
                PDF.save(title + '.pdf')
            })
        }
    }
}


