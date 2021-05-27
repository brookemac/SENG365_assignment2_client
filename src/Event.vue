<template>
    <div>
        <div>
            <div v-if="errorFlag">
                <el-alert
                    title="Whoops! Something went wrong."
                    type="error">
                <span>Error: {{ error }}</span>
                </el-alert>
            </div>
        </div>

        <router-link :to="{ name: 'events' }">Back to Events</router-link>

        <div class="event">

            <div class="eventHeader">
                <h4>{{ event.title }} </h4>
            </div>

            <img @error="defaultImage($event)" :src=getEventImage($route.params.eventId) height="250" width="350">

            <h4>Description</h4>
            <h5>{{ event.description }}</h5>
            
            <h4>Date and Time</h4>
            <h5>{{ event.date }}</h5>

            <h4>Categories</h4>
            <h5>{{ event.categories }}</h5>

            <h4>Capacity</h4>
            <h5>{{ event.capacity }}</h5>

            <h4>Venue</h4>
            <h5>{{ event.venue }}</h5>

            <h4>Event URL</h4>
            <h5>{{ event.url }}</h5>

            <h4>Fee</h4>
            <h5>${{ event.fee }}</h5>

            <h4>Organizer of this event</h4>
            <img @error="defaultUserImage($event)" :src=userImage(event.organizerId) height="250" width="250">
            <h5 class="organizerName">{{ organizer.firstName}} {{ organizer.lastName}}</h5>


            <h4>Number of Attendees</h4>
            <h5>{{event.attendeeCount}}</h5>

            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#viewAttendeesModal">
                Click here to view attendees
            </button>

            <div v-if="ownEvent">

                <button type="button" class="btn btn-primary" v-on:click="getEventCategories"
                data-toggle="modal" data-target="#editEventModal"> 
                    Edit
                </button>

                <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteEventModal"> 
                    Delete
                </button>

            </div>

            <div v-else>

                <div v-for="attendee in attendees" v-bind:key=attendee.attendeeId>
                    <div v-if="attendee.attendeeId == currentUser.userId">
                        <div v-if="attendee.status='rejected'">
                            <label>You have been rejected from this event.</label>
                        </div>
                        <div v-else>
                            <button v-if="isLoggedIn() && !attendedByUser && Date.now() < new Date(event.date).getTime() && seatsAvaliblity()"
                            type="button" class="btn btn-primary" data-toggle="modal" data-target="#attendEventModal"> 
                                Attend this Event
                            </button>

                            <label v-if="isLoggedIn() && !attendedByUser && Date.now() < new Date(event.date).getTime() && !seatsAvaliblity()"> 
                                Sorry this event is full, check out our other events!
                            </label>



                            <button v-if="isLoggedIn() && attendedByUser && !ownEvent && Date.now() < new Date(event.date).getTime()"
                            type="button" class="btn btn-primary" data-toggle="modal" data-target="#unattendEventModal"> 
                                Unattend this Event
                            </button>
                        </div>
                    </div>
                </div>

            </div>


            <div class="modal fade" id="viewAttendeesModal" tabindex="-1" role="dialog"
            aria-labelledby="viewAttendeesModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="viewAttendeesModalLabel">Attendee List</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div v-for="attendee in attendees" v-bind:key=attendee.attendeeId>
                                <div class="listAttendees" v-if="attendee.status!='pending'">
                                    <div v-if="attendee.status!='rejected'">
                                        <div v-if="attendee.attendeeId != event.organizerId">
                                            <img @error="defaultUserImage($event)" :src=userImage(attendee.attendeeId) height="150" width="150">
                                            <h5>{{ attendee.firstName }} {{ attendee.lastName }}</h5>
                                            <h5 class="acceptedTag">Attendee</h5>
                                        </div>
                                        <div v-else-if="attendee.attendeeId == event.organizerId">
                                            <img @error="defaultUserImage($event)" :src=userImage(attendee.attendeeId) height="150" width="150">
                                            <h5>{{ attendee.firstName }} {{ attendee.lastName }}</h5>
                                            <h5 class="acceptedTag">Organizer</h5>
                                        </div>
                                    </div>
                                </div>

                            <div v-if="ownEvent">
                                <div v-if="attendee.status=='pending'">
                                    <div class="listAttendees">
                                        <img @error="defaultUserImage($event)" :src=userImage(attendee.attendeeId) height="150" width="150">
                                        <h5>{{ attendee.firstName }} {{ attendee.lastName }}</h5>
                                        <h5 class="pendingTag">{{ attendee.status}}</h5>
                                        
                                    </div>
                                        <button type="button" class="btn btn-danger" v-on:click="rejectAttendee($route.params.eventId, attendee.attendeeId)">
                                            Reject
                                        </button>
                                        <button type="button" class="btn btn-primary" v-on:click="acceptAttendee($route.params.eventId, attendee.attendeeId)">
                                            Accept
                                        </button>
                                    <h5 v-if="attendee.status=='rejected'">
                                        <button type="button" class="btn btn-primary" v-on:click="acceptAttendee($route.params.eventId, attendee.attendeeId)">Accept</button>
                                    </h5>
                                </div>
                            </div>

                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            <div class="modal fade" id="attendEventModal" tabindex="-1" role="dialog"
            aria-labelledby="attendEventModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="attendEventModalLabel">Attend Event</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to attend this event?
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                            </button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="attendEvent($route.params.eventId)">
                                Attend
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div class="modal fade" id="unattendEventModal" tabindex="-1" role="dialog"
            aria-labelledby="unattendEventModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="unattendEventModalLabel">Unattend Event</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to unattend this event?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Close
                            </button>
                            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="unattendEvent($route.params.eventId)">
                                Unattend
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            <div class="modal fade" id="deleteEventModal" tabindex="-1" role="dialog"
            aria-labelledby="deleteEventModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="deleteEventModalLabel">Delete Event</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            Are you sure you want to delete this event?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                            <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="deleteEvent($route.params.eventId)">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="editEventModal" tabindex="-1" role="dialog"
            aria-labelledby="editEventModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editEventModalLabel">Edit Event</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent v-on:submit="editEvent($route.params.eventId);">
                                <h5>Title</h5>
                                <input v-model="eventTitle" placeholder="title"/>
                                <br>
                                <h5>Description</h5>
                                <textarea v-model="eventDescription" placeholder="description" rows="5" cols="50"/>
                                <br>
                                <h5>Categories</h5>
                                <div v-for="category in eventCategories" v-bind:key="category.id">
                                    <input v-model="eventCategoriesSelected" type="checkbox" name="category" v-bind:value=category.id>
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
                                <textarea v-model="eventVenue" placeholder="URL" rows="1" cols="10"/>
                                <br>
                                <h5>Requires attendance control</h5>
                                <select v-model="eventControl" name="require_attendance_control" id="require_attendance_control">
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
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
                                    <input type="submit" class="btn btn-primary" value="Edit Event"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </div>

        <div class="similarEvents">
            <label class="similarEventsTitle">Check out our similar events:</label>
            <div v-for="event in similarEvents" v-bind:key="event.title">
                <a :href="$router.resolve({ name: 'event', params: { eventId: event.eventId }}).href" class="similarEventsLink">
                {{ event.title }}</a>
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
            event: "",
            organizer: "",
            ownEvent: false,
            currentUser: {},

            
            eventTitle: "",
            eventDescription: "",
            eventCategoriesSelected: [],
            eventCategories: [],
            eventDate: "",
            eventCapacity: "",
            eventStatus: "",
            eventURL: "",
            eventVenue: "",
            eventControl: "",
            eventFee: 0.00,

            eventImage: '',
            eventImageData: null,
            eventImageType: "",

            updateImage: 0, // vue key

            attendees: [],
            attendedByUser: false,
            rejectedUser: false,

            seatsAvalible: true,
            attendanceControl: false,

            similarEvents: []

        }
    },
    mounted() {
        this.getSingleEvent(this.$route.params.eventId);
    },
    methods: {

        isLoggedIn() {
            return JSON.parse(localStorage.getItem('currentUser')) != null;
        },

        userCheck() {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            console.log(this.currentUser)
            this.ownEvent = this.currentUser.userId == this.event.organizerId;
        },

        seatsAvaliblity(capacity, attendees) {
            if (capacity == null) {
                return this.seatsAvalible;
            } else {
                this.seats = (capacity - attendees) - 1
                if (this.seats <= 0) {
                    this.seatsAvalible = false;
                }
                return this.seatsAvalible;
            }

        },

        checkAttendanceControl(response) {
            if (response == "1") {
                this.attendanceControl = true;
            }
            return;
        },

        getSingleEvent(id) {
            this.axios.get('http://localhost:4941/api/v1/events/' + id)
            .then((response) => {
                this.event = response.data;
                this.getOrganizerDetails(this.event.organizerId)
                this.getAttendees(id)
                console.log(this.event)
                this.getSimilarEvents(this.event.categories)
                this.userCheck();
                this.seatsAvaliblity(this.event.capacity, this.event.attendeeCount);
                this.checkAttendanceControl(this.event.requiresAttendanceControl)
            }, (error) => {
                this.error = error;
                this.errorFlag = true;
            });
        },

        getSimilarEvents(categories) {
            let params = {};
            params.categoryIds = categories;

            this.axios.get('http://localhost:4941/api/v1/events', {params: params})
            .then((response) => {
                this.similarEvents = response.data;
            }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        getAttendees(id) {
            this.axios.get('http://localhost:4941/api/v1/events/' + id + "/attendees")
            .then((response) => {
                this.attendees = response.data;
                this.isAttendedByUser();
            })
            .catch((error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        isAttendedByUser() {
            this.userCheck();
            this.attendedByUser = false;
            this.attendees.forEach((attendee) => {
                if(attendee.attendeeId == this.currentUser.userId) {
                    this.attendedByUser = true;
                }
            });
        },

        attendEvent(eventId) {
            this.axios.post('http://localhost:4941/api/v1/events/' + eventId + "/attendees")
            .then(() => {
                this.attendedByUser = true;
                alert("You now may be attending this event");
                this.$router.go()
            })
            .catch((error) => {
                alert(error.response.statusText);
                alert("Failed to attend event");
                this.error = error;
                this.errorFlag = true;
            });
        },

        unattendEvent(eventId) {
            this.axios.delete('http://localhost:4941/api/v1/events/' + eventId + "/attendees")
            .then(() => {
                this.attendedByUser = false;
                alert("You are not attending this event");
            })
            .catch((error) => {
                alert(error.response.statusText);
                alert("Failed to unanttend event");
                this.error = error;
                this.errorFlag = true;
            });
        },

        acceptAttendee(eventId, attendeeId) {
            this.axios.patch('http://localhost:4941/api/v1/events/' + eventId + "/attendees/" + attendeeId, {
                "status": "accepted"
            })
            .then(() => {
                alert("You have accepted this attendee")
                this.$('#viewAttendeesModal').modal('hide');
                this.$router.go()
            })
            .catch((error) => {
            alert(error.response.statusText);
            this.error = error;
            this.errorFlag = true;
            });
        },

        rejectAttendee(eventId, attendeeId) {
            this.axios.patch('http://localhost:4941/api/v1/events/' + eventId + "/attendees/" + attendeeId, {
                "status": "rejected"
            })
            .then(() => {
                alert("You have rejected this attendee")
                this.$('#viewAttendeesModal').modal('hide');
                this.$router.go()
            })
            .catch((error) => {
            alert(error.response.statusText);
            this.error = error;
            this.errorFlag = true;
            });
        },
        
        getEventImage(eventId) {
            return "http://localhost:4941/api/v1/events/" + eventId + "/image";
        },
        
        defaultImage(event) {
            event.target.src = "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg";
        },

        getOrganizerDetails(organizer_id) {
            this.axios.get('http://localhost:4941/api/v1/users/' + organizer_id)
            .then((response) => {
                this.organizer = response.data;
            }, (error) => {
                this.error = error;
                this.errorFlag = true;
            });
        },

        userImage(userId) {
            return "http://localhost:4941/api/v1/users/" + userId + "/image";
        },
        
        defaultUserImage(event) {
            event.target.src = "https://st3.depositphotos.com/1156795/35622/v/600/depositphotos_356226300-stock-illustration-profile-placeholder-image-gray-silhouette.jpg";
        },

        deleteEvent(eventId) {
            this.axios.delete('http://localhost:4941/api/v1/events/' + eventId)
            .then(() => {
                alert("You have deleted this event")
                this.$router.push('/events');
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
            }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        handleEventImage: function() {
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

        editEvent(eventId) {
            let data = {};

            if(this.eventTitle != "") {
                data.title = this.eventTitle;
            }

            if(this.eventCategoriesSelected.length > 0 ) {
                console.log(this.eventCategoriesSelected.length)
                data.categoryIds = this.eventCategoriesSelected;
            }
            if(this.eventDate != "") {
                data.date = (new Date(this.eventDate)).toJSON().slice(0,10) + " 00:00:00.000";
            }
            if(this.eventDescription != "") {
                data.description = this.eventDescription;
            }
            if(this.eventCapacity != "") {
                data.capacity = parseInt(this.eventCapacity, 10);
            }
            if(this.eventStatus != "") {
                data.is_online = this.eventStatus;
            }
            if(this.eventURL != "") {
                data.url = this.eventURL;
            }
            if(this.eventVenue != "") {
                data.venue = this.eventVenue;
            }
            if(this.eventControl != "") {
                data.requires_attendance_control = this.eventControl;
            }
            if(this.eventFee != "") {
                data.fee = this.eventFee;
            }

            let uploadImage = false;
            if(this.eventImageData != null) {
                uploadImage = true;
            }

            this.axios.patch('http://localhost:4941/api/v1/events/' + eventId, data)
            .then((eventResponse) => {
                if(uploadImage) {
                    this.axios.put('http://localhost:4941/api/v1/events/' + eventResponse.data.eventId + '/image', this.eventImageData, {headers: {"Content-Type": this.eventImageType}})                            
                    .then(() => {
                        this.getSingleEvent();
                        this.updateImage += 1;
                        alert("Event updated successfully");
                        this.$router.go()
                    })
                    .catch((error) => {
                        alert(error.response.statusText);
                        this.getSingleEvent();
                        this.error = error;
                        this.errorFlag = true;
                        alert("Event updated successfully, except for its image");
                        this.$router.go()
                    });
                } else {
                    alert("Event updated successfully");
                    this.$router.go()
                    this.getSingleEvent();
                    
                }
                this.$('#editEventModal').modal('hide');
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

    .eventHeader {
        border-top-right-radius: 25px;
        margin: center;
        padding: 2px;
        background-color: #FFD55A;
        text-align: left;
    }

    .event {
        background-color: white;
        margin: 20px auto;
        width: 70%;
        padding: px;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        border-radius: 25px;
    }

    .event h5 {
        margin: 10px;
        padding: 2px;
    }

    .event h4 {
        margin: 10px;
    }

    .event button {
        margin: 10px;
    }

    .event img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        padding: 10px;
        border-radius: 26px;
        
    }

    .organizerName {
        text-align: center;
    }

    .acceptedTag {
        color: #6DD47E;
    }

    .pendingTag {
        color: #e03444;
    }

    .similarEventsTitle {
        border-top-right-radius: 25px;
        margin: 10px center;
        padding: 10px;
        background-color: #FFD55A;
        text-align: left;
        width: 100%;
        font-weight: bold;
    }

    .similarEvents {
        background-color: white;
        margin: 20px auto;
        width: 70%;
        padding: px;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        border-radius: 25px;
    }

    .similarEventsLink {
        padding: 10px;
    }

</style>