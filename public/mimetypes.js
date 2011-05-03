function getFileExtension(filename) {
    return filename.split('.').pop();
}
var mime_types = {
    'js': 'text/javascript',
    'html': 'text/html',
    'svgz': 'image/svg+xml'
};
