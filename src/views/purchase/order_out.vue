<template>
  <PageView bgColor="linear-gradient(to bottom, #F8F8F8 0%, #F8F8F8 100%)">
    <template #bar_left><i class="back ui ui_arrow_left" @click="router.go(-1)"></i></template>
    <template #bar_title>
      <div class="goods_search">
        <i class="ui ui_scan" @click="openScan()"></i>
        <i class="ui ui_search" @click="closeKeyboard()"></i>
        <wm-input v-model:value="form.key" @update:blur="serachVal($event)" @keyup.enter="serachVal($event.target.value)" placeholder="商品编码、供应商" padding="10px 40px" radius="8px" enterkeyhint="search"></wm-input>
      </div>
    </template>
    <template #bar_right>
      <i class="ui ui_more more" @click="showMore()"></i>
    </template>
    <ScrollView ref="scrollObj" v-model:refreshing="scroll.refreshing" @refresh="onRefresh" v-model:loading="scroll.loading" v-model:finished="scroll.finished" @load="onLoad" @lower="64" @click="closeKeyboard()">
      <div class="refresh_time">{{ total.time || 'loading' }}</div>
      <div class="goods_total">
        <div class="title">销售出仓</div>
        <div class="num">{{ total.list.num || 0 }}</div>
        <div class="other">
          <ul class="goods_total_list">
            <li class="label">成本价(元)</li>
            <li class="value"><b>{{ total.list.cost_price?formatPrice(total.list.cost_price):'-' }}</b></li>
            <li class="label">标签价(元)</li>
            <li class="value"><b>{{ total.list.sale_price?formatPrice(total.list.sale_price):'-' }}</b></li>
            <li class="label">供应链价(元)</li>
            <li class="value"><b>{{ total.list.supply_price?formatPrice(total.list.supply_price):'-' }}</b></li>
            <li class="label">结算价(元)</li>
            <li class="value"><b>{{ total.list.supplier_price?formatPrice(total.list.supplier_price):'-' }}</b></li>
            <li class="label">采购价(w)</li>
            <li class="value"><b>{{ total.list.purchase_price?formatPrice(total.list.purchase_price):'-' }}</b></li>
            <li class="label">吊牌价(w)</li>
            <li class="value"><b>{{ total.list.market_price?formatPrice(total.list.market_price):'-' }}</b></li>
          </ul>
        </div>
      </div>
      <ul class="goods_tabs">
        <li :class="form.state===''?'active':''" @click="changeTabs('')">全部</li>
        <li :class="form.state==='0'?'active':''" @click="changeTabs('0')">待结算</li>
        <li :class="form.state==='1'?'active':''" @click="changeTabs('1')">
          <div class="num">待推送<span class="redNum">{{ total.list.pay_num || 0 }}</span></div>
        </li>
        <li :class="form.state==='2'?'active':''" @click="changeTabs('2')">结算中</li>
        <li :class="form.state==='3'?'active':''" @click="changeTabs('3')">完成</li>
      </ul>
      <ul class="goods_list" v-if="page.list.length>0">
        <li v-for="(v,k) in page.list">
          <div class="ct_body">
            <div class="action_img" :style="{backgroundImage: v.img?'url('+v.img+'&x-oss-process=image/resize,h_80)':''}" @click="previewImage(v.img, v.sku_id)">
              <div class="index">{{ k+1 }}</div>
              <div class="state state0" v-if="v.state_order==='-1'">{{ v.state_name }}</div>
              <div class="state" :class="form.state==='1'?'state4':'state1'" v-else-if="v.state_order==='0'">
                <span v-if="form.state==='1'">{{ dayDiff(v.stime) }}</span>
                <span v-else>{{ v.state_name }}</span>
              </div>
              <div class="state state2" v-else-if="v.state_order==='1'">{{ v.state_name }}</div>
              <div class="state state3" v-else-if="v.state_order==='2'">{{ v.state_name }}</div>
              <div class="state state4" v-else-if="v.state_order==='3'">{{ v.state_name }}</div>
              <div class="state state5" v-else-if="v.state_order==='4'">{{ v.state_name }}</div>
              <div class="state state6" v-else-if="v.state_order==='5'">{{ v.state_name }}</div>
              <div class="state" v-else>{{ v.state_name }}</div>
              <i class="ui ui_image" v-if="!v.img"></i>
            </div>
            <div class="text_body">
              <div class="title flex">
                <div class="sku"><b>{{ v.sku_id }}</b><i class="ui ui_copy" @click.stop="Copy(v.sku_id)"></i></div>
                <span class="time">
                  <span class="c_success" v-if="v.state_sign==='1'">{{ v.sign_name }}</span>
                  <span class="c_danger" v-else-if="v.state_sign==='2'">{{ v.sign_name }}</span>
                  <span class="c_primary" v-else>{{ v.sign_name }}</span>
                  | {{ v.utime.substring(5,10) }}
                </span>
              </div>
              <div @click="router.push({path: '/base/goods', query: {sku_id: v.sku_id}})">
                <div class="info flex">
                  <div class="text nowrap">{{ v.properties_value }} > <span :class="v.supplier_info?'c_success':'c_danger'">{{ v.supplier_name }}</span></div>
                  <div class="num">x<b>{{ v.num }}</b></div>
                </div>
                <div class="other nowrap">
                  成本价(元): <b>{{ v.cost_price?formatPrice(v.cost_price):0 }}</b>&nbsp;&nbsp;
                  <template v-if="v.supply_price!=='0.00'">
                    供应链(元): <b>{{ v.supply_price?formatPrice(v.supply_price):0 }}</b>&nbsp;&nbsp;
                  </template>
                  <template v-else>
                    采购价(w): <b>{{ v.purchase_price?formatPrice(v.purchase_price):0 }}</b>&nbsp;&nbsp;
                  </template>
                  标签价(元): <b>{{ v.sale_price?formatPrice(v.sale_price):0 }}</b>
                </div>
              </div>
            </div>
          </div>
          <div class="action" v-if="v.state_order==='1'">
            <span><wmButton type="primary" effect="plain" height="28px" fontSize="14px" @click="router.push({path: '/base/goods', query: {sku_id: v.sku_id, tab: '4'}})">日志</wmButton></span>
            <span><wmButton type="danger" effect="plain" height="28px" fontSize="14px" @click="subRevoke(v.id, v.ctime, v.utime, v.sku_id, v.supplier_name)">撤回</wmButton></span>
          </div>
        </li>
      </ul>
      <div class="null" v-else></div>
      <div class="bLine" v-if="page.list.length>0&&scroll.finished"></div>
      <div class="pay_show" v-if="form.state==='1'" @click="payShow()">推送</div>
    </ScrollView>
    <!-- 结算单 -->
    <wmPopover v-model:show="pay.show" :title="pay.title">
      <ul class="goods_list pay_list">
        <li v-for="(v,k) in pay.list">
          <div class="checkbox">
            <wmCheckbox :options="{label:'', value:v.id, checked:v.checked, disabled:v.disabled}" @checkbox="payCheckbox"></wmCheckbox>
          </div>
          <div class="action_img" :style="{backgroundImage: v.img?'url('+v.img+'&x-oss-process=image/resize,h_80)':''}" @click="router.push({path: '/base/goods', query: {sku_id: v.sku_id}})">
            <div class="index">{{ k+1 }}</div>
            <div class="state state0" v-if="v.state_order==='-1'">{{ v.state_name }}</div>
            <div class="state" :class="form.state==='1'?'state4':'state1'" v-else-if="v.state_order==='0'">
              <span v-if="form.state==='1'">{{ dayDiff(v.stime) }}</span>
              <span v-else>{{ v.state_name }}</span>
            </div>
            <div class="state state2" v-else-if="v.state_order==='1'">{{ v.state_name }}</div>
            <div class="state state3" v-else-if="v.state_order==='2'">{{ v.state_name }}</div>
            <div class="state state4" v-else-if="v.state_order==='3'">{{ v.state_name }}</div>
            <div class="state state5" v-else-if="v.state_order==='4'">{{ v.state_name }}</div>
            <div class="state state6" v-else-if="v.state_order==='5'">{{ v.state_name }}</div>
            <div class="state" v-else>{{ v.state_name }}</div>
            <i class="ui ui_image" v-if="!v.img"></i>
          </div>
          <div class="text_body">
            <div class="title flex">
                <div class="sku"><b>{{ v.sku_id }}</b><i class="ui ui_copy" @click.stop="Copy(v.sku_id)"></i></div>
                <span class="time">
                  <span class="c_success" v-if="v.state_sign==='1'">{{ v.sign_name }}</span>
                  <span class="c_danger" v-else-if="v.state_sign==='2'">{{ v.sign_name }}</span>
                  <span class="c_primary" v-else>{{ v.sign_name }}</span>
                  | {{ v.utime.substring(5,10) }}
                </span>
              </div>
              <div class="info flex">
                <div class="text nowrap">{{ v.properties_value }} > <span :class="v.supplier_info?'c_success':'c_danger'">{{ v.supplier_name }}</span></div>
                <div class="num">x<b>{{ v.num }}</b></div>
              </div>
              <div class="other nowrap">
                成本(元): <b>{{ v.cost_price?formatPrice(v.cost_price):0 }}</b>&nbsp;&nbsp;
                供应链(元): <b>{{ v.supply_price?formatPrice(v.supply_price):0 }}</b>
              </div>
          </div>
        </li>
      </ul>
      <template #bottom>
        <div class="pay_sub">
          <div class="select flex">
            <wmCheckbox v-model:value="pay.checkbox.value" :partially="pay.checkbox.partially" :options="pay.checkbox.options" @checkbox="payCheckboxAll()">
              <span class="text">{{pay.form.total>0?'已选择 '+pay.form.total:'全选' }}</span>
            </wmCheckbox>
          </div>
          <div class="button">
            <wmButton height="50px" fontSize="14px" radius="0" @click="paySub()">结算数量( <b>{{ pay.form.num }}</b> )</wmButton>
          </div>
        </div>
      </template>
    </wmPopover>
    <!-- 结算单 End -->
  </PageView>
