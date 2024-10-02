const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// List of Pinterest URLs
const urls = [
  "https://in.pinterest.com/pin/55169164187657842/",
  "https://in.pinterest.com/pin/9499849208655406/",
  "https://in.pinterest.com/pin/429882726951484330/",
  "https://in.pinterest.com/pin/678776975123408447/",
  "https://in.pinterest.com/pin/290411875987213354/",
  "https://in.pinterest.com/pin/536772849356156551/",
  "https://in.pinterest.com/pin/264938390600854181/",
  "https://in.pinterest.com/pin/595108538293829947/",
  "https://in.pinterest.com/pin/918312180265732694/",
  "https://in.pinterest.com/pin/12173861486716782/",
  "https://in.pinterest.com/pin/437201076336395326/",
  "https://in.pinterest.com/pin/13792342602484896/",
  "https://in.pinterest.com/pin/129056345566709050/",
  "https://in.pinterest.com/pin/3237030976697475/",
  "https://in.pinterest.com/pin/49680402135797538/",
  "https://in.pinterest.com/pin/355784439331489585/",
  "https://in.pinterest.com/pin/1688918605434276/",
  "https://in.pinterest.com/pin/19562579623133587/",
  "https://in.pinterest.com/pin/24910604182501680/",
  "https://in.pinterest.com/pin/124974958403865047/",
  "https://in.pinterest.com/pin/315252042684899320/",
  "https://in.pinterest.com/pin/5981412000443288/",
  "https://in.pinterest.com/pin/361765782586034222/",
  "https://in.pinterest.com/pin/176555247884397472/",
  "https://in.pinterest.com/pin/111464159522523005/",
  "https://in.pinterest.com/pin/275775177176142891/",
  "https://in.pinterest.com/pin/76350156176090157/",
  "https://in.pinterest.com/pin/1101974602551301109/",
  "https://in.pinterest.com/pin/1058134874924505206/",
  "https://in.pinterest.com/pin/859976491372983096/",
  "https://in.pinterest.com/pin/11329436556598581/",
  "https://in.pinterest.com/pin/534802524519794874/",
  "https://in.pinterest.com/pin/783696772682189387/",
  "https://in.pinterest.com/pin/391953973837514155/",
  "https://in.pinterest.com/pin/13792342602398203/",
  "https://in.pinterest.com/pin/1062708843303746500/",
  "https://in.pinterest.com/pin/964333338935661498/",
  "https://in.pinterest.com/pin/984951380986413092/",
  "https://in.pinterest.com/pin/137711701099781920/",
  "https://in.pinterest.com/pin/2251868557438512/",
  "https://in.pinterest.com/pin/74520568827885148/",
  "https://in.pinterest.com/pin/502010689727878087/",
  "https://in.pinterest.com/pin/116038127892462729/",
];

// Folder to save images
const folder = "./images";

// Create folder if it doesn't exist
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}

// Function to download image
const downloadImage = async (url, fileName) => {
  try {
    const response = await axios({
      url,
      responseType: "stream",
    });
    const filePath = path.resolve(folder, fileName);
    response.data.pipe(fs.createWriteStream(filePath));

    return new Promise((resolve, reject) => {
      response.data.on("end", () => {
        resolve();
      });

      response.data.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

// Function to scrape and find image URL from Pinterest page
const scrapeImageURL = async (pageUrl) => {
  try {
    const { data } = await axios.get(pageUrl);
    const $ = cheerio.load(data);

    // Find image URL from the Pinterest meta tags
    const imageUrl = $('meta[property="og:image"]').attr("content");

    if (imageUrl) {
      // const fileName = imageUrl.split('/').pop().split('?')[0]; // Extract image name from URL
      // console.log(`Downloading: ${fileName} from ${pageUrl}`);
      const pinId = pageUrl
        .split("/")
        .filter((part) => part)
        .pop();
      const fileName = `${pinId}.jpg`;
      await downloadImage(imageUrl, fileName);
    } else {
      console.log(`No image found on ${pageUrl}`);
    }
  } catch (error) {
    console.error("Error scraping the page:", error);
  }
};

// Loop through all Pinterest URLs and download images
const downloadImagesFromUrls = async () => {
  for (const url of urls) {
    await scrapeImageURL(url);
  }
  console.log("Download completed!");
};

// Start downloading images
downloadImagesFromUrls();
