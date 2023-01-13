import ytdl from 'ytdl-core';
import logger from 'morgan';
import bodyParser from 'body-parser';

import express from 'express';

const app = express();

app.use(logger());
app.use(bodyParser.json())

app.get('/check-download', async (req, res) => {
    try {
      
        const URL = req.query.URL;
        console.log(URL)
        const info = await ytdl.getBasicInfo(URL);
        res.json({
          title: info.videoDetails.title,
          author: info.videoDetails.author.name
        })
        console.log('Ok');
    }
    catch (err) {
      const URL = req.query.URL;
        console.log(url)
        res.send({});
    }
});

app.get('/download', async (req, res) => {
  try {
    const { URL, title } = req.query;
    res.header(
        'Content-Disposition',
        `attachment; filename="${title.substring(0, 25)}.mp4"`,
      );
    ytdl(URL).pipe(res);
  } catch (err) {
    res.send(err);
  }
}
);

app.get('/', (req, res) => {
    res.send('INDEX');
})
app.listen({ port: 6000 }, () => console.log(' Server ready'));