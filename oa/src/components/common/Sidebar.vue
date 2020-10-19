<template>
    <div class="sidebar">
        <el-menu  class="el-menu-vertical-demo" unique-opened :default-active="$route.path">
            <template v-for="item in addRouters">
                <template v-if="item.children">
                    <el-submenu :index="item.path">
                        <template slot="title">
                            <svg class="s-icon" aria-hidden="true">
                            <use :xlink:href="item.icon"></use>
                        </svg>
                            {{item.name}}</template>
                        <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="item.path +'/'+subItem.path" @click="clickLink(item.path +'/'+subItem.path)">{{ subItem.name}}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.path">
                        <i :class="item.icon"></i>{{ item.name}}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        data() {
            return {
            }
        },
        methods:{
            clickLink(path) {
                this.$router.push({
                    path,
                    query: {
                        t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
                    }
                })
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },
            ...mapGetters([
                'addRouters'
            ])
        }
    }
</script>

<style scoped>
    .s-icon{
        width: 1rem; height: 1rem;
        fill: currentColor;
        overflow: hidden;
        padding-right: 3px;
        vertical-align: -0.15em;
    }
    .sidebar{
        display: block;
        position: absolute;
        width: 180px;
        left: 0;
        top: 44px;
        bottom:0;
        /*background: #2E363F;*/
        background: #eef1f6;
        overflow-y: scroll;
    }
    .sidebar > ul {
    }
</style>
