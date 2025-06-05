<template>
  <PageView bgColor="linear-gradient(to bottom, #FFF 0%, #F8F8F8 100%)">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>
      <div class="goods_search">
        <i class="ui ui_scan" @click="openScan()"></i>
        <i class="ui ui_search" @click="closeKeyboard()"></i>
        <wm-input v-model:value="form.key" @update:blur="serachVal($event)" @keyup.enter="serachVal($event.target.value)" placeholder="商品编码" padding="10px 40px" radius="8px" enterkeyhint="search"></wm-input>
      </div>
    </template>
    <template #bar_right>
      <i class="ui ui_more more" @click="showMore()"></i>
    </template>
    <ScrollView v-model:refreshing="scroll.refreshing" @refresh="loadData" :isLower="false" @click="closeKeyboard()">
      <div class="refresh_time">{{ total.time || 'loading' }}</div>
      <div class="tools_goods_img">
        <div class="sku">
          <span v-if="list.info.sku_id"  @click.stop="Copy(list.info.sku_id)">
            <b>{{ list.info.sku_id }}</b><i class="ui ui_copy"></i>
          </span>
        </div>
        <div class="action_img" :style="{backgroundImage: list.info.img?'url('+list.info.img+')':''}" @click="list.info.img?previewImage(list.info.img):''">
          <div class="close" v-if="list.info.img" @click.stop="removeImg()">
            <div class="action_close"></div>
          </div>
          <i class="ui ui_image" v-if="!list.info.img"></i>
          <div class="text" @click.stop="upImg()">{{ list.info.img?'更新图片':'上传图片' }}</div>
        </div>
        <div class="total">
          <span>入库: <b>{{ total.list.num_in || '-' }}</b></span>
          <span>调拨: <b>{{ total.list.allocate || '-' }}</b></span>
          <span>销售: <b>{{ total.list.num_order+total.list.other_out || '-' }}</b></span>
          <span>售后: <b>{{ total.list.num_refund+total.list.other_in || '-' }}</b></span>
          <span>采退: <b>{{ total.list.num_out || '-' }}</b></span>
        </div>
      </div>
      <ul class="goods_tabs">
        <li :class="form.state==='0'?'active':''" @click="changeTabs('0')">资料</li>
        <li :class="form.state==='1'?'active':''" @click="changeTabs('1')" v-if="list.info.supplier_name">供应商</li>
        <li :class="form.state==='2'?'active':''" @click="changeTabs('2')">
          <div class="num">库存<span class="redNum">{{ total.list.total || 0 }}</span></div>
        </li>
        <li :class="form.state==='3'?'active':''" @click="changeTabs('3')">流向</li>
        <li :class="form.state==='4'?'active':''" @click="changeTabs('4')">日志</li>
      </ul>
      <!-- 资料 -->
      <ul class="tools_goods_list" v-if="form.state==='0'">
        <li>
          <span class="label">商品名称</span>
          <span class="value">{{ list.info.name || '-' }}</span>
        </li>
        <li>
          <span class="label">颜色及规格</span>
          <span class="value">{{ list.info.properties_value || '-' }}</span>
        </li>
        <li v-if="list.info.short_name">
          <span class="label">暗码</span>
          <span class="value">{{ list.info.short_name || '-' }}</span>
        </li>
        <li v-if="list.info.cost_price>0">
          <span class="label">成本价(元)</span>
          <span class="value" v-if="list.info.ratio<1&&list.info.cost_price>0">
            <del>{{ priceEncode(list.info.cost_price) }}</del>&nbsp;
            <b>{{ priceEncode(list.info.cost_price*list.info.ratio) }}</b>
          </span>
          <span v-else>{{ priceEncode(list.info.cost_price) }}</span>
        </li>
        <li v-if="list.info.supply_price>0">
          <span class="label">供应链价(元)</span>
          <span class="value" v-if="list.info.ratio<1&&list.info.supply_price>0">
            <del>{{ priceEncode(list.info.supply_price) }}</del>&nbsp;
            <b>{{ priceEncode(list.info.supply_price*list.info.ratio) }}</b>
          </span>
          <span v-else>{{ priceEncode(list.info.supply_price) }}</span>
        </li>
        <li v-if="list.info.sale_price>0">
          <span class="label">标签价(元)</span>
          <span class="value" v-if="list.info.ratio<1&&list.info.sale_price>0">
            <del>{{ priceEncode(list.info.sale_price) }}</del>&nbsp;
            <b>{{ priceEncode(list.info.sale_price*list.info.ratio) }}</b>
          </span>
          <span v-else>{{ priceEncode(list.info.sale_price) }}</span>
        </li>
        <li v-if="list.info.purchase_price>0">
          <span class="label">采购价(W)</span>
          <span class="value" v-if="list.info.ratio<1&&list.info.purchase_price>0">
            <del>{{ priceEncode(list.info.purchase_price) }}</del>&nbsp;
            <b>{{ priceEncode(list.info.purchase_price*list.info.ratio) }}</b>
          </span>
          <span v-else>{{ priceEncode(list.info.purchase_price) }}</span>
        </li>
        <li v-if="list.info.supplier_price>0">
          <span class="label">人民币结算价(元)</span>
          <span class="value" v-if="list.info.ratio<1&&list.info.supplier_price>0">
            <del>{{ priceEncode(list.info.supplier_price) }}</del>&nbsp;
            <b>{{ priceEncode(list.info.supplier_price*list.info.ratio) }}</b>
          </span>
          <span v-else>{{ priceEncode(list.info.supplier_price) }}</span>
        </li>
        <li v-if="list.info.market_price>0">
          <span class="label">吊牌价(W)</span>
          <span class="value" v-if="list.info.ratio<1&&list.info.market_price>0">
            <del>{{ priceEncode(list.info.market_price) }}</del>&nbsp;
            <b>{{ priceEncode(list.info.market_price*list.info.ratio) }}</b>
          </span>
          <span v-else>{{ priceEncode(list.info.market_price) }}</span>
        </li>
        <li>
          <span class="label">数量</span>
          <b class="value" v-if="list.info.num>0">{{ list.info.num }}</b>
          <span class="value" v-else>-</span>
        </li>
        <li>
          <span class="label">单位</span>
          <span class="value">{{ list.info.unit || '-' }}</span>
        </li>
        <li>
          <span class="label">重量</span>
          <span class="value">{{ list.info.weight || '-' }}</span>
        </li>
        <li>
          <span class="label">折扣</span>
          <b class="value" v-if="list.info.ratio<1">{{ list.info.ratio || '-' }}</b>
          <span class="value" v-else>{{ list.info.ratio || '-' }}</span>
        </li>
        <li>
          <span class="label">标签</span>
          <span class="value">{{ list.info.labels || '-' }}</span>
        </li>
        <li>
          <span class="label">分类</span>
          <span class="value">{{ list.info.category || '-' }}</span>
        </li>
        <li>
          <span class="label">品牌</span>
          <span class="value">{{ list.info.brand || '-' }}</span>
        </li>
        <li>
          <span class="label">采购员</span>
          <span class="value">{{ list.info.owner || '-' }}</span>
        </li>
        <li>
          <span class="label">供应商</span>
          <span class="value">{{ list.info.supplier_name || '-' }}</span>
        </li>
        <li>
          <span class="label">创建时间</span>
          <span class="value">{{ list.info.ctime || '-' }}</span>
        </li>
        <li>
          <span class="label">更新时间</span>
          <span class="value">{{ list.info.utime || '-' }}</span>
        </li>
      </ul>
      <!-- 供应商 -->
      <ul class="tools_goods_list" v-if="form.state==='1'">
        <li>
          <span class="label">供应商</span>
          <span class="value">{{ list.info.supplier_name || '-' }}</span>
        </li>
        <li>
          <span class="label">手机号码</span>
          <b v-if="list.info.supplier_tel" @click="Copy(list.info.supplier_name+' '+list.info.supplier_tel);openTel(list.info.supplier_tel)">{{ telEncode(list.info.supplier_tel) }}</b>
          <span class="value" v-else>-</span>
        </li>
        <li>
          <span class="label">创建时间</span>
          <span class="value">{{ list.info.supplier_ctime || '-' }}</span>
        </li>
        <li>
          <span class="label">更新时间</span>
          <span class="value">{{ list.info.supplier_utime || '-' }}</span>
        </li>
        <li>
          <span class="label">区域</span>
          <span class="value">{{ list.info.supplier_city || '-' }}</span>
        </li>
        <li>
          <span class="label">开户行</span>
          <span class="value">{{ list.info.supplier_depositbank || '-' }}</span>
        </li>
        <li>
          <span class="label">账户名称</span>
          <span class="value">{{ list.info.supplier_bankacount || '-' }}</span>
        </li>
        <li>
          <span class="label">银行卡</span>
          <b v-if="list.info.supplier_acountnumber" @click="Copy(list.info.supplier_depositbank+' '+list.info.supplier_bankacount+' '+list.info.supplier_acountnumber)">{{ cardEncode(list.info.supplier_acountnumber) }}</b>
          <span class="value" v-else>-</span>
        </li>
        <li>
          <span class="label">支付宝</span>
          <span class="value" @click="Copy(list.info.supplier_alipay_name+' '+list.info.supplier_alipay_id)">{{ list.info.supplier_alipay_name || '-' }}</span>
        </li>
        <li>
          <span class="label">支付宝帐号</span>
          <b v-if="list.info.supplier_alipay_id" @click="Copy('支付宝: '+list.info.supplier_alipay_name+' '+list.info.supplier_alipay_id)">{{ list.info.supplier_alipay_id || '-' }}</b>
          <span class="value" v-else>-</span>
        </li>
      </ul>
      <!-- 库存 -->
      <ul class="tools_goods_list" v-if="form.state==='2'&&list.stock.length>0">
        <li v-for="v in list.stock">
          <span class="label" style="width: 90px;">{{ v.utime.substring(0,10) }}</span>
          <span class="nowrap" style="width: calc(100% - 90px - 60px);">{{ v.wms_co_name }}</span>
          <span class="tRight" style="width: 60px;">
            <b v-if="v.num>0">{{ v.num }}</b>
            <span v-else>{{ v.num }}</span>
          </span>
        </li>
      </ul>
      <div class="null" v-else-if="form.state==='2'"></div>
      <!-- 流向 -->
      <div class="tools_goods_content" v-else-if="form.state==='3'&&list.direct.length>0">
        <wmSteps :options="list.direct"></wmSteps>
      </div>
      <div class="null" v-else-if="form.state==='3'"></div>
      <!-- 日志 -->
      <div class="tools_goods_content" v-if="form.state==='4'&&list.logs.length>0">
        <wmSteps :options="list.logs"></wmSteps>
      </div>
      <div class="null" v-else-if="form.state==='4'"></div>
    </ScrollView>
  </PageView>
