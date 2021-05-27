<template>
    <div>
        <div>
            <div v-if="errorFlag" style="color: red;">
                Error: {{ error }}
            </div>
        </div>

        <div class="sortBox">

            <div class="searchEventTitle">
                <h4>Search Events</h4>
            </div>

            <div class="sortBySection">
                <div>
                    <h5>Sort By</h5>
                </div>
                <div class="sortList" v-for="sortOption in sortOptions"
                    v-bind:key="sortOption.name">
                    <input class="radioStyle" v-model="eventSort" type="radio" name="sort" v-bind:value=sortOption.name v-on:change="updateFilters()">
                    <label for=sortOption.name> {{sortOption.description}} </label>
                </div>
                <div style="clear:both;"></div>
            </div>



            <div class="categorySection">
                <div>
                    <h5>Categories</h5>
                </div>
                <div style="float:left" v-for="category in eventCategories"
                    v-bind:key="category.name">
                    <input class="categoryBntStyle" v-model="eventCategory" type="checkbox" name="category" :value="category.id">
                    <label class="categoryStyle" for=category.id>{{category.name}}</label><br>
                </div>
                <div style="clear:both;"></div>
            </div>



            <div>
                <form class="searchFunction" style="float:left" @submit.prevent v-on:submit="updateFilters();">
                    <h5>Search Keyword</h5>
                    <input v-model="search" placeholder="search" v-on:change="updateFilters()" /> 
                    <br>
                    <br>
                    <input type="submit" class="btn btn-primary" value="Search Filters"/>
                    <div style="clear:both;"></div>
                </form>
                <div style="clear:both;"></div>
            </div>

        </div>

        <div class="pageBar">
            <div class="results">
                Results per page
                <input v-model="count" v-on:change="updateFilters()" />
            </div>

            <div class="page">
                Page
                <input type="number" v-model="page" v-on:change="updateFilters()" />
            </div>
        </div>



        <div id="events">
            <table class="styled-table">
                <thead>
                    <tr>
                        <td></td>
                        <td>Title</td>
                        <td>Date and Time</td>
                        <td>Categories</td>
                        <td>Host</td>
                        <td>Number of Attendees</td>
                        
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="event in events"
                    v-bind:key="event.eventId">
                        <td>
                            <img @error="defaultImage($event)" :src=eventImage(event.eventId)  height="100" width="150"/>
                        </td>
                        <td><router-link :to="{ name: 'event', params: { eventId: event.eventId }}">
                            {{ event.title }}</router-link></td>
                        <td>{{ event.date }}</td>
                        <td>{{ event.categories }}</td><!--make function-->
                        <td>{{ event.organizerFirstName }} {{ event.organizerLastName }}</td>
                        <td>{{ event.numAcceptedAttendees }}</td>

                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>


<script>
export default {
    data () {
        return {
                error: "",
                errorFlag: false,
                events: [],

                count: 10,
                page: 1,

                eventSort: "DATE_ASC",
                search: "",
                eventCategory: [],

                eventCategories: [],
                sortOptions: [{name:"DATE_ASC", description:"Date earliest-latest"},
                    {name:"DATE_DESC", description:"Date latest-earliest"},
                    {name:"ATTENDEES_DESC", description:"Number of attendees desc"}, 
                    {name:"ATTENDEES_ASC", description:"Number of attendees asc"}],

        }
    },
    mounted: function() {
        this.getEvents();
        this.getEventCategories();
    },
    methods: {
        getEvents() {
            let params = {};
            if(this.search != "") {
                params.q = this.search
            }
            if(this.eventCategory != []) {
                params.categoryIds = this.eventCategory;
            }
            params.sortBy = this.eventSort;
            params.startIndex = (this.page - 1) * this.count;
            params.count = this.count;
            this.axios.get('http://localhost:4941/api/v1/events', {params: params})
            .then((response) => {
                this.events = response.data;
                if (this.events.length == 0 && this.page != 0) {
                    alert("No more pages");
                    this.page -= 1;
                    this.getEvents()
                }
            }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },
        getEventCategories() {
            this.axios.get('http://localhost:4941/api/v1/events/categories')
            .then((categoriesResponse) => {
                this.eventCategories = categoriesResponse.data;
            }, (error) => {
                alert(error.response.statusText);
                this.error = error;
                this.errorFlag = true;
            });
        },

        getCategories(ids) {

            for (let i=0; i < ids.length; i++) {
                this.axios.get('http://localhost:4941/api/v1/events/categories')
                .then((categoriesResponse) => {
                    console.log(categoriesResponse.data)
                    return categoriesResponse.data.name;
                });
            }

        },

        formatDate(eventDate) {
            this.date = new Date(eventDate)
            return this.date.toString();
        },

        updateFilters: function() {
            this.getEvents();
        },

        eventImage(eventId) {
            return "http://localhost:4941/api/v1/events/" + eventId + "/image";

        },

        defaultImage(event) {
            event.target.src = "https://thumbs.dreamstime.com/b/no-image-icon-vector-available-picture-symbol-isolated-white-background-suitable-user-interface-element-205805243.jpg";
        }
    }
}
</script>








<style scoped>
    .styled-table {
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

    .styled-table thead tr {
        background-color:  #FFD55A;
        color: #293250;
        text-align: left;
        font-size: medium;
        font-weight: bold;
        border-top-right-radius: 25px;
    }

    .styled-table th,
    .styled-table td {
        padding: 12px 15px;
        
        
    }

    .styled-table tbody tr {
        border-radius: 25px;
        border-bottom: 1px solid #dddddd;
    }

    .styled-table tbody tr:last-of-type {
        border-radius: 25px;
        border-bottom: 2px solid #293250;
    }

    tr:hover {
        background-color: #ffffff;
        
    }

    .sortBox {
        background-color: white;
        margin: 20px auto;
        width: 70%;
        padding: px;
        min-width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        border-radius: 25px;
    }

    .searchEventTitle {
        border-top-right-radius: 25px;
        margin: 10px center;
        padding: 5px;
        background-color: #FFD55A;
        text-align: left;
    }

    .sortBySection {
        margin: 10px center;
        padding: 5px;
        text-align: left;
        float: left;
    }

    .categorySection {
        margin: 10px center;
        padding: 5px;
        text-align: left;
        float: left;
    }

    .searchFunction {
        margin: 10px center;
        padding: 10px;
        text-align: left;
        float: left;
    }

    
    .categoryStyle {
        padding: 1px;
    }

    .radioStyle {
        margin: 10px;
    }

    .categoryBntStyle {
        margin: 10px;
    }

    .pageBar {
        margin: 20px auto;
        width: 70%;
        display: flex;
        padding: 5px;
        background-color: #6DD47E;
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
        border-bottom-left-radius: 25px;


    }

    .results {
        margin: 10px;
        text-align: center;
        vertical-align: middle;
    }

    .page {
        margin: 10px;
        text-align: center;
        vertical-align: middle;
    }


</style>