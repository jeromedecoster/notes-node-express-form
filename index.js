const bodyParser = require('body-parser')
const express = require('express')
const multer = require('multer')

const app = express()
app.use(express.static('public'))

const upload = multer({ storage: multer.memoryStorage() })

/*
    curl --request POST --form "a_file=@data.json" \
    --form "value=abc" http://localhost:3000/data-one
*/
app.post('/data-one', upload.single('a_file'), (req, res) => {
    console.log('req.body:', req.body)
    console.log('req.file:', req.file)

    if (req.file && req.file.buffer != null) {
        console.log('json:', JSON.parse(req.file.buffer))
    }
    res.json({
        status: 200,
        message: 'ok'
    })
})

/*
    curl --request POST --form "a_json_file=@data.json;type=application/json" \
    --form "a_txt_file=@data.txt" --form "a_checkbox=ok" \
    --form "a_radio=abc" --form "a_thing=123" \
    --form "a_thing=456" http://localhost:3000/data-two
*/
app.post('/data-two', upload.any(), (req, res) => {
    console.log('req.body:', req.body)
    console.log('req.files:', req.files)

    var f1 = req.files.find(e => e.fieldname == 'a_json_file')
    if (f1 != null) {
        console.log('json:', JSON.parse(f1.buffer))
    }
    var f2 = req.files.find(e => e.fieldname == 'a_txt_file')
    if (f2 != null) {
        console.log('txt:', f2.buffer.toString())
    }

    res.send('ok')
})

/*
    curl --request POST --data "@urlencoded.txt"  http://localhost:3000/data-three

    curl --request POST \
    --data "a_checkbox=good&a_radio=123&a_value=789&other_thing=ghi&other_thing=jkl" \
    http://localhost:3000/data-three
*/
app.post('/data-three', bodyParser.urlencoded({ extended: true }), (req, res) => {
    console.log('req.body:', req.body)

    res.send('<h1>ok</h1>')
})

app.listen(3000, () => { console.log('http://localhost:3000/') })