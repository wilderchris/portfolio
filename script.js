
function redirect(url) {
    let aTag = $('<a href="#"></a>');
    aTag.attr('href', url);
    aTag[0].click();
}