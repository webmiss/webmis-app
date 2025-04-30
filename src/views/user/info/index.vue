<template>
  <PageView bgColor="linear-gradient(to bottom, #F8F8F8 0%, #F8F8F8 100%)">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>编辑资料</template>
    <ScrollView :isUpper="false" :isLower="false">
      <div class="me_info">
        <div class="me_info_img" :style="{backgroundImage:state.uinfo.img?'url('+(state.uinfo.img)+')':'', backgroundSize: state.uinfo.img?'100%':'60%'}" @click="upImg()"></div>
        <div class="me_info_text">UID: {{ state.uinfo.uid || '-' }}</div>
      </div>
      <ul class="menu_list mbottom10">
        <li class="flex mtop10" @click="changeInfo('nickname', state.uinfo.nickname)">
          <div class="flex ico"><b>呢称</b></div>
          <div class="flex"><span class="info">{{ state.uinfo.nickname || '请输入' }}</span><i class="ui ui_arrow_right"></i></div>
        </li>
        <li class="flex mtop1" @click="changeInfo('department', state.uinfo.department)">
          <div class="flex ico"><b>部门</b></div>
          <div class="flex"><span class="info">{{ state.uinfo.department || '-' }}</span><i class="ui ui_arrow_right"></i></div>
        </li>
        <li class="flex mtop1" @click="changeInfo('position', state.uinfo.position)">
          <div class="flex ico"><b>职务</b></div>
          <div class="flex"><span class="info">{{ state.uinfo.position || '-' }}</span><i class="ui ui_arrow_right"></i></div>
        </li>
        <li class="flex mtop1">
          <div class="flex ico"><b>姓名</b></div>
          <div class="flex"><span class="info">{{ state.uinfo.name || '-' }}</span></div>
        </li>
        <li class="flex mtop1" @click="changeInfo('gender', state.uinfo.gender)">
          <div class="flex ico"><b>性别</b></div>
          <div class="flex"><span class="info">{{ state.uinfo.gender || '请选择' }}</span><i class="ui ui_arrow_right"></i></div>
        </li>
        <li class="flex mtop1" @click="changeInfo('birthday', state.uinfo.birthday)">
          <div class="flex ico"><b>生日</b></div>
          <div class="flex"><span class="info">{{ state.uinfo.birthday || '请选择' }}</span><i class="ui ui_arrow_right"></i></div>
        </li>
      </ul>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
