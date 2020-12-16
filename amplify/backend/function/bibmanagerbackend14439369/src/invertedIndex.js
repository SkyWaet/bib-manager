const fs = require('fs');
const natural = require('natural');

module.exports = invertedIndexCreator = () => {
    const jsonBib = fs.readFileSync('global_bib.json', 'utf-8');
    const parsedBibitems = Object.values(JSON.parse(jsonBib));
    const tokenizer = new natural.WordTokenizer();
    const invertedIndex = {};
    parsedBibitems.forEach(bib => {
        let vals = Object.values(bib);
        for (let i in vals) {
            let tokens = tokenizer.tokenize(vals[i]);
            tokens.forEach(token => {
                if (invertedIndex.hasOwnProperty(token)) {
                    if(!invertedIndex[token].includes(bib.tag)){
                        invertedIndex[token].push(bib.tag);
                    }                    
                } else {
                    invertedIndex[token] = [bib.tag];
                }
            })
        }
    })
     fs.writeFileSync('invertedIndex.json', JSON.stringify(invertedIndex));
}

invertedIndexCreator();