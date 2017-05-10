// author: abhishek kumar
// importing required modules
const log4js = require('log4js');
const logger = log4js.getLogger();
const rl = require('readline');
const fs = require('fs');
// create module convert
let convert = function convert(startYear) {
	// startyear validation
	if (isNaN(startYear)) {
		logger.error('given year is not a number');
	}
	// creating readstream interface
	const lineReader = rl.createInterface({
		input: fs.createReadStream('../inputdata/Indicators.csv')
	});
	let objarr = [];
	// function to read values of rural % population and urban % population
	// from each line
	lineReader.on('line', function(line) {
		let l = line;
		let linearr = l.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
		if (linearr[1] === 'IND') {
			let obj = {};
			if (linearr[3] === 'SP.URB.TOTL.IN.ZS') {
				obj['country'] = linearr[0];
				obj['urban_pop'] = linearr[5];
				obj['year'] = linearr[4];
				objarr.push(obj);
			}
			if (linearr[3] === 'SP.RUR.TOTL.ZS') {
				obj['country'] = linearr[0];
				obj['rural_pop'] = linearr[5];
				obj['year'] = linearr[4];
				objarr.push(obj);
			}
		}
	});
	let jsondata = [];
	let jsonarr = [];
	// function to create final array of objects
	lineReader.on('close', function() {
		for (let i = 0; i < objarr.length; i = i + 2) {
			if (objarr[i].year === objarr[i + 1].year) {
				objarr[i]['urban_pop'] = objarr[i + 1].urban_pop;
				jsonarr.push(objarr[i]);
			}
		}
		// creating JSON data from the array
		jsondata = JSON.stringify(jsonarr);
		// creating JSON file in outputdata
		fs.writeFile('../outputdata/worldDevIndicatorUrbanizationAbhishek.json', jsondata);
	});
	return 'JSON written successfully';
};
convert();
module.exports = convert;
