const fs = require('fs');
const natural = require('natural');

const invertedIndexSearch = (searchString) => {
    const invertedIndex = JSON.parse(fs.readFileSync('./invertedIndex.json', 'utf-8'));
    const bibFile = JSON.parse(fs.readFileSync('./global_bib.json', 'utf-8'));
    const tokenizer = new natural.WordTokenizer();
    const tokenizedRequest = tokenizer.tokenize(searchString);
    const rawResult = tokenizedRequest.map(token => invertedIndex[token]);
    const filteredRawResult = rawResult[0].filter(item => filterFunction(item, rawResult.slice(1)));
    const searchResult = filteredRawResult.map(item => bibFile[item]);
    return searchResult;
}

const filterFunction = (item, arrays) => {
    let ans = true;
    for (arr in arrays) {
        ans = ans && arrays[arr].includes(item);
    }
    return ans;
}

module.exports = invertedIndexSearch;