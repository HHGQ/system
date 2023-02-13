<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item v-if="regionProp" label="活动区域" prop="region" key="region1">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <el-option :label="'shanghai'" :value="0"></el-option>
          <el-option :label="'beijing'" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="活动区域" key="region2">
        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
          <el-option :label="'shanghai'" :value="0"></el-option>
          <el-option :label="'beijing'" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="ruleForm.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="regionProp=!regionProp">changeRegionProp</el-button>
      </el-form-item>
    </el-form>
    
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="Name" prop="name">
          <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
      </FormItem>
      <FormItem label="E-mail" prop="mail">
          <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
      </FormItem>
      <FormItem v-if="cityProp" label="City" prop="city" key="city1">
          <Select v-model="formValidate.city" placeholder="Select your city">
              <Option :value="0">New York</Option>
              <Option :value="1">London</Option>
              <Option :value="2">Sydney</Option>
          </Select>
      </FormItem>
      <FormItem v-else label="City" key="city2">
          <Select v-model="formValidate.city" placeholder="Select your city">
              <Option :value="0">New York</Option>
              <Option :value="1">London</Option>
              <Option :value="2">Sydney</Option>
          </Select>
      </FormItem>
      <FormItem label="Date">
          <Row>
              <Col span="11">
                  <FormItem prop="date">
                      <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                  </FormItem>
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                  <FormItem prop="time">
                      <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                  </FormItem>
              </Col>
          </Row>
      </FormItem>
      <FormItem label="Gender" prop="gender">
          <RadioGroup v-model="formValidate.gender">
              <Radio label="male">Male</Radio>
              <Radio label="female">Female</Radio>
          </RadioGroup>
      </FormItem>
      <FormItem label="Hobby" prop="interest">
          <CheckboxGroup v-model="formValidate.interest">
              <Checkbox label="Eat"></Checkbox>
              <Checkbox label="Sleep"></Checkbox>
              <Checkbox label="Run"></Checkbox>
              <Checkbox label="Movie"></Checkbox>
          </CheckboxGroup>
      </FormItem>
      <FormItem label="Desc" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
          <Button @click="cityProp=!cityProp" style="margin-left: 8px">changeProp</Button>
      </FormItem>
  </Form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regionProp: false,
      cityProp: false,
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      formValidate: {
          name: '',
          mail: '',
          city: '',
          gender: '',
          interest: [],
          date: '',
          time: '',
          desc: ''
      },
      ruleValidate: {
          name: [
              { required: true, message: 'The name cannot be empty', trigger: 'blur' }
          ],
          mail: [
              { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
              { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
          ],
          city: [
              { required: true, type: 'number', message: 'Please select the city', trigger: 'change' }
          ],
          gender: [
              { required: true, message: 'Please select gender', trigger: 'change' }
          ],
          interest: [
              { required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change' },
              { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
          ],
          date: [
              { required: true, type: 'date', message: 'Please select the date', trigger: 'change' }
          ],
          time: [
              { required: true, type: 'string', message: 'Please select time', trigger: 'change' }
          ],
          desc: [
              { required: true, message: 'Please enter a personal introduction', trigger: 'blur' },
              { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    }
  }
}
</script>