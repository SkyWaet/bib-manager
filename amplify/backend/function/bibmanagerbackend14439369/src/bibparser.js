var fs = require('fs');

module.exports =  bibParser = (request) => {
    bibfile = fs.readFileSync('./bib_nk.bib', 'utf-8');
    const sanitaser = elem => elem !== '' && elem !== '\s*' && elem !== '}' && elem !== '\n' && elem !== '\t';
    bibitems = bibfile.split('@')
        .filter(sanitaser)
        .map(item => item.split('\n').map(
            elem => elem.trim())
            .filter(sanitaser));


    parsedBibitems = bibitems.map((item,index) => {
        type = item[0].split('{')[0];
        tag = item[0].split('{')[1];
        result = { type, tag };
       
        for (let i = 1; i < item.length; i++) {
            key = item[i].split(/\s*=\s*/)[0];
            val = item[i].split(/\s*=\s*/)[1];
     
            if (val === undefined){
                keys = Object.keys(result)
                result[keys[keys.length-1]]+=key
            } else{
                result[key] = val;
            }
            
        }
        return result;
    });

    searchResults = parsedBibitems.filter(bib => bib.tag.includes(request) || bib.title.includes(request) || bib.author.includes(request));

    
    return searchResults;
};

