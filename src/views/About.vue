<template>
        <div class="login">
            
            <form>
                  <div class="input">
                    <label>Email</label>
                     <input type="text" v-model="email"  name="email"  placeholder="email">
                  </div>
                  <div class="input">
                     <label>password</label>
                    <input type="text" v-model="password"  name="password"  placeholder="password">
                  </div>
                <div class="submit">
                                <v-btn @click.prevent="signIn">Submit</v-btn>
                </div>
                <div>
                </div>
              </form>


    </div>
</template>
<script>
export default {
    name: 'About',
    data() {
        return{
            email: 'robb@gmail.com',
            password: '12345678',
        }
    },

    computed:{
        error(){
        console.log(this.email);
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

.login{
width: 80vw;
height:60vw;
}

.login > form {
width: 80%;
margin: 0 auto;
display: flex;
}

.input {
width: 100%;
}

input[type=text]{
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

input[type=submit] {
    background-color: #213569;
    color: white;
    padding: 1vh 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 30%;
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

