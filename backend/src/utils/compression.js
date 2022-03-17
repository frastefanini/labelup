import zlib from 'zlib'

export async function compress (json) {
  return new Promise((resolve, reject) => {
    zlib.brotliCompress(JSON.stringify(json), {
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT
      }
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString('base64'))
      }
    })
  })
}

export async function decompress (encodedData, encoding) {
  return new Promise((resolve, reject) => {
    const compressedData = Buffer.from(encodedData, encoding);
    zlib.brotliDecompress(compressedData, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString('utf8'));
      }
    })
  })
}
