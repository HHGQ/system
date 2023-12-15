<template>
  <div class="locale-changer">
    <el-select v-model="$i18n.locale" placeholder="请选择" @change="changLanguage">
      <el-option
        v-for="item in langs"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <p>{{ $t("common.hello") }}</p>
    <p v-html="$t('common.aTag')"></p>
    <p v-t="$tc('common.apple', 4)"></p>
    <p v-t="$tc('common.banana', 3)"></p>
    <p>{{translator.gettext('Welcome')}}</p>
    <p>{{translator.gettext('Welcome1', 'apples', 'bowl')}}</p>
    <p>{{translator.ngettext('There is %1 apple', '%1', 4)}}</p>
    <i18n path="common.term" tag="label" for="common.tos">
      <a href="http://www.baidu.com" target="_blank">{{ $t('common.tos') }}</a>
    </i18n>
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'locale-changer',
  data () {
    return { 
      langs: ['zh-CN', 'zh-TW', 'en-US'],
      tableData: []
    }
  },
  methods: {
    changLanguage(val) {
      console.log(val)
      localStorage.setItem('language', val)
    }
  }
}
</script>