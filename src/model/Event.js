module.exports = function(
    id,
    title,
    description,
    location,
    start,
    link
) {
    this.toJsObject = function() {
        return {
            id: id,
            title: title,
            description: description,
            location: location,
            start: start,
            link: link
        };
    };

    this.id = id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.start = start;
    this.link = link;
    Object.freeze(this);

};
