import http from 'http'
import https from 'https'
import 'dotenv/config'
import { fetchSpotifyToken, getSpotifyToken, } from './index.js'

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

const serverHandler = async (req, res) => {

    const requestURL = new URL(req.url, `http://${req.headers.host}`) 

    // initializing token
    let token = ''

    // GET http://HOST:PORT/
    if(req.method === 'GET' && requestURL.pathname === '/'){
        console.log('someone accessing root')
        res.writeHead(200, 'OK', {
            "Content-Type" : "text/plain"
        })
        res.write(`${requestURL.searchParams.toString()}\n\n`)
        res.end('End of the message')
   } 

    // GET http://HOST:PORT/get-spotify-token/
    else if (req.method === 'GET' && requestURL.pathname === '/get-spotify-token'){
        try {
            console.log('accessed /get-spotify-token')
            console.log('taking redirected url....')

            const responseToken = await fetchSpotifyToken(`${requestURL.origin}/add-songs-spotify-playlist`)
            const responseTokenURL = await responseToken.url

            res.writeHead(302, 'Moving you to the redirected URL', {
                'location' : responseTokenURL
            })
            res.end()
            getSpotifyToken(responseTokenURL)
        } catch (err) {
            console.error(`Error inside /get-spotify-token/ path : ${err}`)
        }
   } 

   // POST http://HOST:PORT/add-songs-spotify-playlist/
   else if (req.method === 'GET' && requestURL.pathname === '/add-songs-spotify-playlist'){
        console.log('someone accessing /add-songs-spotify-playlist')
        res.writeHead(200, 'OK', {
            "Content-Type" : "text/html"
        })
        res.write('<html><body><h1>test</h1></body></html>')
        // res.end(fetchSpotifyToken(requestURL.origin))
    } 

    // else {
    //     res.statusCode = 404
    //     res.setHeader('Content-Type', 'text/html')
    //     res.end('
    //         <html>
    //             <body>
    //                 <h1>ga nemu cok</h1>
    //             </body>
    //         </html>')
    // }
}

const server = http.createServer(serverHandler)
server.listen(PORT, HOST, () => {
    console.log(`Server is running at ${HOST}:${PORT}`)
})