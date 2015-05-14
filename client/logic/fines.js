Template.fineInARow.rendered = function() {
    var now = moment();
//    console.log("resetting last used to " + now.toString());
    Session.set("lastUsed", now.toString());
};

Template.fineInARow.helpers({
    imageUrl: function(){
        return Session.get("rootUrl") + "api/image/" + this._id + "?v=" + this.version;
    },
    likes: function() {
        return this.likes ? this.likes.length : 0;
    },
    iLikeThis: function() {
        if (this.likes) {
            return this.likes.indexOf(userUtils.getCurrentUsername()) >= 0;
        }
        return false;
    }
});

Template.fineInARow.events({
    "click .fine":function(){
        Session.set("lat",this.loc.coordinates[1]);
        Session.set("lon",this.loc.coordinates[0]);
        Session.set("_id", this._id);
        Session.set("createdAt", this.createdAt);
        Session.set("detailUsername", this.username);
        Session.set("detailText",this.text);
        Session.set("detailAddress",this.address);
        Session.set("detailCategory",this.category);
        Session.set("likes",this.likes);
        //Session.set("detailImageData",$('img[name="imageData' + this._id + '"]').attr('src'));
        Session.set("approved", this.approved);
        Session.set("version", (this.version ? this.version : "1"));

        Router.go('/dettaglio');
    }
});

Template.fine.events({
    "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {
            $set: {
                checked: !this.checked
            }
        });
    },
    "click .delete": function () {
        Meteor.call("deleteFine", this._id);
    }
});
