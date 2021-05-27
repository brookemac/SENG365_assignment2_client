<template>

    <div v-if="$route.params.userId">
        <div>
            <div v-if="errorFlag" style="color: red;">
                {{ error }}
            </div>
        </div>

        <router-link :to="{ name: 'events' }">Back to Events</router-link>

        <div class="user">

            <div class="profileHeader">
                <h5>My Profile</h5>
            </div>

            <h5>Profile Image</h5>
            <img @error="defaultImage($event)" :src=userImage($route.params.userId) height="250" width="260">
            
            <h5>First Name</h5>
            <h4>{{ user.firstName }}</h4>
            
            <h5>Last Name</h5>
            <h4>{{ user.lastName }}</h4>
            
            <h5>Email</h5>
            <h4>{{ user.email }}</h4>

            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editUserModal">
                Edit Profile
            </button>
        </div>





        <div class="modal fade" id="editUserModal" tabindex="-1" role="dialog" 
        aria-labelledby="editUserModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editUserModalLabel">Edit your profile</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent v-on:submit="editUser($route.params.userId)">
                            <label>First Name</label>
                            <br>
                            <input v-model="editFirstName" placeholder="first name" />
                            <br><br>
                            <label>Last Name</label>
                            <br>
                            <input v-model="editLastName" placeholder="last name" />
                            <br><br>
                            <label>Email</label>
                            <br>
                            <input v-model="editEmail" placeholder="email" />
                            <br><br>
                            <label>New Password</label>
                            <br>
                            <input v-model="editPassword" placeholder="new password" type="password" />
                            <br><br>
                            <label>Current Password</label>
                            <br>
                            <input v-model="editCurrentPassword" placeholder="current password" type="password" />
                            <br><br>
                            <div v-if="!userImageCheck">
                                <input type="file" id="editImageInput" ref="editImage" v-on:change="handleUserEditImage()"/>
                            </div>
                            <div v-else>
                                <label>New Image</label>
                                <br>
                                <input type="file" id="editImageInput" ref="editImage" v-on:change="handleUserEditImage()"/>
                                <br><br>
                                <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteUserImage($route.params.userId)">
                                    Remove your profile image
                                </button>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                                </button>
                                <input type="submit" class="btn btn-primary" value="Save"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
export default {
    data() {
        return {
            error: "",
            errorFlag: false,
            user: "",

            editEmail: "",
            editPassword: "",
            editFirstName: "",
            editLastName: "",
            editCurrentPassword: "",

            editImage: '',
            editImageData: null,
            editImageType: "",

            userImageCheck: true,

            forError: "",
        }
    },
    mounted() {
        this.getSingleUser(this.$route.params.userId);
    },
    methods: {
        getSingleUser(id) {
            this.axios.get('http://localhost:4941/api/v1/users/' + id)
            .then((response) => {
                this.user = response.data;
            }, (error) => {
                this.error = error;
                this.errorFlag = true;
            });
        },

        editUser(user_id) {
            let data = {};
            if(this.editEmail != "") {
                data.email = this.editEmail;
            }
            if(this.editFirstName != "") {
                data.firstName = this.editFirstName;
            }
            if(this.editLastName != "") {
                data.lastName = this.editLastName;
            }
            if(this.editPassword != "" ) {
                data.password = this.editPassword;
                if(this.editCurrentPassword != "") {
                    data.currentPassword = this.editCurrentPassword;
                }
            }
            let uploadImage = false;
            if(this.editImageData != null) {
                uploadImage = true;
            }
            console.log(uploadImage)
            this.axios.patch('http://localhost:4941/api/v1/users/' + user_id, data)
            .then((response) => {
                alert("Profile Saved")
                this.forError = response.data;
                
                if(uploadImage) {
                    this.axios.put('http://localhost:4941/api/v1/users/' + user_id + '/image', this.editImageData, {headers: {"Content-Type": this.editImageType}})
                    .then(() => {
                        alert("New image saved");
                    })
                    .catch((error) => {
                        alert(error.response.statusText);
                        alert("Failed to upload profile image");
                        this.error = error;
                        this.errorFlag = true;
                    });
                }
                
            })
            .catch((error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        handleUserEditImage() {
            this.editImage = this.$refs.editImage.files[0];
            this.editImageType = this.editImage.type;
            let reader = new FileReader();
            let vueInstance = this;
            reader.onload = function() {
                let arrayBuffer = this.result;
                let array = new Uint8Array(arrayBuffer);
                vueInstance.editImageData = array;
            }
            reader.readAsArrayBuffer(this.editImage);
        },


        userImage(userId) {
            return "http://localhost:4941/api/v1/users/" + userId + "/image";
        },
        
        defaultImage(event) {
            this.userImageCheck = false
            event.target.src = "https://st3.depositphotos.com/1156795/35622/v/600/depositphotos_356226300-stock-illustration-profile-placeholder-image-gray-silhouette.jpg";
        },

        deleteUserImage(userId) {
            this.axios.delete('http://localhost:4941/api/v1/users/' + userId + '/image')
            .then(() => {
                this.userImageCheck = false
                alert("Your profile image has been deleted")
                this.$router.go()
            })
            .catch((error) => {
            alert(error.response.statusText);
            this.error = error;
            this.errorFlag = true;
            });
        },
    }
}
</script>

<style scoped>

    .profileHeader {
        border-top-right-radius: 25px;
        margin: 10px center;
        padding: 5px;
        background-color: #FFD55A;
        text-align: left;
    }

    .user {
        background-color: white;
        margin: 20px auto;
        width: 50%;
        padding: px;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        border-radius: 25px;
    }

    .user h5 {
        margin: 5px;
        padding: 5px;
    }

    .user h4 {
        margin: 5px;
        padding: 5px;
    }

    .user button {
        margin: 10px;
        padding: 5px;
    }

    .user img {
        margin: 10px;
        padding: 5px;
        border-radius: 10px;
    }


</style>