const { existsSync, mkdirSync, writeFileSync } = require("fs")
const { extname } = require("path")
const config = require("../config.json")

module.exports = {
    upload: async (file) => {
        const random = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join(""); 
        const filePath = `${config.storagePath}/${random}${extname(file.name)}`

        const filename = `${config.domainUrl}/${filePath}`
        const existFilDir = existsSync(config.storagePath)
        if (!existFilDir) mkdirSync(config.storagePath, {recursive:true})

        writeFileSync(filePath, file.data)
        return filename
    }
}

