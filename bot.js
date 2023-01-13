import { Bot } from "grammy";
import axios from "axios";
import {Menu} from "@grammyjs/menu";

const token = process.env.TOKEN;
const bot = new Bot(token);



async function check(url){
    try {
        let response = await axios.get('http://localhost:6000/check-download/', { params: {URL: url}});
        return response
    } catch(err) {
        return '';
    }
}

function createLink(url){
    return `http://localhost:6000/download/?URL=${url}`;

}

const isValid = new Menu('validation')
    .text("Да", (ctx) => {
        const link = createLink(localLink);
        ctx.reply(`<a href = "${link}"> Link </a>`, {parse_mode: "HTML"})
        ctx.menu.close();
    })
    .text("Нет", (ctx) => { 
        ctx.reply("Попробуйте отправить ссылку еще раз");
        ctx.menu.close();
    })


bot.use(isValid);

let localLink;

bot.command('start', (ctx) => {
    ctx.reply('Привет. Я умею скачивать видео с YouTube');
})

bot.command('help', (ctx) => {
    ctx.reply('Просто отправь мне ссылку');
})

bot.on('message::url', (ctx) => {
    try {
        localLink = ctx.msg.text;
        check(ctx.msg.text).then(obj => {
            console.log(obj.data);
            
            if (obj.data.title) {
                ctx.reply(`
                    Название "${obj.data.title}"\n Автор "${obj.data.author}".\n`);
                    
            } else {
                ctx.reply('Мы не смогли найти вашу ссылку')
            }
        })
        .then((obj) => {
           ctx.reply("Это ваше видео?", {reply_markup: isValid});
           
        });
    } catch(err){
        ctx.reply('Сервис поиска временно не доступен :(')
    }
})

bot.start(3000);
