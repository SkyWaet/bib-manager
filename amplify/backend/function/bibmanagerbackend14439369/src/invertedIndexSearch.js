const fs = require('fs');
const natural = require('natural');

const invertedIndexSearch = (bibFile, invertedIndex, searchString) => {
    const tokenizer = new natural.WordTokenizer();
    const tokenizedRequest = tokenizer.tokenize(searchString);
    const indexKeys = Object.keys(invertedIndex);
    const rawResult = tokenizedRequest.map(token => invertedIndex[token] === undefined ? findClosestKeys(indexKeys, token)
        .flatMap(token => invertedIndex[token])
        : invertedIndex[token]).sort((a, b) => a.length - b.length);

    const filteredRawResult = rawResult[0].filter(item => filterFunction(item, rawResult.slice(1)));
    const searchResult = filteredRawResult.map(item => bibFile[item]);
    return searchResult;
}

const findClosestKeys = (keys, token) => {
    let closestDist = natural.JaroWinklerDistance(token, keys[0], undefined, true);
    let closestKeys = [keys[0]];
    for (let i = 1; i < keys.length; i++) {
        let currDist = natural.JaroWinklerDistance(token, keys[i], undefined, true);
        if (currDist > closestDist) {
            closestKeys = [keys[i]];
            closestDist = currDist
        } else if (currDist === closestDist) {
            closestKeys.push(keys[i])
        }
    }
    return closestKeys;
}
const filterFunction = (item, arrays) => {
    let ans = true;
    for (arr in arrays) {
        ans = ans && arrays[arr].includes(item);
    }
    return ans;
}

/*const invertedIndex = JSON.parse(fs.readFileSync('./invertedIndex.json', 'utf-8'));
const bibFile = JSON.parse(fs.readFileSync('./global_bib.json', 'utf-8'));
console.log(invertedIndexSearch(bibFile, invertedIndex, 'kUznEtSoV, Yuldashev, M.V.'))*/

module.exports = invertedIndexSearch;