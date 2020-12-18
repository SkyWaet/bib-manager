var fs = require('fs');

module.exports = bibParser = (filename) => {
    const bibfile = fs.readFileSync(`./${filename}`, 'utf-8');
    const sanitaser = elem => elem !== '' && elem !== '\s*' && elem !== '}' && elem !== '\n' && elem !== '\t';
    const bibitems = bibfile.split('@')
        .filter(sanitaser)
        .map(item => item.split('\n').map(
            elem => elem.trim())
            .filter(sanitaser));


    const parsedBibitems = bibitems.map((item, index) => {
        const type = item[0].split('{')[0].toLocaleLowerCase();
        const tag = item[0].split('{')[1].replace(',', '');
        const result = { type, tag };

        for (let i = 1; i < item.length; i++) {
            let key = item[i].split(/\s*=\s*/)[0];
            let val = item[i].split(/\s*=\s*/)[1];

            if (val === undefined) {
                let keys = Object.keys(result);
                if (key[0] === '"') {
                    key = key.replace('"', '');
                }
                else {
                    key = key.replace('},', '}');
                }
                result[keys[keys.length - 1]] += key
            } else {
                if (val[0] === '"') {
                    val = val.replace('",', '').replace('"', '');
                }
                else {
                    val[0] ='';
                    val = val.replace('},', '}');
                }
                result[key.toLocaleLowerCase()] = val;
            }

        }
        return result;
    });

    const currentBibJSONVersion = fs.readFileSync('./global_bib.json', 'utf-8');
    const currentBib = JSON.parse(currentBibJSONVersion);

    parsedBibitems.forEach(bib => {
        if (!currentBib.hasOwnProperty(bib.tag)) {
            currentBib[bib.tag] = bib
        }
    })

    Object.keys(currentBib).forEach(key=>{
        let keys = Object.keys(currentBib[key]);
        for (let i in keys){
            if(currentBib[key][keys[i]].indexOf('{')===0 && currentBib[key][keys[i]].lastIndexOf('')===0){
                currentBib[key][keys[i]] = currentBib[key][keys[i]].slice(1,-1);
            }
        }

    })

    const jsonBib = fs.writeFileSync('./global_bib.json', JSON.stringify(currentBib))
    return parsedBibitems;
};

bibParser('bib_full.bib');
bibParser('bib_leonov.bib');
bibParser('bib_pll.bib');
bibParser('bib_nk.bib');