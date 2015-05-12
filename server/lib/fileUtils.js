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
    var filename = getImageFileNames(fine);
    try {
        fs.unlinkSync(filename.image);
        console.log('fine %s image deleted', fine._id);
    } catch(ex) {
        // noop
        console.error('error: ', ex.message);
    }
    try {
        fs.unlinkSync(filename.thumb);
        console.log('fine %s thumb deleted', fine._id);
    } catch(ex) {
        // noop
        console.error('error: ', ex.message);
    }
}

fileUtils = {
    cleanTmpImages : function(fine){
        console.log('before cleanTmpImages');
        cleanTmpImages(fine);
        console.log('after cleanTmpImages');
    }
}