</template>

<style lang="less" scoped>
.null{height: calc(100% - 40px - 248px - 48px - 20px);}
.pay_show{opacity: 0.9; position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); width: 64px; height: 64px; line-height: 64px; text-align: center; color: #FFF; background-color: @Primary; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.5);}
.pay_show:active{opacity: 1;}
.pay_list{margin: 10px auto;}
.pay_list li{padding: 10px 0; margin: 1px auto; background-color: #FFF; display: flex; justify-content: space-between;}
.pay_list .checkbox{width: 40px; display: flex; justify-content: center; align-items: center;}
.pay_list .text_body{padding: 0 16px 0 10px; width: calc(100% - 40px - 72px - 26px);}
.pay_sub{line-height: 50px; display: flex; justify-content: space-between; align-items: center;}
.pay_sub .select{padding: 0 5px; display: flex; justify-content: space-between; align-items: center;}
.pay_sub .text{padding: 0 10px;}
.pay_sub .button{width: 50%;}
</style>

<script setup lang="ts">
import { ref, onMounted, onActivated, getCurrentInstance, nextTick } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
/* JS组件 */
import Ui from '../../library/ui';
import Request from '../../library/request';
import Format from '../../library/format';
import Time from '../../library/time';
import Util from "../../library/utils";
import Files from "../../library/files";
/* 组件 */
import PageView from '../../components/view/page.vue';
import ScrollView from '../../components/view/scroll.vue';
import wmInput from '../../components/form/input/index.vue';
import wmButton from '../../components/form/button/index.vue';
import wmPopover from '../../components/popover/index.vue';
import wmCheckbox from '../../components/form/checkbox/index.vue';

// 公共
defineOptions({name: 'OrderOut'});
const { proxy } = getCurrentInstance() as any ;
// 状态
const store = useStore();
const state = store.state;
const router = useRouter();
const route = useRoute();
// 变量
const scroll = ref({refreshing: false, loading: false, finished: false});
const scrollObj = ref();
const scrollTop = ref(0);
const total = ref({time:'', list:<any>{}});
const page = ref({total:0, num:1, limit:30, list:<any>[]});
const form = ref({stime:'', etime:'', key:'', state:'', state_order:<any>'', state_sign:''});
const customTime = ref({active:'today', title:'今天', list:[
  { type: 'time', label: '自定义', stime: Time.Date('Y/m/d'), etime: Time.Date('Y/m/d') },
  { label: '今天', value: 'today' },
  { label: '昨天', value: 'yesterday' },
  { label: '近7天', value: 'week' },
  { label: '近1月', value: 'month' },
  { label: '近1年', value: 'year' },
]});
// 结算
const pay = ref({
  show: false,
  title: '采购员结算单',
  list: <any>[],
  checkbox: {value: '', partially: false, options: {label:'', value:'all', checked:false}},
  form: {total: 0, num: 0, data: {}, supplier_name: {}, ctime:<any>[], utime:<any>[]},
});

/* 创建完成 */
onMounted(()=>{
  
});
onActivated(()=>{
  // 是否刷新
  if(state.routeAction==='next'){
    const time: string = route.query.time as string || 'today';
    const state: string = route.query.state as string || '';
    setTime(time);
    changeTabs(state);
    onRefresh();
    // 重置位置
    scrollTop.value = 0;
  } else {
    // 跳转位置
    scrollObj.value.setScrollTop(scrollTop.value);
  }
});
/* 离开页面 */
onBeforeRouteLeave((to, from) =>{
  // 记忆位置
  scrollTop.value = scrollObj.value.getScrollTop();
  return true;
});

/* 关闭软键盘 */
const closeKeyboard = (): void => {
  (document as any).activeElement.blur();
}

/* 下拉刷新 */
const onRefresh = (): void => {
  page.value.num = 1;
  scroll.value.finished = false;
  loadData();
}
/* 上拉加载 */
const onLoad = (): void => {
  page.value.num += 1;
  loadData();
}

/* 搜索内容 */
const serachVal = (val: string): void => {
  form.value.key = val.trim();
  onRefresh();
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
    // 设置日期
    setTime(res.content.value);
    // 刷新数据
    onRefresh();
  }else if(res.close && res.content) {
    // 自定义时间
    customTime.value.title = res.content.label;
    customTime.value.active = '';
    form.value.stime = res.content.stime;
    form.value.etime = res.content.etime;
    // 刷新数据
    onRefresh();
  }
}

