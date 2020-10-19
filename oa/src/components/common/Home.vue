<template>
    <div class="wrapper">
        <v-head></v-head>
        <transition  name="custom-classes-transition"
                     leave-active-class="animated fadeOutLeft"
                     enter-active-class="animated fadeInLeft">
        <v-sidebar v-if="!foldSide"></v-sidebar>
            </transition>
        <transition name="foldContent">
        <div class="content" v-bind:class="['main',{foldContent:foldContent}]">
            <el-button type="primary" size="small" icon="menu" @click="foldSideBar" style="margin-bottom: 10px"></el-button>
                <el-row v-show="$route.path=='/readme'" :gutter="40">
                    <el-col :sm="10" :md="10" :lg="6" >
                        <el-alert
                        title="华盛婚礼会馆后台"
                        type="info"
                        description="欢迎登陆华盛婚礼会馆后台系统"
                        show-icon
                        :closable="false">
                    </el-alert></el-col>
                    <el-col :sm="8" :md="8" :lg="4">
                        <el-card :body-style="{ padding: '0px' }">
                            <img src="../../../static/img/QR-code.png" class="image" style="display: block;width: 100%">
                            <div style="padding: 14px;">
                                <span>OA二维码</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
             <el-row>
            </el-row>

            <transition name="move" mode="out-in"><router-view ></router-view></transition>
        </div>
            </transition>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        data(){
            return{
                foldSide:false,
                foldContent:false
            }
        },
        components:{
            vHead, vSidebar
        },
        methods:{
            foldSideBar:function () {
                console.log(1)
                this.foldSide=!this.foldSide;
                console.log(this.foldSide)
                this.foldContent=!this.foldContent
                console.log(this.foldContent)
            }
        },
        computed: {
            key() {
                return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
            }
        },
        mounted(){
        }
    }
</script>
<style>
    .foldContent{
        left: 0;
    }
    .main{
        transition: all .5s ease ;
    }
</style>
