const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views")
app.listen(2000, () => {
    console.log("serve is running")
});
app.get("/", async (req, res) => {
    var bodyHtml = await axios.get('https://gamek.vn');
    const $ = cheerio.load(bodyHtml.data);
    const headMenu = $('.normal a');
    const subMenu = $('.submenu li a')
    let posts = [];
    headMenu.each((i, elm) => {
        let title = elm.attribs.title;
        let link = elm.attribs.href;
        if (typeof title !== 'undefined') {
            posts.push({ 'title': title, 'link': link });
        }
    });
    subMenu.each((i, elm) => {
        let title = elm.attribs.title;
        let link = elm.attribs.href;
        if (typeof title !== 'undefined') {
            const exists  = posts.filter( (e) => {
                return e.title === elm.title
            })
            if(exists === null){
                posts.push({ 'title': title, 'link': link });
            }
        }
        
    });
    res.render("home", {
        category: posts
    })
})