/* 设置日期 */
const setTime = (value: string): void => {
  customTime.value.active = value;
  switch(value) {
    case 'today':
      customTime.value.title = '今天';
      form.value.stime = Time.Date('Y/m/d');
      form.value.etime = Time.Date('Y/m/d');
      break;
    case 'yesterday':
      customTime.value.title = '昨天';
      form.value.stime = Time.Date('Y/m/d', Time.StrToTime('-1 day'));
      form.value.etime = Time.Date('Y/m/d', Time.StrToTime('-1 day'));
      break;
    case 'week':
      customTime.value.title = '近7天';
      form.value.stime = Time.Date('Y/m/d', Time.StrToTime('-7 day'));
      form.value.etime = Time.Date('Y/m/d');
      break;
    case 'month':
      customTime.value.title = '近1月';
      form.value.stime = Time.Date('Y/m/d', Time.StrToTime('-1 month'));
      form.value.etime = Time.Date('Y/m/d');
      break;
    case 'year':
      customTime.value.title = '近1年';
      form.value.stime = Time.Date('Y/m/d', Time.StrToTime('-1 year'));
      form.value.etime = Time.Date('Y/m/d');
      break;
  }
}

/* 切换菜单 */
const changeTabs = (state: string): void => {
  form.value.state = state;
  form.value.state_order = '';
  form.value.state_sign = '';
  if(state==='0') {
    form.value.state_order = ['-1', '0'];
    form.value.state_sign = '0';
  } else if(state==='1') {
    form.value.state_order = ['0'];
    form.value.state_sign = '1';
  } else if(state==='2') {
    form.value.state_order = ['1', '2'];
  } else if(state==='3') {
    form.value.state_order = ['3'];
  }
  // 刷新数据
  onRefresh();
}

