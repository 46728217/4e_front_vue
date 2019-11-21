<template>
    <div class="preview" id="preview"  v-bind:style="{backgroundImage:'url(' + logimg + ')'}"></div>
</template>

<script>
    export default {
        name: "preview",
        data: function(){
            return {
                logimg:''
            }
        },
        methods:{
        },
        created: function() {
            this.logimg=this.$route.query.logimg;

        }
    }
</script>

<style scoped lang="scss">
    * {
        padding: 0;
        border: 0;
        margin: 0;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    html {
        height: 100%;
        width: 100%;
        display: table;
    }

    body {
        display: table-cell;
        height: 100%;
        width: 100%;
    }

    .preview{
        height: 100%;
        width: 100%;
        cursor: pointer;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }

</style>