let po2json = require('po2json')
// import po2json from 'po2json'
let fs = require('fs')
fs.readFile('./en.po', function(err, buffer) {
  let jsonData = po2json.parse(buffer)
  for(let key of Object.keys(jsonData)) {
    if (Array.isArray(jsonData[key])) {
      jsonData[key] = jsonData[key][1]
    }
  }
  if (err) { console.log(err) }
  fs.writeFile('./en.js', `var lang=${JSON.stringify(jsonData)};module.exports=lang`, function(err){
    console.log(err)
  })
})
fs.readFile('./tw.po', function(err, buffer) {
  let jsonData = po2json.parse(buffer)
  for(let key of Object.keys(jsonData)) {
    if (Array.isArray(jsonData[key])) {
      jsonData[key] = jsonData[key][1]
    }
  }
  fs.writeFile('./tw.js', `var lang=${JSON.stringify(jsonData)};module.exports=lang`, function(err){})
})