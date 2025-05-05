<template>
  <Teleport to="body">
    <div v-if="visible" class="wm-picker_body">
      <div class="wm-picker_mask" :style="{opacity: opacity}" @click="close()"></div>
      <div class="wm-picker_content" :style="{transform: 'translateY('+translateY+')'}">
        <div class="wm-picker_title">
          <button class="cancel" :style="{color: cancelColor}" @click="subCancel()">{{ cancelText }}</button>
          <button class="confirm" :style="{color: confirmColor}" @click="subConfirm()">{{ confirmText }}</button>
          <h2>{{ title }}</h2>
        </div>
        <div class="wm-picker_columns" :style="{height: 'calc('+optionHeight+' * '+optionNum+')'}">
          <div class="wm-picker_column_mask" :style="{backgroundSize: '100% 110px'}"></div>
          <div class="wm-picker_column_frame" :style="{height: optionHeight}"></div>
          <div class="wm-picker_column" v-for="(v,k) in objList">
            <ul :ref="(el)=>setObjRef(el, k)" class="wm-picker_list" :style="{transform: 'translate3d(0px, 110px, 0px)'}" @touchstart.passive="TouchStart($event, k)" @touchmove.passive="TouchMove" @touchend="TouchEnd($event, k)">
              <li v-for="row in v" :style="{height: optionHeight, lineHeight: optionHeight}">{{ row.label }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="less" scoped>
.wm-picker_body{position: absolute; top: 0; left: 0; z-index: 999; width: 100%; height: 100%;}
.wm-picker_mask{position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); transition: opacity 0.3s;}
.wm-picker_content{overflow: hidden; position: absolute; z-index: 2; bottom: 0; width: 100%; transform: translateY(0%); text-align: center; background-color: #F8F8F8; border-radius: 8px 8px 0 0; transition: transform 0.3s;}
.wm-picker_title{position: relative; height: 50px; line-height: 50px; text-align: center; background-color: #FFF;}
.wm-picker_title button{position: absolute; z-index: 1; padding: 0 16px; height: 100%; line-height: 100%; user-select: none; border: none; background: #FFF; font-size: 14px;}
.wm-picker_title .cancel{left: 0;}
.wm-picker_title .confirm{right: 0;}
.wm-picker_title h2{font-size: 16px; font-weight: 500;}
.wm-picker_columns{position: relative; cursor: grab; display: flex; background: linear-gradient(to bottom, #F2F2F2 0%, #FFF 50%, #F2F2F2 100%);}
.wm-picker_column{overflow: hidden; flex: 110%;}
.wm-picker_column_mask{position: absolute; z-index: 1; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; background-image: linear-gradient(180deg, rgba(255, 255, 255, .9), rgba(255, 255, 255, .4)), linear-gradient(0deg, rgba(255, 255, 255, .9), rgba(255, 255, 255, .4)); background-repeat: no-repeat; background-position: center top, center bottom;}
.wm-picker_column_frame{position: absolute; z-index: 2; width: 100%; top: 50%; left: 0; transform: translateY(-50%); pointer-events: none; box-shadow: 0 0 2px rgba(0, 0, 0, .1);}
.wm-picker_list{overflow: hidden; user-select: none;}
.wm-picker_list li{text-align: center; font-size: 16px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
.wm-picker_list li:active{background-color: @Active;}
.wm-picker_list .active{color: @Primary; background-color: @Primary6;}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

/* 参数 */
const props = defineProps({
  visible: { type: Boolean, default: false },             // 是否显示
  title: { type: String, default: '标题' },               // 标题
  active: { type: Array<any>, default: [] },              // 默认值
  columns: { type: Array<any>, default: [] },             // 选项 [{label:'男', value:'男', children[]}, {label:'女', value:'女', children[]}]
  cancelText: { type: String, default: '取消' },          // 取消按钮文本
  cancelColor: { type: String, default: '#73767A' },      // 确认按钮颜色
  confirmText: { type: String, default: '确定' },         // 确认按钮文本
  confirmColor: { type: String, default: '#0064C8' },     // 确认按钮颜色
  optionHeight: { type: String, default: '44px' },        // 配置-单行高度
  optionNum: { type: Number, default: 6 },                // 配置-数量
  changeCallBack: { type: Function, default: ()=>{} },    // 回调-改变
});
const emit = defineEmits(['confirm', 'cancel', 'update:visible']);
/* 变量 */
const opacity = ref('0');
const translateY = ref('100%');
// 对象
let isObj = ref(false);
const objList = ref(<any>[]);
let objHeight=0, objTop=0, objTime:any;
const objRefs = ref<HTMLElement[]>([]);
const objPos = ref(<any>[]); 
// 移动
let startY=0, distance=0, velocity=0, lastTime=0;
// 位置
let objY=0, moveY=0, minY=0, maxY=0;

/* 创建完成 */
onMounted(()=>{
  // 数据
  if(Array.isArray(props.columns[0])) {
    isObj.value = false;
    objList.value = props.columns;
  } else {
    isObj.value = true;
    setList(getPos());
  }
  setTimeout(()=>{
    // 动画
    opacity.value = '1';
    translateY.value = '0%';
    // 默认值
    objHeight = parseInt(props.optionHeight.split('px')[0]);
    objTop = objHeight*props.optionNum/2-objHeight/2;
    activeValue();
  }, 300);
});

/* 默认值 */
const activeValue = (): void => {
  for(let k1 in props.active) {
    for(let k2 in objList.value[k1]) {
      if(props.active[k1]==objList.value[k1][k2].value) {
        setTransform(parseInt(k1), parseInt(k2));
        continue;
      }
    }
  }
}

/* 获取数据 */
const setList = (pos: Array<any>=[0, 0, 0]): void => {
  let arr1=<any>[], arr2=<any>[], arr3=<any>[];
  // 一级
  arr1
  for(let k1 in props.columns) {
    arr1.push({label: props.columns[k1].label, value: props.columns[k1].value});
    // 二级
    if(!props.columns[k1].children) continue;
    for(let k2 in props.columns[k1].children) {
      if(pos[1]==k1) arr2.push({label: props.columns[k1].children[k2].label, value: props.columns[k1].children[k2].value});
      // 三级
      if(!props.columns[k1].children[k2].children) continue;
      for(let k3 in props.columns[k1].children[k2].children) {
        if(pos[1]==k1 && pos[2]==k2) arr3.push({label: props.columns[k1].children[k2].children[k3].label, value: props.columns[k1].children[k2].children[k3].value});
      }
    }
  }
  objList.value = [];
  if(arr1.length) objList.value.push(arr1);
  if(arr2.length) objList.value.push(arr2);
  if(arr3.length) objList.value.push(arr3);
}

/* 获取位置 */
const getPos = (): Array<any> => {
  let pos: Array<any> = [0, 0, 0];
  if(!props.active.length) return pos;
  for(let k1 in props.columns) {
    if(props.active[0]==props.columns[k1].value)  pos[0] = 0;
    if(!props.columns[k1].children) continue;
    for(let k2 in props.columns[k1].children) {
      if(props.active[1]==props.columns[k1].children[k2].value) pos[1] = k1;
      if(!props.columns[k1].children[k2].children) continue;
      for(let k3 in props.columns[k1].children[k2].children) {
        if(props.active[2]==props.columns[k1].children[k2].children[k3].value) pos[2] = k2;
      }
    }
  }
  return pos;
}

/* 动态绑定 */
const setObjRef = (el: any, index: number): void => {
  if (el) objRefs.value[index] = el;
};
/* 调整位置 */
const setTransform = (index: number, k: number): void => {
  const obj = objRefs.value[index];
  if(!obj) return;
  const n = objTop-k*objHeight;
  obj.style.transform = 'translate3d(0px, '+n+'px, 0px)';
  obj.style.transitionDuration = '200ms';
}

/* 开始 */
const TouchStart = (e: any, index: number): void => {
  // 重置
  clearTimeout(objTime);
  const obj = e.currentTarget;
  obj.style.transitionDuration = '0ms';
  // 位置
  startY = parseInt(e.touches[0].pageY);
  objY = obj.style.transform.split(',')[1].split('px')[0];
  minY = objTop + objHeight/2;
  maxY = objTop - objHeight*objList.value[index].length + objHeight/2;
  // 时间
  lastTime = Date.now();
};

/* 移动 */
const TouchMove = (e: any): void => {
  const currentY: number = e.touches[0].pageY;
  distance = currentY - startY;
  moveY = parseInt(objY.toString())+parseInt(distance.toString());
  if(moveY>minY) moveY=minY;
  if(moveY<maxY) moveY=maxY+1;
  e.currentTarget.style.transform = 'translate3d(0px, '+moveY+'px, 0px)';
  // 惯性
  const currentTime = Date.now();
  velocity = distance/(currentTime-lastTime);
  lastTime = currentTime;
};

/* 结束 */
const TouchEnd = (e: any, index: number): void => {
  let move = moveY+Math.ceil(velocity*20);
  let time = Math.ceil(velocity*100);
  if(move>minY) move=minY;
  if(move<maxY) move=maxY+1;
  const obj = e.currentTarget;
  obj.style.transform = 'translate3d(0px, '+move+'px, 0px)';
  obj.style.transitionDuration = time+'ms';
  // 调整位置
  objTime = setTimeout(()=>{
    const n = objHeight*Math.ceil(move/objHeight)-objHeight/2;
    obj.style.transform = 'translate3d(0px, '+n+'px, 0px)';
    obj.style.transitionDuration = '200ms';
    // 联动菜单
    if(isObj.value) {
      getValue();
      if(index===0) {
        // 一级
        setList([0, objPos.value[0], 0]);
        setTransform(1, 0);
        setTransform(2, 0);
      }else if(index===1) {
        // 二级
        setList([0, objPos.value[0], objPos.value[1]]);
        setTransform(2, 0);
      }
    }
    props.changeCallBack(getValue());
  }, time);
};

/* 获取值 */
const getValue = (): Array<any> => {
  let keys: Array<any> = [];
  let value: Array<any> = [];
  let y: number = 0;
  let index: number = 0;
  for(let k in objRefs.value) {
    y = parseInt(objRefs.value[k].style.transform.split(',')[1].split('px')[0]);
    index = (objTop-y)/objHeight;
    keys.push(index);
    value.push(objList.value[k][index].value);
  }
  objPos.value = keys;
  return value;
}

/* 确定 */
const subConfirm = (): void => {
  emit('confirm', getValue());
  close();
};

/* 取消 */
const subCancel = (): void => {
  emit('cancel');
  close();
};

/* 关闭 */
const close = () => {
  opacity.value = '0';
  translateY.value = '100%';
  setTimeout(()=>{
    emit('update:visible', false);
  }, 300);
};

</script>