const formatName = (name) => {
    return name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1).toLowerCase()
        )
        .join(" ");
};

module.exports = formatName;