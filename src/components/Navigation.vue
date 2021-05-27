<template>
    <div class="navbar">

        <div>
            <div class="eventsBtn ml-auto">
                <router-link :to="{ name: 'events' }">
                    <button type="button" class="btn btn-primary">
                    All Events
                    </button>
                </router-link>
            </div>
        </div>

        <div class="createEventBtn" v-if="loggedIn">
            <button type="button" class="btn btn-primary" v-on:click="getEventCategories();" 
            data-toggle="modal" data-target="#createEventModal"> 
                Create Event
            </button>
        </div>

        <div class="myEventsBtn" v-if="loggedIn">
            <router-link :to="{ name: 'UserEvents', params: { userId: currentUserId()}}">
                <button type="button" class="btn btn-primary"> 
                    My Events
                </button>
            </router-link>
        </div>

        <div class="logoutBtn ml-auto" v-if="loggedIn">
            <button type="button" class="btn btn-primary" v-on:click="logout();">
                Logout
            </button>
        </div>

        <div class="userBtn" v-if="loggedIn">
            <router-link :to="{ name: 'user', params: { userId: currentUserId()}}">
                <button type="button" class="btn btn-primary">
                    {{ currentUserName() }}
                </button>
            </router-link>
        </div>


        <div class="registerBtn ml-auto" v-if="!loggedIn">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#registerUserModal">
                Register
            </button>   
        </div>


        <div class="loginBtn" v-if="!loggedIn">
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#loginUserModal">
                Log in
            </button>   
        </div>


        <div class="modal" id="loginUserModal" tabindex="-1" role="dialog"
                aria-labelledby="loginUserModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="loginUserModalLabel">Login</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent v-on:submit="loginUser();">
                            <label>Email</label>
                            <br>
                            <input v-model="loginEmail" placeholder="email" />
                            <br><br>
                            <label>Password</label>
                            <br>
                            <input v-model="loginPassword" placeholder="password" type="password" />

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                            <button type="submit" class="btn btn-primary">Submit</button>

                        </div>
                            
                        </form>
                    </div>

                </div>
            </div>
        </div>


        <div class="modal fade" id="registerUserModal" tabindex="-1" role="dialog"
        aria-labelledby="registerUserModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="registerUserModalLabel">Register</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent v-on:submit="registerUser();">
                            <label>Email</label>
                            <br>
                            <input v-model="registerEmail" placeholder="email" />
                            <br><br>
                            <label>Password</label>
                            <br>
                            <input v-model="registerPassword" placeholder="password" type="password" />
                            <br><br>
                            <label>First Name</label>
                            <br>
                            <input v-model="registerFirstName" placeholder="first name" />
                            <br><br>
                            <label>Last Name</label>
                            <br>
                            <input v-model="registerLastName" placeholder="last name" />
                            <br><br>
                            <input type="file" id="registerImageInput" ref="registerImage" v-on:change="handleUserRegisterImage()"/>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                    Close
                                </button>
                                <input type="submit" class="btn btn-primary" value="Register"/>
                            </div> 
                        </form>
                    </div>
                </div>
            </div>
        </div>


        <div class="modal fade" id="createEventModal" tabindex="-1" role="dialog" 
            aria-labelledby="createEventModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="createEventModalLabel">Create Event</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent v-on:submit="createEvent();">
                                
                                <h5>Title</h5>
                                <input v-model="eventTitle" placeholder="title"/>
                                <br>
                                <h5>Description</h5>
                                <textarea v-model="eventDescription" placeholder="description" rows="5" cols="50"/>
                                <br>
                                <h5>Categories</h5>
                                <div v-for="category in eventCategories" v-bind:key="category.id">
                                    <input v-model="eventCategoriesSelected" type="checkbox" v-bind:value=category.id>
                                    <label for=category.id>{{category.name}}</label><br>
                                </div>
                                <h5>Date</h5>
                                <input id="eventDate" type="date" v-model="eventDate"/>
                                <br>
                                <h5>Maximum Capacity</h5>
                                <input type="number" v-model="eventCapacity" name="eventCapacity" min="0" max="infinity"/>
                                <br>
                                <h5>Online or In-Person</h5>
                                <select v-model="eventStatus" name="is_online" id="is_online">
                                    <option value="1">Online</option>
                                    <option value="0">In-Person</option>
                                </select>
                                <br>
                                <h5>URL (for online events)</h5>
                                <textarea v-model="eventURL" placeholder="URL" rows="1" cols="10"/>
                                <br>
                                <h5>Venue (for in-person events)</h5>
                                <textarea v-model="eventVenue" placeholder="Venue" rows="1" cols="10"/>
                                <br>
                                <h5>Requires attendance control</h5>
                                <select v-model="eventControl" name="require_attendance_control" id="require_attendance_control">
                                    <option value='true'>Yes</option>
                                    <option value='false'>No</option>
                                </select>
                                <br>
                                <h5>Fee</h5>
                                <input type="number" v-model="eventFee" name="eventFee" min="0" step="0.01" max="infinity"/>
                                <br>
                                <h5>Event Image</h5>
                                <input type="file" id="eventImageInput" ref="eventImage" v-on:change="handleEventImage()"/>
                                <br>                                
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                        Close
                                    </button>
                                    <input type="submit" class="btn btn-primary" value="Create Event"/>
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
    data () {
        return {
            loggedIn: false,
            currentUser: null,

            loginEmail: "",
            loginPassword: "",

            registerEmail: "",
            registerPassword: "",
            registerFirstName: "",
            registerLastName: "",

            registerImage: '',
            registerImageData: null,
            registerImageType: "",

            eventTitle: "",
            eventDescription: "",
            eventCategoriesSelected: [],
            eventCategories: [],
            eventDate: "",
            eventCapacity: "",
            eventStatus: "",
            eventURL: "",
            eventVenue: "",
            eventControl: '',
            eventFee: 0.00,

            eventImage: '',
            eventImageData: null,
            eventImageType: "",

            loggedincheck: false,


        }
    },
    mounted() {
        this.isLoggedIn();
    },
    methods: {

        isLoggedIn() {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (this.currentUser != null) {
                this.loggedIn = this.currentUser;
                this.axios.defaults.headers.common['X-Authorization'] = this.currentUser.authToken;
            }
            return this.loggedIn;

            
        },

        currentUserName() {
            return (JSON.parse(localStorage.getItem('currentUser'))).first_name;
        },

        currentUserId() {
            return (JSON.parse(localStorage.getItem('currentUser'))).userId;
        },

        saveLoginData(id, token, name) {
            let currentUser = {userId: id, authToken: token, first_name: name};
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            this.isLoggedIn();
        },

        loginUser() {
            this.axios.post('http://localhost:4941/api/v1/users/login', {
                email: this.loginEmail, 
                password: this.loginPassword
            })
            .then((loginResponse) => {
                this.axios.get('http://localhost:4941/api/v1/users/' + loginResponse.data.userId)
                .then((userResponse) => {
                    this.loggedincheck = true;
                    this.saveLoginData(loginResponse.data.userId, loginResponse.data.token, userResponse.data.firstName);
                    
                })
            })
            .catch((error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
            this.$('#loginUserModal').modal('hide');
            this.$router.push('/events');
        },

        logout() {
            this.$router.push('/events');
            location.reload();
            localStorage.setItem('currentUser', JSON.stringify(null));
            this.axios.defaults.headers.common['X-Authorization'] = undefined;
        },

        registerUser() {
            let data = {};
            if(this.registerEmail == "") {
                alert("Email is required");
                return;
            }
            if(this.registerPassword == {}) {
                alert("Password is required");
                return;
            }
            if(this.registerPassword.length < 8) {
                alert("Your password is too short - must be at least 8 characters");
                return;
            }
            if(this.registerFirstName == "") {
                alert("First name is required");
                return;
            }
            if(this.registerLastName == "") {
                alert("Last name is required");
                return;
            }
            data.email = this.registerEmail;
            data.password = this.registerPassword;
            data.firstName = this.registerFirstName;
            data.lastName = this.registerLastName;

            let uploadImage = false;
            if(this.registerImageData != null) {
                uploadImage = true;
            }
            this.axios.post('http://localhost:4941/api/v1/users/register', data)
            .then((registerResponse) => {
                this.axios.post('http://localhost:4941/api/v1/users/login', {email: data.email, password: data.password})
                .then((loginResponse) => {
                    this.axios.get('http://localhost:4941/api/v1/users/' + registerResponse.data.userId)
                    .then((userResponse) => {
                        this.saveLoginData(loginResponse.data.userId, loginResponse.data.token, userResponse.data.firstName);
                        if(uploadImage) {
                            this.axios.put('http://localhost:4941/api/v1/users/' + registerResponse.data.userId + '/image', this.registerImageData, {headers: {"Content-Type": this.registerImageType}})                            
                            .then(() => {
                                
                            })
                            .catch((error) => {
                                alert(error.response.statusText);
                                alert("Account has been registered, but failed to upload profile image");
                                this.error = error;
                                this.errorFlag = true;
                            });
                        }
                        console.log("a")
                        this.$('#registerUserModal').modal('hide');
                    })
                    .catch((error) => {
                        alert(error.response.statusText);
                        this.error = error;
                        this.errorFlag = true;
                    });
                })
                .catch((error) => {
                    alert(error.response.statusText);
                    this.error = error;
                    this.errorFlag = true;
                });
            })
            .catch((error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        handleUserRegisterImage() {
            this.registerImage = this.$refs.registerImage.files[0];
            this.registerImageType = this.registerImage.type;
            let reader = new FileReader();
            let vueInstance = this;
            reader.onload = function() {
                let arrayBuffer = this.result;
                let array = new Uint8Array(arrayBuffer);
                vueInstance.registerImageData = array;
            }
            reader.readAsArrayBuffer(this.registerImage);
        },

        handleEventImage() {
            this.eventImage = this.$refs.eventImage.files[0];
            this.eventImageType = this.eventImage.type;
            let reader = new FileReader();
            let vueInstance = this;
            reader.onload = function() {
                let arrayBuffer = this.result;
                let array = new Uint8Array(arrayBuffer);
                vueInstance.eventImageData = array;
            }
            reader.readAsArrayBuffer(this.eventImage);
        },

        fillEditDetails() {
            this.isLoggedIn();
            this.axios.get('http://localhost:4941/api/v1/users/' + this.currentUser.userId)
            .then((userResponse) => {
                this.editEmail = userResponse.data.email;
                this.editFirstName = userResponse.data.firstName;
                this.editLasttName = userResponse.data.lastName;
            })
            .catch((error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        getEventCategories() {
            this.axios.get('http://localhost:4941/api/v1/events/categories')
            .then((categoriesResponse) => {
                console.log(categoriesResponse.data)
                this.eventCategories = categoriesResponse.data;
                console.log(this.eventCategories)
            }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        createEvent() {
            let data = {};

            if(this.eventTitle == "") {
                alert("Title is required");
                return;
            }

            if(this.eventDescription == "") {
                alert("A description is required");
                return;
            }

            if(this.eventCategoriesSelected == "") {
                alert("At least one category is required");
                return;
            }
            if(this.eventDate == "") {
                alert("Date is required");
                return;
            }

            if (this.eventStatus == "") {
                alert("Must state whether it is in person or online");
                return;
            }
            
            if (this.eventStatus == 1 && this.eventURL == "") {
                alert("You must have a URL for an online event");
                return;
            }

            if (this.eventStatus == 0 && this.eventVenue == "") {
                alert("You must have a venue for an in-person event");
                return;
            }

            if (this.eventStatus == 1 && this.eventVenue != "") {
                alert("There should be no Venue for an online event");
                return;
            }

            data.title = this.eventTitle;
            data.description = this.eventDescription;
            data.categoryIds = this.eventCategoriesSelected;
            data.date = (new Date(this.eventDate)).toJSON().slice(0,10) + " 00:00:00.000";
            data.is_online = this.eventStatus;

            if(this.eventCapacity != "") {
                data.capacity = parseInt(this.eventCapacity, 10);
            }

            if((this.eventStatus == 1 || this.eventStatus == 0) && this.eventURL != "") {
                data.url = this.eventURL;
            }
            if(this.eventStatus == 0 && this.eventVenue != "") {
                data.venue = this.eventVenue;
            }
            if(this.eventControl != "") {
                if (this.eventControl === "true") {
                    data.requiresAttendanceControl = true;
                } else {
                    data.requiresAttendanceControl = false;
                }
                
            }
            if(this.eventFee != "") {
                data.fee = parseFloat(this.eventFee);
            }

            let uploadImage = false;
            if(this.eventImageData != null) {
                uploadImage = true;
            }
            
            this.axios.post('http://localhost:4941/api/v1/events', data)
            .then((eventResponse) => {
                this.axios.post('http://localhost:4941/api/v1/events/' + eventResponse.data.eventId + "/attendees")
                .then(() => {
                    this.$router.push('/events');
                })
                .catch((error) => {
                    alert(error.response.statusText);
                    alert("Failed to attend event");
                    this.error = error;
                    this.errorFlag = true;
                });
                if(uploadImage) {
                    this.axios.put('http://localhost:4941/api/v1/events/' + eventResponse.data.eventId + '/image', this.eventImageData, {headers: {"Content-Type": this.eventImageType}})                            
                    .then(() => {
                    })
                    .catch((error) => {
                        alert(error.response.statusText);
                        alert("Failed to upload event image");
                        this.error = error;
                        this.errorFlag = true;
                        this.$router.push('/events');
                        this.$('#createEventModal').modal('hide');
                    });
                } 
                alert("Your event has been created")
                this.$router.push('/events');
                this.$('#createEventModal').modal('hide');
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

    .eventsBtn {
        margin: 5px;
        float: left;
    }

    .loginBtn {
        float: right;
        margin: 5px;
    }

    .registerBtn {
        float: right;
        margin: 5px;
    }

    .logoutBtn {
        float: right;
        margin: 5px;
    }

    .userBtn {
        float: right;
        margin: 5px;
    }

    .navbar {
        background-color: #6DD47E;
        width: 100%;
    }

    .createEventBtn {
        float: left;
        margin: 5px;
    }

    .myEventsBtn {
        float: left;
        margin: 5px;
    }



</style>