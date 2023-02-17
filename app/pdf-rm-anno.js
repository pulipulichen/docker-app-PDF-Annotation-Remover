const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

let main = async function () {
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    
    let filename = path.basename(file)
    let dirname = path.dirname(file)
    let filenameNoExt = path.parse(filename).name
    let ext = path.extname(filename)
    if (ext !== '.pdf' || filename.endsWith('-clean.pdf')) {
      continue
    }

    let fileTmp = `/tmp/input.pdf`
    if (fs.existsSync(fileTmp)) {
      fs.unlinkSync(fileTmp)
    }
    await ShellExec(`cp "${file}" ${fileTmp}`)

    let cleanPDFfileTmp = `/tmp/output.pdf`
    if (fs.existsSync(cleanPDFfileTmp)) {
      fs.unlinkSync(cleanPDFfileTmp)
    }
    await ShellExec(`pdftk "${fileTmp}" output - uncompress | sed '/^\\/Annots/d' | pdftk - output "${cleanPDFfileTmp}" compress`)

    let cleanPDFfile = dirname + '/' + filenameNoExt + '-clean.pdf'
    await ShellExec(`cp "${cleanPDFfileTmp}" ${cleanPDFfile}`)
  }
}

main()