/* 加载数据 */
const loadData = (): void => {
  if(!state.token) return;
  // 统计
  total.value.time = '';
  page.value.total = 0;
  total.value.list.num = 0;
  total.value.list.cost_price = 0;
  total.value.list.supply_price = 0;
  total.value.list.sale_price = 0;
  total.value.list.purchase_price = 0;
  total.value.list.supplier_price = 0;
  total.value.list.market_price = 0;
  total.value.list.pay_num = 0;
  Request.Post('order_out/total', {
    token: state.token,
    data: form.value,
  }, (res:any)=>{
    const {code, time, msg, data} = res.data;
    if(code===0) {
      page.value.total = data.total;
      total.value.list.num = data.num;
      total.value.list.cost_price = data.cost_price;
      total.value.list.supply_price = data.supply_price;
      total.value.list.sale_price = data.sale_price;
      total.value.list.purchase_price = data.purchase_price;
      total.value.list.supplier_price = data.supplier_price;
      total.value.list.market_price = data.market_price;
      total.value.list.pay_num = data.pay_num;
    } else Ui.Toast(msg);
  });
  // 列表
  total.value.list.num = 0;
  if(page.value.num===1) page.value.list=[];
  Request.Post('order_out/list', {
    token: state.token,
    data: form.value,
    page: page.value.num,
    limit: page.value.limit,
  }, (res:any)=>{
    const {code, time, msg, data} = res.data;
    total.value.time = time;
    if(code===0) {
      if(page.value.num===1) {
        scroll.value.refreshing = false;
        page.value.list = data;
      } else {
        // 已加载
        scroll.value.loading = false;
        if(data.length===0) scroll.value.finished = true;
        // 追加
        for(let v of data) page.value.list.push(v);
      }
    } else Ui.Toast(msg);
  });
}

