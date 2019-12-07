<template>
    <div id="app">
        这里是store的state------->{{this.$store.state.count}} <br/>
        这里是store的state.a------->{{this.$store.state.a.count}} <br/>
        这里是store的state.b------->{{this.$store.state.b.count}} <br/>

        这里是store的getter------->{{this.$store.getters.newCount}} <br/>

        这里是store的state.b做减法操作------->{{this.$store.state.b.count}} <br/>
        这里是store的state.c做操作------->{{this.$store.state.c.count}} <br/>
        <button @click="change">点击触发dispach--> actions</button>
        <button @click="change1">点击触发commit---> mutations</button>
        <button @click="change2"> 同时触发最外层的state 和state.b的action（异步）  做减法</button>
        <button @click="change3"> state.c做乘法操作 触发actions（异步）对应的chengfa(只触发state.c的action)</button>
        <button @click="change4"> state.c做触发操作 触发mutations（同步）对应的chufa(只触发state.c的mutations)</button>
    </div>
</template>


<script>
    export default {
        name: "test_vuex",
        methods: {
            change () {
                this.$store.dispatch('actionschange') // 触发actions对应的change
            },
            change1 () {
                this.$store.commit('mutationschange') // 触发mutations对应的change
            },
            change2 () {
                this.$store.dispatch('actionssubtraction')// 触发actions对应的actionssubtraction (同时触发最外层的state 和state.b的action)
            },
            change3 () {
                this.$store.dispatch('chengfa') // 触发actions对应的chengfa(只触发state.c的action)
            },
            change4 () {
                this.$store.commit('chufa') // 触发c下面mutations对应的chufa
            },
        },
        mounted () {
            console.log(this.$store);
        }
    }
</script>

<style scoped>

</style>