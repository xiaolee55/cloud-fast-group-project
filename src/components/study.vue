<template>
  <div>
     <el-collapse-transition>
       <div v-if="showHapi" style="display:flex;justify-content:center">
        <el-popover
          placement="top-start"
          width="200"
          trigger="click"
          content="你好鸭，欢迎使用哈氏集团的产品，我是CEO哈总，点击右边的哈皮可以打开历史记录哦🚽🔫">
          <img 
            src="https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201803/29/190347dqd1u2dy2x77o1e2.gif" 
            slot="reference" 
            class="hapi">
        </el-popover>
        <div style="display:flex;flex-direction:column;width:200px;">
          <el-button 
            type="primary"
            @click="createOneGroup" 
            :disabled="showCreateForm" 
            icon="el-icon-edit">
            添加一组数据
          </el-button>
          <el-link @click="showHapi=false" type="primary">隐藏</el-link>
        </div>
        <img 
          src="https://bbsfiles.vivo.com.cn/vivobbs/attachment/forum/201803/29/190346baoaood00oodoac4.gif" 
          class="hapi" 
          @click="getCacheData">
      </div>
       <el-link v-else @click="showHapi=true" type="primary">显示</el-link>
      </el-collapse-transition>
      <div style="display:flex;margin:20px auto" class="create-data" v-if="showCreateForm">
        <el-input v-model="currentInput"  type="textarea"></el-input>
        <el-button 
          @click="confirmCreate" 
          size="small" 
          type="primary" 
          icon="el-icon-circle-plus-outline">
          确定添加
        </el-button>
    </div>
    <!-- <el-divider></el-divider> -->
    <el-collapse-transition>
      <el-card class="temp-data" v-if="showCreateForm">
        <div slot="header" class="clearfix">
          <h3>当前组的数据</h3>
          <el-button 
            @click="save" 
            size="small" 
            type="success"
            icon="el-icon-plus">
            保存本组数据
          </el-button>
        </div>
        <div>
          <el-checkbox-group v-model="deleteList" fill="#f56c6c">
            <el-checkbox 
              :label="val.text" 
              v-for="(val,i) in currentGroup" 
              :key="i"
              style="display:block;padding:5px"/>
          </el-checkbox-group>          
          <el-button size="mini" type="danger" @click="deleteUnSaveData">删除</el-button>
        </div>
      </el-card>
    </el-collapse-transition>
       <el-divider></el-divider>
    <el-collapse-transition>
      <el-card v-if="showData.length">
        <div slot="header" class="clearfix" v-if="!fullScreen">
          <h3>总览</h3>
          <el-button 
            type="success" 
            size="small" 
            @click="getRandomData()" 
            v-if="this.showData.length"
            icon="el-icon-sort">
            打乱顺序
          </el-button>
          <el-button 
            type="danger" 
            size="small" 
            @click="clearData()" 
            v-if="this.showData.length" 
            icon="el-icon-delete" >
            清空数据
          </el-button>
          <el-button 
            type="warning" 
            size="small"
            @click="fullScreen=!fullScreen"
            icon="el-icon-rank">
            隐藏按钮栏
          </el-button>
        </div>
        <el-link v-else @click="fullScreen=!fullScreen" type="primary" style="margin-bottom:10px">展开按钮栏</el-link>
        <el-row  :gutter="20" type="flex" justify="space-around">
          <el-col v-for="(item,index) in showData" :key="index">
            <el-card  title="总览">
              <div  
                v-for="(val,i) in item" 
                :key="i" 
                style="background-color:#303133;color:white;height:80px;overflow-y:auto;margin: 10px 0">
                <p style="padding:5px; font-size:13px">
                  {{i+1}}.{{val.text}}
                </p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card >
    </el-collapse-transition>
    <el-drawer
      :visible.sync="showDrawer"
      direction="rtl"
      :before-close="clearCacheData">
      <el-popover
        placement="left-start"
        width="200"
        trigger="click"
        content="点击恢复可以将整组数据加到连线处👇。点击单条数据可以展示其详细内容👇">
        <img src="https://inews.gtimg.com/newsapp_match/0/11245216897/0" class="simao" slot="reference">
      </el-popover>
      <h2>历史添加数据</h2>
      <el-tree :data="cacheData" :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node,data }">
          <el-popover
            v-if="node.isLeaf"
            placement="top-start"
            width="200"
            trigger="click"
            :content="node.label">
             <span style="font-size:13px" slot="reference">{{ node.label }}</span>
          </el-popover>
          <span v-else style="font-size:13px">{{ node.label }}</span>
          <span  style="padding-left:15px">
            <el-button
              v-if="!node.isLeaf"
              size="mini" 
              type="primary"
              style="padding: 3px 15px"
              @click="resumeData(data)">
              恢复
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showData: [],
      showCreateForm: false,
      currentGroup: [],
      currentInput: '',
      fullScreen: false,
      deleteList: [],
      showDrawer: false,
      cacheData: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      showHapi: true
    };
  },
  methods: {
    createOneGroup(){
      this.showCreateForm = true
    },
    save(){
      this.showData.push(this.currentGroup)
      const len = window.localStorage.length - 1
      window.localStorage.setItem(len,JSON.stringify(this.currentGroup))
      this.currentGroup = []
      this.showCreateForm = false
    },
    confirmCreate() {
      const cur = {text:this.currentInput}
      if(!cur) return
      this.currentGroup.push(cur)
      this.currentInput = ''
    },
    getRandomData() {
      const data = this.showData
      const newData = []
      data.forEach(item=>{
        newData.push(item.sort(()=>Math.random() - 0.5))
      })
      this.showData = newData
    }, 
    clearData() {
      this.showData = []
    },
    deleteUnSaveData() {
      this.currentGroup = this.currentGroup.filter(item=>!this.deleteList.includes(item.text))
    },
    getCacheData() {
      this.showDrawer = true
      const len = window.localStorage.length - 1;
      const arr = new Array(len).fill(0)
      arr.forEach((item,idx)=>{
        const cur = JSON.parse(window.localStorage[idx])
        this.cacheData.push({text:idx,children:cur})
      })
    },
    clearCacheData(done){
      this.cacheData = []
      done();
    },
    resumeData(data) {
      this.showData.push(data.children)
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .hapi {
  max-width: 100%;
  max-height: 100%;
  width: 80px;
  height:80px;
  cursor: pointer;
 }
 .simao {
    max-width: 100%;
    max-height: 100%;
    width: 100px;
    height:100px;
    cursor: pointer;
 }
</style>