/* 结算单-显示 */
const payShow = (): void => {
  if(!total.value.list.pay_num) return Ui.Toast('无可推送结算单');
  pay.value.show = true;
  pay.value.list = [];
  for(let v of page.value.list) {
    v.checked = false;
    v.disabled = !v.supplier_info;
    pay.value.list.push(v);
  }
}
/* 结算单-勾选 */
const payCheckbox = (label: any, value: any): void => {
  for(let v of pay.value.list) {
    if(v.id==value){
      v.checked = !v.checked;
      break;
    }
  }
  payGetNum();
}
/* 结算单-全选/全不选 */
const payCheckboxAll = (): void => {
  for(let v of pay.value.list) {
    if(!v.disabled) v.checked = pay.value.checkbox.value==='all'?true:false;
  }
  payGetNum();
}
/* 结算单-统计数量 */
const payGetNum = (): void => {
  pay.value.form.total = 0;
  pay.value.form.num = 0;
  pay.value.form.data = {};
  pay.value.form.ctime = [];
  pay.value.form.utime = [];
  pay.value.form.supplier_name = {};
  for(let v of pay.value.list) {
    if(v.checked) {
      pay.value.form.total++;
      pay.value.form.num += parseInt(v.num);
      pay.value.form.data[v.id] = v.sku_id;
      pay.value.form.ctime.push(v.ctime);
      pay.value.form.utime.push(v.utime);
      pay.value.form.supplier_name[v.supplier_name] = 1;
    }
  }
  // 部分选择
  if(pay.value.form.total===pay.value.list.length) {
    pay.value.checkbox.value = 'all';
    pay.value.checkbox.partially = false;
    pay.value.checkbox.options.checked = true;
  } else if(pay.value.form.total===0) {
    pay.value.checkbox.value = '';
    pay.value.checkbox.partially = false;
    pay.value.checkbox.options.checked = false;
  } else {
    pay.value.checkbox.value = 'all';
    pay.value.checkbox.partially = true;
    pay.value.checkbox.options.checked = true;
  }
}
/* 结算单-提交 */
const paySub = async (): Promise<void> => {
  if(!pay.value.form.num) return Ui.Toast('请选择货品!');
  const res = await proxy.$showModal({title:'推送财务结算', content:'货品数量: <b>'+pay.value.form.num+'</b>&nbsp;&nbsp;供应商数: <b>'+Object.keys(pay.value.form.supplier_name).length+'</b>'});
  if(res.confirm) {
    const load: any = Ui.Loading();
    Request.Post('order_out/push', {
      token: state.token,
      data: pay.value.form.data,
      ctime: pay.value.form.ctime,
      utime: pay.value.form.utime,
    }, (res:any)=>{
      load.clear();
      const {code, time, msg} = res.data;
      if(code===0) {
        pay.value.show = false;
        onRefresh();
      }
      Ui.Toast(msg);
    });
  }
}

