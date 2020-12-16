const fs = require('fs');

module.exports = bibsearch = (request) => {
    const jsonBib = fs.readFileSync('global_bib.json', 'utf-8');
    const parsedBibitems = Object.values(JSON.parse(jsonBib));
    const parsedRequest = request.split(', ');
    const searchResults = parsedBibitems.filter(bib => {
        const values = Object.values(bib);
        for (let i in values) {
            if (values[i].includes(userRequest)) {
                return true;
            }
        }
        return false;

    });
    return searchResults;
}

const filterFunction = async (values, userRequest) => {
    for (let i in values) {
        if (values[i].includes(userRequest)) {
            return true;
        }
    }
    return false;
}

const findBibWithoutTitle = () => {
    const jsonBib = fs.readFileSync('global_bib.json', 'utf-8');
    const parsedBibitems = Object.values(JSON.parse(jsonBib));
    const searchResults = parsedBibitems.filter(bib => !bib.hasOwnProperty('title'));
    return searchResults;
}
console.log(findBibWithoutTitle());