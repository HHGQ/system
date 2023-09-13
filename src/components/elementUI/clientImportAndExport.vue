<template>
  <div>
    <el-button size="small" type="primary" @click="exportFile1">点击导出1</el-button>
    <br>
    <el-button size="small" type="primary" @click="exportFile2">点击导出2</el-button>
    <el-upload
      action=""
      :before-upload="beforeUpload"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
// import XLSX from 'xlsx' // 这个为什么不行?
const XLSX = require('xlsx')
export default {
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    exportFile1() {
      const data = [{
          '姓名': 'zhangsan',
          '年龄': 20,
          '性别': '男'
      },{
        '姓名': 'zhangsan',
        '年龄': 20,
        '性别': '男'
    }];
      // 新建空workbook，然后加入worksheet
      const sheet1 = XLSX.utils.json_to_sheet(data)
      // 设置每列的列宽，10代表10个字符，注意中文占2个字符
      sheet1['!cols'] = [
        { wch: 10 },
        { wch: 30 },
        { wch: 25 }
      ]
      const sheet2 = XLSX.utils.json_to_sheet(data)
      sheet2['!cols'] = [
        { wch: 10 },
        { wch: 30 },
        { wch: 25 }
      ]
      // 新建book
      const wb = XLSX.utils.book_new()
      // 生成xlsx文件(book,sheet数据,sheet命名)
      XLSX.utils.book_append_sheet(wb, sheet1, '数据详情')
      XLSX.utils.book_append_sheet(wb, sheet2, '备份数据详情')
      // 写文件(book,xlsx文件名称)
      XLSX.writeFile(wb, '列表详情.xlsx')
    },
    exportFile2() {
      // aoa_to_sheet: 这个工具类最强大也最实用了，将一个二维数组转成sheet，会自动处理number、string、boolean、date等类型数据；
      // table_to_sheet: 将一个table dom直接转成sheet，会自动识别colspan和rowspan并将其转成对应的单元格合并；
      // json_to_sheet: 将一个由对象组成的数组转成sheet；
      var aoa = [
        ['姓名', '性别', '年龄', '注册时间'],
        ['张三', '男', 18, new Date()],
        ['李四', '女', 22, new Date()]
      ];
      var sheet = XLSX.utils.aoa_to_sheet(aoa);
      this.openDownloadDialog(this.sheet2blob(sheet), '导出.xlsx');
    },
    /**
     * 通用的打开下载对话框方法，没有测试过具体兼容性
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    openDownloadDialog(url, saveName)
    {
      if(typeof url == 'object' && url instanceof Blob)
      {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      var aLink = document.createElement('a');
      aLink.href = url;
      aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if(window.MouseEvent) event = new MouseEvent('click');
      else
      {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      }
      aLink.dispatchEvent(event);
    },
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1';
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
      return blob;
    },
    beforeUpload(file) {
      console.log(file)
      this.readExcel(file)
      return false
    },
    // 读取文件。读取用XLSX读取为sheet对象，然后用XLSX转为csv、txt、html、json等等
    readExcel(file) {
      let reader = new FileReader();
      reader.readAsBinaryString(file);
      // reader.readAsText(file, 'GB3212'); // 读中文编码乱码时可用
      reader.onload = function(e) {
        console.log(e)
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});
        // var workbook = XLSX.read(data, {type: 'string'}); // 读中文编码乱码时可用
        console.log(workbook)
        // Workbook Object
        // SheetNames里面保存了所有的sheet名字，然后Sheets则保存了每个sheet的具体内容（我们称之为Sheet Object）。
        // 每一个sheet是通过类似A1这样的键值保存每个单元格的内容，我们称之为单元格对象（Cell Object）

        // Sheet Object
        // 每一个Sheet Object表示一张表格，只要不是!开头的都表示普通cell，否则，表示一些特殊含义，具体如下：
        // sheet['!ref']：表示所有单元格的范围，例如从A1到F8则记录为A1:F8；
        // sheet[!merges]：存放一些单元格合并信息，是一个数组，每个数组由包含s和e构成的对象组成，s表示开始，e表示结束，r表示行，c表示列；

        // 单元格对象（Cell Object），主要有t、v、r、h、w等字段
        // t：表示内容类型，s表示string类型，n表示number类型，b表示boolean类型，d表示date类型，等等
        // v：表示原始值；
        // f：表示公式，如B2+B3；
        // h：HTML内容
        // w：格式化后的内容
        // r：富文本内容rich text
        // 等等
        
        // XLSX.utils.sheet_to_csv：生成CSV格式
        // XLSX.utils.sheet_to_txt：生成纯文本格式
        // XLSX.utils.sheet_to_html：生成HTML格式
        // XLSX.utils.sheet_to_json：输出JSON格式
        console.log(XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[1]]))
      };
    },
    // 将csv转换成简单的表格，会忽略单元格合并，在第一行和第一列追加类似excel的索引
    csv2table(csv) {
      var html = '<table>';
      var rows = csv.split('\n');
      rows.pop(); // 最后一行没用的
      rows.forEach(function(row, idx) {
        var columns = row.split(',');
        columns.unshift(idx+1); // 添加行索引
        if(idx == 0) { // 添加列索引
          html += '<tr>';
          for(var i=0; i<columns.length; i++) {
            html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
          }
          html += '</tr>';
        }
        html += '<tr>';
        columns.forEach(function(column) {
          html += '<td>'+column+'</td>';
        });
        html += '</tr>';
      });
      html += '</table>';
      return html;
    },
    // csv转sheet对象
    csv2sheet(csv) {
      var sheet = {}; // 将要生成的sheet
      csv = csv.split('\n');
      csv.forEach(function(row, i) {
        row = row.split(',');
        if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
        row.forEach(function(col, j) {
          sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
        });
      });
      return sheet;
    }
  }
}
</script>