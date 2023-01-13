import { Bot } from "grammy";
import axios from "axios";


const token = process.env.TOKEN;
const bot = new Bot(token);



async function check(url){
    try {
        let response = await axios.get('http://localhost:7000/check-download/', { params: {URL: url}});
        return response
    } catch(err) {
        return '';
    }
}

function createLink(url){
    return `http://localhost:7000/download/?URL=${url.slice()}`;

}

bot.command('start', (ctx) => {
    ctx.reply('Привет. Я умею скачивать видео с YouTube');
})

bot.command('help', (ctx) => {
    ctx.reply('Просто отправь мне ссылку');
})

bot.on('message::url', (ctx) => {
    try {
        check(ctx.msg.text).then(obj => {
            console.log(obj.data);
            if (obj.data.title) {
                ctx.reply(`
                    Название "${obj.data.title}"\n Автор "${obj.data.author}".\n Это ваше видео?`);
              
            } else {
                ctx.reply('Мы не смогли найти вашу ссылку')
            }
        }).then((obj) => {
            const link = createLink(ctx.message.text);
                ctx.reply(`<a href = "${ctx.message.text}"> Link </a>`, {parse_mode: "HTML"})
        });
    } catch(err){
        ctx.reply('Сервис поиска временно не доступен :(')
    }
})

bot.start(3000);
