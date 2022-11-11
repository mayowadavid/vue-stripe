<template>
    <div>
        <div>
            <div style="background-color:rgba(255,0,0,0.3); color:red;">
                <div  v-if="error" class="wrapper" style="padding-top:3%; padding-bottom:1.5%">
                    <h3> Oops! </h3>
                    <h3 >{{error}}</h3>
                </div>
            </div>
        </div>
        <div class="">
                <div class="input">
                     <input type="number" v-model="email"  name="email"  placeholder="email">
                    <input type="number" v-model="password"  name="password"  placeholder="password">
                </div>
                <div class="submit">
                                <v-btn @click.prevent="signIn">Submit</v-btn>
                </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Login',
    data() {
        return{
            email:'',
            password:'',
            show: true,
            clicked: true
        }
    },

    computed:{
        error(){
            return this.err = this.$store.getters.error;
        }
    },

    methods:{
    signIn(){
               this.$store.dispatch("signUserIn", {
                    email: this.email,
                    password: this.password
                })
        }
    }
}
</script>

<style scoped>
.card{
    margin: 0 auto;
    display: flex;
    justify-content: center;
    width: 90vw;
}

@media screen and (min-width:850px) {
    .card{
        width: 65vw;
    }
}

@media screen and (min-width:1220px) {
    .card{
        width: 50vw;
    }
}
.signin{
    width: 100%;
}
input{
    stroke: black !important;
    stroke-width: 10% !important;
}

.input{
    padding: 3%;
}
</style>
