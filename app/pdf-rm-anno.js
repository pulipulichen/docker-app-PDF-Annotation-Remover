const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

let RemoveSVGBackground = function(file) {
  let content = fs.readFileSync(file, 'utf8')

  // let pos1 = content.indexOf(`<path fill="#000000" d="`)
  // let footer = `" fill-rule="evenodd"/>`
  // let pos2 = content.indexOf(footer, pos1)

  // console.log(pos1, pos2)
  // content = content.slice(0, pos1) + content.slice(pos2 + footer.length)

  let xmlObject = $(`<div>` + content + `</div>`)
  // console.log(xmlObject.find('path[fill="#ffffff"][d][fill-rule="evenodd"]:first').length)
  // xmlObject.find('path[fill="#ffffff"][d][fill-rule="evenodd"]:first').remove()
  xmlObject.find('rect[style="fill:#ffffff;fill-opacity:1;stroke:none"]:first').remove()

  // console.log(xmlObject.html())
  fs.writeFileSync(file, xmlObject.html(), 'utf8')
}

let main = async function () {
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    
    let filename = path.basename(file)
    let dirname = path.dirname(file)
    let filenameNoExt = path.parse(filename).name
    let ext = path.extname(filename)
    if (ext !== '.pdf') {
      continue
    }


    let cleanPDFfile = dirname + '/' + filenameNoExt + '-clean.pdf'
    await ShellExec(`pdftk "${file}" output - uncompress | sed '/^\/Annots/d' | pdftk - output "${cleanPDFfile}" compress`)
  }
}

main()