</template>

<style lang="less" scoped>
.tools_goods_body{position: fixed; z-index: 999; left: -1px; top: 0; width: calc(100% + 2px); height: 100%;}
.tools_goods_img{padding: 16px; background-color: #FFF;}
.tools_goods_img .sku{line-height: 40px; text-align: center;}
.tools_goods_img .sku span{position: relative; display: inline-block; padding: 0 28px;}
.tools_goods_img .sku b{display: inline-block; font-size: 20px;}
.tools_goods_img .sku i{position: absolute; right: 0; width: 28px; color: @Minor;}
.tools_goods_img .action_img{position: relative; margin: 0 auto; width: 200px; height: 200px; border-radius: 50%; border: @BaseBorder 1px solid;}
.tools_goods_img .action_img i{font-size: 64px; color: @IconColor;}
.tools_goods_img .action_img .close{position: absolute; top: 0; right: 0; padding: 4px;}
.tools_goods_img .text{position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: calc(100% - 40px); line-height: 32px; text-align: center; font-size: 12px; color: #FFF; background-color: @Minor; border-radius: 16px; opacity: 1;}
.tools_goods_img .text:active{opacity: 0.8;}
.tools_goods_img .total{margin-top: 16px; padding: 10px 0; display: flex; justify-content: center; font-size: 12px; color: @Info;}
.tools_goods_img .total span{padding: 0 8px;}
.tools_goods_img .total b{font-size: 14px; color: @Minor;}
.tools_goods_list{overflow: hidden; margin: 10px auto;}
.tools_goods_list li{background-color: #FFF; margin: 1px auto; padding: 0 16px; line-height: 48px; display: flex; justify-content: space-between;}
.tools_goods_list .label{color: @Info;}
.tools_goods_content{overflow: hidden; margin: 10px auto; padding: 10px; background-color: #FFF;}
.null{height: calc(100% - 40px - 280px - 120px);}
</style>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
/* JS组件 */
import Ui from '../../library/ui';
import Request from '../../library/request';
import Format from '../../library/format';
import Util from "../../library/utils";
import Files from '../../library/files';
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';
import wmInput from '../../components/form/input/index.vue';
import wmSteps from '../../components/steps/index.vue';

// 公共
const { proxy } = getCurrentInstance() as any ;
// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
const route = useRoute();
const priceEncode: Function = Format.priceEncode;
const telEncode: Function = Format.telEncode;
const cardEncode: Function = Format.cardEncode;
// 变量
const isShow = ref(false);
const scroll = ref({refreshing: false, loading: false, finished: false});
const total = ref({time:'', list:<any>{}});
const list = ref({info:<any>{}, direct:<any>[], stock:<any>[], logs:<any>[]});
const form = ref({key:'',  state:'0'});
const customTime = ref({active:'12', title:'近1年', list:[
  { label: '3个月', value: '3' },
  { label: '6个月', value: '6' },
  { label: '近1年', value: '12' },
  { label: '近2年', value: '24' },
  { label: '近3年', value: '36' },
]});

/* 创建完成 */
onMounted(()=>{
  const sku_id: string = route.query.sku_id as string || '';
  const tab: string = route.query.tab as string || '0';
  if(sku_id) {
    list.value.info.sku_id = sku_id;
    changeTabs(tab);
    loadData();
  }
});

/* 关闭软键盘 */
const closeKeyboard = (): void => {
  (document as any).activeElement.blur();
}

/* 搜索内容 */
const serachVal = (val: string): void => {
  if(!val.trim()) return;
  form.value.key = '';
  list.value.info.sku_id = val;
  loadData();
}

/* 扫码 */
const openScan = async (): Promise<void> => {
  const res = await proxy.$showScan({title:'扫描商品编码'});
  if(res.confirm) serachVal(res.content);
}

/* 更多 */
const showMore = async (): Promise<void> => {
  const res = await proxy.$actionSheet({
    title: '更多',
    active: 'time',
    actions:[
      {label: '日期( '+customTime.value.title+' )', value: 'time'},
      {label: '导出Excel', value: 'export'},
    ]
  });
  if(res.confirm) {
    if(res.content.value==='time') selectDate();
    else if(res.content.value==='export') showExport();
  }
}

/* 选择日期 */
const selectDate = async (): Promise<void> => {
  const res = await proxy.$actionSheet({title:'选择时间', active: customTime.value.active, actions: customTime.value.list});
  if(res.confirm) {
    customTime.value.title = res.content.label;
    customTime.value.active = res.content.value;
    // 刷新数据
    loadData();
  }
}

/* 切换菜单 */
const changeTabs = (tab: string): void => {
  form.value.state = tab;
}

/* 加载数据 */
const loadData = (): void => {
  if(!state.token) return;
  // 默认
  let sku_id: string = list.value.info.sku_id;
  if(!sku_id) return;
  sku_id = sku_id.trim().toUpperCase();
  total.value.time = '';
  list.value.info = {sku_id: sku_id};
  list.value.direct = [];
  list.value.stock = [];
  list.value.logs = [];
  // 资料
  Request.Post('goods/info', {
    token: state.token,
    sku_id: sku_id,
  }, (res:any)=>{
    const {code, time, msg, data} = res.data;
    total.value.time = time;
    if(code===0) {
      data.img = data.img?data.img+'&x-oss-process=image/resize,h_240':'';
      list.value.info = data;
      scroll.value.refreshing = false;
      if(data.length===0) {
        list.value.info.sku_id = sku_id;
        Ui.Toast('无商品信息!');
      }
    } else Ui.Toast(msg);
  });
  // 流向
  Request.Post('goods/direct', {
    token: state.token,
    sku_id: sku_id,
    time: customTime.value.active,
  }, (res:any)=>{
    const {code, time, msg, data} = res.data;
    total.value.time = time;
    if(code===0) {
      total.value.list = data.total;
      for(let v of data.list) {
        list.value.direct.push({time:v.ctime, label:v.type_name, value: v.warehouse+(v.num?'&nbsp;&nbsp;数量: '+v.num:'')});
      }
    } else Ui.Toast(msg);
  });
  // 分仓
  Request.Post('goods/stock', {
    token: state.token,
    sku_id: sku_id,
  }, (res:any)=>{
    const {code, time, msg, data} = res.data;
    total.value.time = time;
    if(code===0) {
      list.value.stock = data;
    } else Ui.Toast(msg);
  });
  // 日志
  Request.Post('goods/logs', {
    token: state.token,
    sku_id: sku_id,
    time: customTime.value.active,
  }, (res:any)=>{
    const {code, time, msg, data} = res.data;
    total.value.time = time;
    if(code===0) {
      for(let v of data) {
        list.value.logs.push({time:v.ctime, label:v.operator_name, value: v.content});
      }
    } else Ui.Toast(msg);
  });
}

/* 图片-上传 */
const upImg = (): void => {
  if(!list.value.info.sku_id || !list.value.info.name) return Ui.Toast('无商品资料!');
  // 选择文件
  Files.Select({}, (fileObj:any)=>{
    // 转Base64
    Files.FileToBase64(fileObj, (base64: any)=>{
      // 压缩图片
      Files.ImageCompress(base64, {width:1024, height:1024, type:fileObj.type}, (imgBase64: any)=>{
        // 请求
        Request.Post('goods/up_img', {
          token: state.token,
          sku_id: list.value.info.sku_id,
          base64: imgBase64,
        }, (res:any)=>{
          const {code, msg} = res.data;
          if(code===0) list.value.info.img = imgBase64;
          return Ui.Toast(msg);
        });
      }, (err: string)=>{
        Ui.Toast(err);
      });
    });
  }, (err: string)=>{
    Ui.Toast(err);
  });
}

/* 图片-删除 */
const removeImg = async (): Promise<void> => {
  const res = await proxy.$showModal({title:list.value.info.sku_id, content:'是否删除商品图片'});
  if(res.confirm) {
    // 请求
    Request.Post('goods/remove_img', {
      token: state.token,
      sku_id: list.value.info.sku_id,
    }, (res:any)=>{
      const {code, msg} = res.data;
      if(code===0) list.value.info.img = '';
      return Ui.Toast(msg);
    });
  }
}

/* 图片-预览 */
const previewImage = (img: string): void => {
  const arr: Array<any> = img.split('&');
  proxy.$previewImage({images:[arr[0]]});
}

/* 导出 */
const showExport = async (): Promise<void> => {
  const res = await proxy.$showModal({title:'剩余库存', confirmText:'导出', content:'数据条数'});
  if(res.confirm) {
    Ui.Toast('正在开发');
  }
}

/* 复制 */
const Copy = (text: string): void => {
  if(!text) return;
  Util.CopyText(text);
  Ui.Toast('已复制 '+text);
}

/* 拨打号码 */
const openTel = (tel: string): void => {
  window.location.href = 'tel:'+tel;
}

</script>