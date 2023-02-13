<template>
  <div>
    <el-upload
      class="upload-demo"
      :action="'111'"
      :before-upload="beforeUpload"
      :file-list="fileList"
      multiple>
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <canvas id="canvas-container" width="800px" height="500px"></canvas>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fileList: []
      };
    },
    mounted() {
      
    },
    methods: {
      beforeUpload(file) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function(){
          var binary = this.result;
          var canvas = document.getElementById("canvas-container")
          const gl = canvas.getContext('webgl')
          // 2.初始化着色器程序 initProgram
          // 创建着色器
          const vertexShader = gl.createShader(gl.VERTEX_SHADER)
          const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
          const program = gl.createProgram()
          if (!(vertexShader && fragmentShader && program)) {
              console.warn('shaders create failed')
          }
          // vertexShaderScript420 为 yuv420p 顶点着色器脚本内容，后文再介绍
          const vertexShaderScript420 = `
            attribute vec4 vertexPos;  
            attribute vec2 texturePos; 
            varying vec2 textureCoord;  

            void main() {
                gl_Position = vertexPos;  
                textureCoord = texturePos;  
            }
          `
          gl.shaderSource(vertexShader, vertexShaderScript420)
          gl.compileShader(vertexShader)
          if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
              console.warn('Vertex shader failed to compile: ', gl.getShaderInfoLog(vertexShader))
          }
          // fragmentShaderScript420 为 yuv420p 片段着色器脚本内容
          const fragmentShaderScript420 = `
            precision highp float;
            varying highp vec2 textureCoord; 
            uniform sampler2D ySampler;   
            uniform sampler2D uSampler; 
            uniform sampler2D vSampler; 
            const mat4 YUV2RGB = mat4(
                1.1643828125, 0, 1.59602734375, -.87078515625,
                1.1643828125, -.39176171875, -.81296875, .52959375,
                1.1643828125, 2.017234375, 0, -1.081390625,
                0, 0, 0, 1
            ); 

            void main(void) {
                highp float y = texture2D(ySampler,  textureCoord).r; 
                highp float u = texture2D(uSampler,  textureCoord).r;
                highp float v = texture2D(vSampler,  textureCoord).r;
                gl_FragColor = vec4(y, u, v, 1) * YUV2RGB;
            }
          `
          gl.shaderSource(fragmentShader, fragmentShaderScript420)
          gl.compileShader(fragmentShader)
          if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
              console.log('Fragment shader failed to compile: ', gl.getShaderInfoLog(fragmentShader))
          }
          // 关联并使用此着色程序
          gl.attachShader(program, vertexShader)
          gl.attachShader(program, fragmentShader)
          gl.linkProgram(program)
          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
              console.log('Program failed to compile: ', gl.getProgramInfoLog(program))
          }
          gl.useProgram(program)

          // 3.初始化数据缓存 initBuffers
          // 创建缓冲并存入相关顶点数据
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, -1, 1, 1, -1, 1, -1, -1, 1, -1, -1]), gl.STATIC_DRAW)
          // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
          // 找到顶点坐标属性(Attribute)的地址
          const vertexPos = gl.getAttribLocation(program, 'vertexPos')
          // 告诉WebGL怎么从缓冲中获取数据传递给属性
          gl.enableVertexAttribArray(vertexPos)
          gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0) // (属性地址, 坐标数, 32位浮点数, 不标准化, stride, offset)

          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0]), gl.STATIC_DRAW)
          // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

          const texturePos = gl.getAttribLocation(program, 'texturePos')
          gl.enableVertexAttribArray(texturePos)
          gl.vertexAttribPointer(texturePos, 2, gl.FLOAT, false, 0, 0)

          // 4.创建纹理 initTexture
          function createTexture() {
              const texture = gl.createTexture()
              gl.bindTexture(gl.TEXTURE_2D, texture)
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)    // 当放大时选择4个像素混合
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)    // 当缩小时选择4个像素混合
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE) // 表示U方向不需要重复贴图
              gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE) // 表示V方向不需要重复贴图
              gl.bindTexture(gl.TEXTURE_2D, null)
              return texture
          }
          // 创建y纹理对象
          const yTexture = createTexture(gl)
          // 找到ySampler地址，并告诉sampler取样器使用第0个纹理单元，即gl.TEXTURE0
          const ySampler = gl.getUniformLocation(program, 'ySampler')
          gl.uniform1i(ySampler, 0)

          const uTexture = createTexture(gl)
          const uSampler = gl.getUniformLocation(program, 'uSampler')
          gl.uniform1i(uSampler, 1)

          const vTexture = createTexture(gl)
          const vSampler = gl.getUniformLocation(program, 'vSampler')
          gl.uniform1i(vSampler, 2)

          // buffer 即为解码后的帧数据，videoWidth、videoHeight分别为视频画面的宽和高
          // 设置清空颜色缓冲时的颜色值
          gl.clearColor(0, 0, 0, 0);
          // 清空缓冲
          gl.clear(gl.COLOR_BUFFER_BIT);
          const videoWidth = 800,videoHeight=500
          const size = videoWidth * videoHeight
          gl.viewport(0, 0, videoWidth, videoHeight)
          var uint8 = new Uint8Array(binary);
          var unit8s = new Uint8Array()
          console.log(unit8s)
          // for(var i = 0; i< uint8.length; i++) {
          //   if (i%4!=0&&i!=0) {
          //     uint8[i] = 0
          //   }
          // }
          console.log(uint8)
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)    // 让图片在图片坐标系中倒立一下
          let buffer = uint8
          // 根据前面YUV的说明已经清楚，有多少个像素就有多少y分量，所以y分量数据长度=宽*高
          const yLen = size
          const yData = buffer.subarray(0, yLen)
          console.log(yData)
          gl.activeTexture(gl.TEXTURE0)
          gl.bindTexture(gl.TEXTURE_2D, yTexture)
          // 指明纹理的具体属性
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, videoWidth, videoHeight, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, yData)

          // 420模式下u和v都为y分量的1/4.
          const uLen = size / 4
          const uData = buffer.subarray(yLen, yLen + uLen)
          gl.activeTexture(gl.TEXTURE1)
          gl.bindTexture(gl.TEXTURE_2D, uTexture)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, videoWidth / 2, videoHeight / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, uData)

          const vLen = uLen
          const vData = buffer.subarray(yLen + uLen, yLen + uLen + vLen)
          gl.activeTexture(gl.TEXTURE2)
          gl.bindTexture(gl.TEXTURE_2D, vTexture)
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, videoWidth / 2, videoHeight / 2, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, vData)

          // 按照多个三角形的方式绘制，从顶点0开始绘制，总计6个顶点
          gl.drawArrays(gl.TRIANGLES, 0, 6)    
        }
        return false
      }
    }
  }
</script>