<template>
    <div>

        <div>
            <div v-if="errorFlag" style="color: red;">
                {{ error }}
            </div>
        </div>


        <router-link :to="{ name: 'events' }">Back to Events</router-link>

        <br /><br />

        <div>


            <table class="myEventsTable">

                <thead>
                    <tr>
                        <td colspan="6" style="background-color: #FFD55A;">My Events</td>
                    </tr>
                    <tr class="headerNames">
                        <td>Title</td>
                        <td>Date</td>
                        <td>Categories</td>
                        <td>Host</td>
                        <td>Number of Attendees</td>
                        <td>Image</td>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="event in userEvents" v-bind:key="event.id">
                        <td><router-link :to="{ name: 'event', params: { eventId: event.id }}">
                            {{ event.title }}</router-link></td>
                        <td>{{ event.date }}</td>
                        <td>{{ event.categories }}</td>
                        <td>{{ event.organizerFirstName }} {{ event.organizerLastName }}</td>
                        <td>{{ event.attendeeCount }}</td>
                        <td>
                            <img @error="defaultImage($event)" :src=getEventImage(event.id)  height="100" width="150"/>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
        error: "",
        errorFlag: false,
        userEvents: [],
        events: [],
        attendingEvents: [],
        }
    },
    mounted() {
        this.getAllEvents(this.$route.params.userId)
        //this.getOrganizerEvents(this.$route.params.userId);

    },
    methods: {
        getOrganizerEvents(id) {
            this.axios.get('http://localhost:4941/api/v1/events', { params: { organizerId: id}})
            .then((response) => {
                this.userEvents = response.data;
            }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        getAllEvents(userId) {
            this.axios.get('http://localhost:4941/api/v1/events')
            .then((response) => {
                this.events = response.data;
                this.getAttendeeEvents(this.events, userId)
            }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        getAttendeeEvents(events, userId) {
            for (let i = 0; i < events.length; i++) {
                this.axios.get('http://localhost:4941/api/v1/events/' + events[i].eventId + '/attendees')
                .then((response) => {

                    for (let j = 0; j < response.data.length; j++) {
                        if (response.data[j].attendeeId == userId) {
                            this.axios.get('http://localhost:4941/api/v1/events/' + events[i].eventId)
                            .then((eventResponse) => {
                                this.userEvents.push(eventResponse.data);

                            },(error) => {
                            alert(error.response.statusText);
                            this.error = error;
                            this.errorFlag = true
                            });
                        }
                    }
                }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
            }

        },

        getEventImage(eventId) {
            return "http://localhost:4941/api/v1/events/" + eventId + "/image";

        },
        
        defaultImage(event) {
            event.target.src = "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg";
        },
    }
}
</script>


<style scoped>

    .myEventsTable {
        background-color:#f5f5f5;
        width: 70%;
        border-collapse: collapse;
        margin: auto;;
        font-size: 0.9em;
        font-family: sans-serif;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
       
        border-bottom-right-radius: 25px;
        border-bottom-left-radius: 25px;
    }

    .myEventsTable thead tr {
        background-color:  #6DD47E;
        color: #293250;
        text-align: left;
        font-size: medium;
        font-weight: bold;
        border-top-right-radius: 25px;
    }

    .myEventsTable th,
    .myEventsTable td {
        padding: 12px 15px;
        
        
    }

    .myEventsTable tbody tr {
        border-radius: 25px;
        border-bottom: 1px solid #dddddd;
    }

    .myEventsTable tbody tr:last-of-type {
        border-radius: 25px;
        border-bottom: 2px solid #293250;
    }

    tr:hover {
        background-color: #ffffff;
        
    }


</style>