.me_info{position: relative; height: 200px; background-color: #FFF;}
.me_info_img{position: absolute; z-index: 2; width: 120px; height: 120px; left: 50%; top: 48%; transform: translate(-50%, -50%); border-radius: 50%; border: #FFF 2px solid; background-image: url('../../../assets/logo.svg'); background-size: 60%; background-color: #F2F4F8; background-repeat: no-repeat; background-position: center;}
.me_info_text{position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%);}
</style>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
/* JS组件 */
import Request from '../../../library/request';
import Ui from '../../../library/ui';
import Files from '../../../library/files';
/* 组件 */
import PageView from '../../../components/view/page.vue';
import ScrollView from '../../../components/view/scroll.vue';

const { proxy } = getCurrentInstance() as any ;
// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
// 变量

/* 修改信息 */
const changeInfo = async (name: string, value: string): Promise<void> => {
  let res: any;
  if(name==='nickname') {
    res = await proxy.$showModal({title:'用户呢称', content:value, editable: true});
  }else if(name==='department') {
    res = await proxy.$showModal({title:'所属部门', content:value, editable: true});
  }else if(name==='position') {
    res = await proxy.$showModal({title:'担任职务', content:value, editable: true});
  }else if(name==='gender') {
    res = await proxy.$actionSheet({title:'选择性别', active: value, actions:[{label:'男', value:'男'}, {label:'女', value:'女'}]});
  }else if(name==='birthday') {
    let active = value?value.split('-'):[];
    active = ['YunNan', 'YuXi', 'JiangChuan'];
    res = await proxy.$showPicker({title:'选择生日', active: active, columns: getColumns(),
    changeCallBack:(v: any)=>{
      console.log('changeCallBack', v);
    }
  });
    console.log(res);
    return;
  }
  // 确认
  if(res.confirm) {
    const data: any = {};
    data[name] = res.content.trim();
    // 请求
    Request.Post('user/change_uinfo', {token: state.token, uinfo:data}, (res:any)=>{
      const {code, msg} = res.data;
      if(code===0) state.uinfo[name] = data[name];
      return Ui.Toast(msg);
    });
  }
}

const getColumns = (): Array<any> => {
  let data: Array<any>=[];
  // data = [{label: '男', value: '男'}, {label: '女', value: '女'}];
  // data = [
  //   [
  //     {label:'2025年', value:'2025'},
  //     {label:'2024年', value:'2024'},
  //     {label:'2023年', value:'2023'},
  //   ],
  //   [
  //     {label:'01月', value:'01'},
  //     {label:'02月', value:'02'},
  //     {label:'03月', value:'03'},
  //     {label:'04月', value:'04'},
  //     {label:'05月', value:'05'},
  //     {label:'06月', value:'06'},
  //     {label:'07月', value:'07'},
  //     {label:'08月', value:'08'},
  //     {label:'09月', value:'09'},
  //     {label:'10月', value:'10'},
  //     {label:'11月', value:'11'},
  //     {label:'12月', value:'12'},
  //   ],
  //   [
  //     {label:'01日', value:'01'},
  //     {label:'02日', value:'02'},
  //     {label:'03日', value:'03'},
  //     {label:'04日', value:'04'},
  //     {label:'05日', value:'05'},
  //     {label:'06日', value:'06'},
  //     {label:'07日', value:'07'},
  //     {label:'08日', value:'08'},
  //     {label:'09日', value:'09'},
  //     {label:'10日', value:'10'},
  //     {label:'11日', value:'11'},
  //     {label:'12日', value:'12'},
  //     {label:'13日', value:'13'},
  //     {label:'14日', value:'14'},
  //     {label:'15日', value:'15'},
  //     {label:'16日', value:'16'},
  //     {label:'17日', value:'17'},
  //     {label:'18日', value:'18'},
  //     {label:'19日', value:'19'},
  //     {label:'20日', value:'20'},
  //     {label:'21日', value:'21'},
  //     {label:'22日', value:'22'},
  //     {label:'23日', value:'23'},
  //     {label:'24日', value:'24'},
  //     {label:'25日', value:'25'},
  //     {label:'26日', value:'26'},
  //     {label:'27日', value:'27'},
  //     {label:'28日', value:'28'},
  //     {label:'29日', value:'29'},
  //     {label:'30日', value:'30'},
  //   ],
  // ];
  data = [
    {label: '云南', value: 'YunNan', children: [
      {label: '昆明', value: 'KunMing', children: [
        {label: '五华区', value: 'WuHua'},
        {label: '官渡区', value: 'GuanDu'},
        {label: '西山区', value: 'XiShan'},
      ]},
      {label: '玉溪', value: 'YuXi', children: [
        {label: '红塔区', value: 'HongTa'},
        {label: '江川区', value: 'JiangChuan'},
      ]},
    ]}
  ];
  return data;
}

/* 上传头像 */
const upImg = (): void => {
  // 选择文件
  Files.Select({}, (fileObj:any)=>{
    // 转Base64
    Files.FileToBase64(fileObj, (base64: any)=>{
      // 压缩图片
      Files.ImageCompress(base64, {width:200, height:200, type:fileObj.type}, (imgBase64: any)=>{
        // 请求
        Request.Post('user/upimg', {token: state.token, base64:imgBase64}, (res:any)=>{
          const {code, msg} = res.data;
          if(code===0){
            // 更新用户信息
            state.uinfo.img = imgBase64;
          }
          return Ui.Toast(msg);
        });
      }, (err: string)=>{
        Ui.Toast(err);
      });
    })
  }, (err: string)=>{
    Ui.Toast(err);
  });
}

</script>