/* 结算单-撤回 */
const subRevoke = async (id: number, ctime: string, utime: string, sku_id: string, supplier_name: string): Promise<void> => {
  const res = await proxy.$showModal({title:'撤回', content:sku_id+'、'+supplier_name});
  if(res.confirm) {
    const data: any = {};
    data[id] = sku_id;
    const load: any = Ui.Loading();
    Request.Post('order_out/revoke', {
      token: state.token,
      data: data,
      ctime: ctime,
      utime: utime,
    }, (res:any)=>{
      load.clear();
      const {code, time, msg} = res.data;
      if(code===0) onRefresh();
      Ui.Toast(msg);
    });
  }
}

/* 导出 */
const showExport = async (): Promise<void> => {
  if(!page.value.total) return Ui.Toast('无导出数据!');
  const title: string = '销售出仓';
  const content: string = '数据条数: <b>'+page.value.total+'</b>';
  const res = await proxy.$showModal({title:title, confirmText:'导出', content:content});
  if(res.confirm) {
    Request.Post('order_out/export', {
      token: state.token,
      data: form.value,
    }, (res:any)=>{
      const {code, msg, data} = res.data;
      if(code===0) {
        Files.ShareFile(data.path, data.filename, title, content).then((res: boolean)=>{
          if(!res) {
            Ui.Toast('分享失败!');
            Files.Down(data.path+data.filename, data.filename);
          }
        });
      } else Ui.Toast(msg);
    });
  }
}

/* 价格 */
const formatPrice = (val: number): string => {
  return val>=10000?Format.priceEncode((val/10000).toString())+'万':Format.priceEncode(val.toString());
}

/* 日期比较 */
const dayDiff = (t: string): string => {
  let old:number = Time.StrToTime(t);
  let now:number = Time.StrToTime(Time.Date('Y-m-d')+' 23:59:59');
  let d: number = Math.ceil((now-old)/(3600*24));
  let content: string = '';
  if(d===1) content = '今天';
  else if(d===2) content = '昨天';
  else if(d>=3) content = d+'天';
  else content = '其它';
  return content;
}

/* 复制 */
const Copy = (sku_id: string): void => {
  Util.CopyText(sku_id);
  Ui.Toast('已复制 '+sku_id);
}

/* 图片-预览 */
const previewImage = (img: string, sku_id: string): void => {
  // 明细
  if(!img) {
    Ui.Toast('请先上传图片');
    state.goods.show = true;
    state.goods.sku_id = sku_id;
    return;
  }
  // 图片
  let i: number = 0;
  let index: number = 0;
  let imgs: Array<any> = [];
  for(let v of page.value.list) {
    if(v.img) {
      imgs.push({
        label: '商品编码: '+v.sku_id+' 颜色及规格: '+v.properties_value+' 成本: '+v.cost_price+'元 标签: '+v.sale_price+'元',
        value: v.img,
      });
      if(v.img===img) index = i;
      i++;
    }
  }
  proxy.$previewImage({index: index, images: imgs});
}

</script>