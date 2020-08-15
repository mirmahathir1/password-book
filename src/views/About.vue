<template>
  <b-jumbotron border-variant="secondary" bg-variant="dark" text-variant="light" data-aos="fade-down">
      <h4>About</h4>
      <p>Page under maintainance...</p>
      <br>
      Upload Files<br />
      <input type="file" id="files" multiple /><br /><br />
      <button id="send">Upload</button>
      <p id="uploading"></p>
      <progress value="0" max="100" id="progress"></progress>
      <br>
      <b-img :src="image" height="100" width="100"></b-img>
  </b-jumbotron>
</template>
<script>
    import firebase from 'firebase';

    export default {
        data:()=>{
            return {
                image: null,
            }
        },
        mounted() {
            let self = this;

            var firebaseConfig = {
                apiKey: "AIzaSyBd6gEvocGx4milMMtOAY7WQaTXENTSseY",
                authDomain: "password-note.firebaseapp.com",
                databaseURL: "https://password-note.firebaseio.com",
                projectId: "password-note",
                storageBucket: "password-note.appspot.com",
                messagingSenderId: "355081452927",
                appId: "1:355081452927:web:1ef0581f80ecf5eabfee4a",
                measurementId: "G-HXEC65D3VP"
            };

            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);

            var files = [];
            document.getElementById("files").addEventListener("change", function(e) {
                files = e.target.files;
                for (let i = 0; i < files.length; i++) {
                    console.log(files[i]);
                }
            });

            document.getElementById("send").addEventListener("click", function() {
                //checks if files are selected
                if (files.length != 0) {
                    //Loops through all the selected files
                    for (let i = 0; i < files.length; i++) {
                        //create a storage reference
                        var storage = firebase.storage().ref(files[i].name);

                        //upload file
                        var upload = storage.put(files[i]);

                        //update progress bar
                        upload.on(
                            "state_changed",
                            function progress(snapshot) {
                                var percentage =
                                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                document.getElementById("progress").value = percentage;
                            },

                            function error() {
                                alert("error uploading file");
                            },

                            function complete() {
                                document.getElementById(
                                    "uploading"
                                ).innerHTML += `${files[i].name} uploaded <br />`;

                                console.log(files[0].name+" uploaded");

                                getFileUrl(files[0].name);
                            }
                        );
                    }
                } else {
                    alert("No file chosen");
                }
            });

            function getFileUrl(filename) {
                //create a storage reference
                var storage = firebase.storage().ref(filename);

                //get file url
                storage
                    .getDownloadURL()
                    .then(function(url) {
                        console.log(url);
                        self.image = url;
                    })
                    .catch(function(error) {
                        console.log("error encountered");
                    });
            }
        },
        methods:{

        }
    }
</script>
