const ShellSpawn = require('./app/lib/ShellSpawn')
const GetExistedArgv = require('./app/lib/GetExistedArgv')
const SetDockerComposeYML = require('./app/lib/SetDockerComposeYML')

// const dialog = require('node-file-dialog')

const fs = require('fs')
const path = require('path')

const lockFile = path.resolve(__dirname, '.lock')
let lock = function () {
	fs.writeFileSync(lockFile, (new Date().toString()))
}

let isLocked = function () {
	return fs.existsSync(lockFile)
}

let unlock = function () {
	fs.unlinkSync(lockFile)
}

function sleep(ms = 500) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let main = async function () {
	while (isLocked()) {
		await sleep()
	}
	lock()

  // 1. 先取得輸入檔案的列表
  let files = GetExistedArgv()

  // console.log('gogogo', files)
  for (let i = 0; i < files.length; i++) {
    let file = files[i]

		// ------------

		// let filename = path.basename(file)
		// let dirname = path.dirname(file)
		// let tempFilename = Math.floor(Math.random() * 100000) + '.zip'
		
		// let tempFilePath = path.resolve(dirname, tempFilename)
		// // console.log(tempFilePath)
		// // console.log(path.resolve(dirname, filename.slice(0, -4) + '.txt'))

		// fs.renameSync(file, tempFilePath)

		// ------------
    
    // SetDockerComposeYML(tempFilePath)
		SetDockerComposeYML(file)
    await ShellSpawn('docker-compose up')

		// --------------

		// fs.renameSync(tempFilePath, file)
		// if (fs.existsSync(path.resolve(dirname, tempFilename.slice(0, -4)) + '.pdf')) {
		// 	fs.renameSync(path.resolve(dirname, tempFilename.slice(0, -4)) + '.pdf', path.resolve(dirname, filename.slice(0, -4)) + '.pdf')
		// }
  }

	unlock()

}

main()
