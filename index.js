const axios = require("axios");
const HTMLParser = require("node-html-parser");
const BASE_URL = "https://books.toscrape.com/" 

async function main(){
    console.time("Execution")
    const parsed = HTMLParser.parse(await FetchHtml()).removeWhitespace();
    const navList = GetCategorie(parsed)
    const test = await getNumberBook(navList)
    console.log(test)
    console.timeEnd("Execution")
}

async function FetchHtml(uri = BASE_URL ){
    try {
        const response = await axios.get(uri);
        return response.data;
    } catch (err) {
        console.log(err, "AXIOS ERROR :", uri);
    }
}

function GetCategorie(parsed){
    const categories = parsed.querySelectorAll(".nav-list li ul a")
    const hrefList = categories.map((element) => 
       element.getAttribute("href")
    )
    return hrefList;
}


async function getNumberBook(list){
   const finalArray = await Promise.all(list.map(async (element) => {
        let fetchCategory = HTMLParser.parse( await FetchHtml(BASE_URL+element)).removeWhitespace()
        return {
            category:fetchCategory.querySelector("div.page-header h1").innerHTML,
            number:fetchCategory.querySelector("form.form-horizontal strong").innerHTML
        }
    }))
    return finalArray;
}
main();