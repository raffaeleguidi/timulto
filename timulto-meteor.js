Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
    // Show newest tasks first
       return Tasks.find({}, {sort: {createdAt: -1}});
    }, photo: function () {
      return Session.get("photo");
    }
  });

  Template.body.events({
    "click #dajece": function(event) {
        // https://atmospherejs.com/mdg/camera
        MeteorCamera.getPicture(function(error, data) {
           Session.set("photo", data);
            //console.log('ciao');
        })
    },
    "submit .new-task": function (event) {
        // This function is called when the new task form is submitted

        var text = event.target.text.value;
        var imageData = event.target.imgdata.value;

        Tasks.insert({
          text: text,
          imageData: imageData,
          createdAt: new Date() // current time
        });

        // Clear form
        event.target.text.value = "";
        Session.set("photo", '');

        // Prevent default form submit
        return false;
    }
  });
  Template.task.events({
     "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {$set: {checked: ! this.checked}});
      },
      "click .delete": function () {
        Tasks.remove(this._id);
      }
  });
}



