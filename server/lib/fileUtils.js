var fs = Npm.require('fs');
var os = Npm.require('os');

function getImageFileNames(fine) {
    var tmpthumb = os.tmpdir() + '/' + fine._id + '-thumb.png';
    var tmpfile  = os.tmpdir() + '/' + fine._id + '.png';
    return {
        image: tmpfile,
        thumb: tmpthumb
    }
}
function cleanTmpImages(fine) {
    try {
        var filename = getImageFileNames(fine);
        fs.unlinkSync(filename.image);
        fs.unlinkSync(filename.thumb);
        console.log('fine %s images deleted', fine._id);
    } catch(ex) {
        // noop
        console.error('error: ', ex.message);
    }
}

Meteor.fileUtils = {
    cleanTmpImages : function(fine){
        console.log('before cleanTmpImages');
        cleanTmpImages(fine);
        console.log('after cleanTmpImages');
    }
}
